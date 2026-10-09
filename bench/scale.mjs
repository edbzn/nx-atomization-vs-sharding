#!/usr/bin/env node
// Workspace-size scaling experiment: how Nx-side overhead of atomization grows with the
// number of projects. See "Scaling experiment" in bench/README.md.
//
//   node bench/scale.mjs [--sizes 20,100,500,1500] [--variants baseline,atomized,sharded]
//        [--reps 2] [--run-reps 1] [--parallel 16] [--phases graph-cold,taskgraph,hash,run]
//        [--out results/scale] [--ws-dir workspaces/scale] [--timeout-min 120]
//        [--interval 200] [--cooldown 2] [--retry-failed] [--dry-run] [--est-cores 16]
//
// Phases (per size x variant; variants interleaved and rotated per rep within a size):
//   graph-cold  wipe .nx/workspace-data, time `nx show projects --json`             (reps)
//   taskgraph   wipe .nx/workspace-data, time `nx run-many -t <t> --graph=<f>.json`  (reps; no task runs;
//               NB: Nx 23.3 builds the project graph twice on this path, see README)
//   hash        wipe .nx, `nx run-many -t <t> ...` that exits when the orchestrator would start:
//               boot + project graph + task graph + upfront hashing of every task      (reps)
//   run         wipe .nx, NX_PROFILE, `nx run-many -t <t> --parallel=P --skip-nx-cache --outputStyle=static` (run-reps)
// Plus an untimed `stats` step per workspace (`nx graph --file`): projects, targets, atoms, shards.
//
// Every command runs under /usr/bin/time -f '%e %M %U %S' with nxEnv(); the nx process tree is
// polled from /proc for the coordinator's own peak RSS (VmHWM), its plugin workers, and the
// whole tree. Results: <out>/raw/n<N>/<variant>/<phase>-r<i>.json (resumable: existing results
// are skipped). Never relies on the Nx cache (`run` uses --skip-nx-cache).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, createWriteStream } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { parseArgs } from 'node:util';
import os from 'node:os';
import { BENCH_DIR, RESULTS_DIR, nxEnv } from './lib/config.mjs';
import { readMeminfo, readStat } from './lib/proc.mjs';
import { max, median, p95, round, sum, fmtMs } from './lib/stats.mjs';
import { parsePerformanceReport } from './lib/perf-report.mjs';
import { buildModel, buildTree, generateWorkspace, planTotals, workspaceDir, DEFAULT_SCALE_DIR, SCALE_VARIANTS } from '../generator/scale.mjs';

const HOOK = join(BENCH_DIR, 'lib', 'nx-hook.cjs');
export const PHASES = ['graph-cold', 'taskgraph', 'hash', 'run'];
export const TARGET = { baseline: 'test', atomized: 'test-ci', sharded: 'test-ci' };
/** Duration for estimates (stats.mjs fmtMs can print "5m60s"). */
const fmtEst = (ms) => {
  const t = Math.round(ms / 1000);
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m${String(t % 60).padStart(2, '0')}s` : `${Math.floor(t / 3600)}h${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}m`;
};
const CACHE_HIT = new Set(['local-cache', 'local-cache-kept-existing', 'remote-cache']);

// ------------------------------------------------------------------ process tree sampling
function childrenOf(pid) {
  const out = [];
  let tids;
  try {
    tids = readdirSync(`/proc/${pid}/task`);
  } catch {
    return out;
  }
  for (const tid of tids) {
    try {
      const s = readFileSync(`/proc/${pid}/task/${tid}/children`, 'latin1').trim();
      if (s) for (const c of s.split(' ')) out.push(Number(c));
    } catch {}
  }
  return out;
}

function readHwmKb(pid) {
  try {
    const s = readFileSync(`/proc/${pid}/status`, 'latin1');
    const i = s.indexOf('VmHWM:');
    return i < 0 ? null : Number(s.slice(i + 6, s.indexOf('kB', i)).trim());
  } catch {
    return null;
  }
}

/**
 * Polls the tree under `rootPid` (/usr/bin/time). Roles: `nx` = the coordinator (time's
 * child); each direct child of nx is a `worker` (Nx plugin worker: its cmdline runs
 * isolation/plugin-worker.js) or a `task` (anything else Nx spawns: task processes), and every
 * deeper descendant inherits its top-level ancestor's role (esbuild under a plugin worker is a
 * worker; sh/vitest/workers under a task are the task). Classification by ancestry, not by env:
 * a short-lived process can exit (or be mid-exec) before its environ is readable.
 */
class TreeSampler {
  constructor(rootPid, intervalMs) {
    this.rootPid = rootPid;
    this.intervalMs = intervalMs;
    this.procs = new Map(); // pid -> {starttime, role, hwmKb, comm}
    this.top = new Map(); // direct children of nx: pid -> {starttime, role}
    this.nxPid = null;
    this.peakTreeRss = 0;
    this.peakCoordRss = 0;
    this.peakTaskProcs = 0;
    this.ticks = 0;
    this.tickMs = [];
    this.timer = setInterval(() => this.tick(), intervalMs);
    this.tick();
  }
  topRole(pid, starttime) {
    const known = this.top.get(pid);
    if (known && known.starttime === starttime) return known.role;
    let cmd = '';
    try {
      cmd = readFileSync(`/proc/${pid}/cmdline`, 'latin1');
    } catch {}
    // A fresh fork shows the parent's cmdline until it execs: decide only once it differs.
    if (!cmd || cmd.includes('nx-hook.cjs') || cmd.includes('/bin/nx.js')) return null;
    const role = cmd.includes('plugin-worker') ? 'worker' : 'task';
    this.top.set(pid, { starttime, role });
    return role;
  }
  tick() {
    const t0 = performance.now();
    const top = childrenOf(this.rootPid);
    if (this.nxPid == null && top.length) this.nxPid = top[0];
    // [pid, top-level ancestor pid (null for nx itself)]
    const seen = this.nxPid != null ? [[this.nxPid, null]] : [];
    const stack = this.nxPid != null ? childrenOf(this.nxPid).map((c) => [c, c]) : [];
    while (stack.length) {
      const [pid, topPid] = stack.pop();
      seen.push([pid, topPid]);
      for (const c of childrenOf(pid)) stack.push([c, topPid]);
    }
    const topRoles = new Map();
    for (const [pid, topPid] of seen) {
      if (pid !== topPid) continue;
      const st = readStat(pid);
      topRoles.set(pid, st ? this.topRole(pid, st.starttime) : null);
    }
    let all = 0;
    let coord = 0;
    let tasks = 0;
    for (const [pid, topPid] of seen) {
      const st = readStat(pid);
      if (!st) continue;
      const role = topPid == null ? 'nx' : (topRoles.get(topPid) ?? 'pending');
      let p = this.procs.get(pid);
      if (!p || p.starttime !== st.starttime) {
        p = { starttime: st.starttime, role, hwmKb: 0, comm: st.comm };
        this.procs.set(pid, p);
      }
      p.role = role;
      p.comm = st.comm;
      all += st.rssBytes;
      if (role === 'task' || role === 'pending') tasks++;
      else {
        coord += st.rssBytes;
        const hwm = readHwmKb(pid);
        if (hwm != null && hwm > p.hwmKb) p.hwmKb = hwm;
      }
    }
    this.peakTreeRss = Math.max(this.peakTreeRss, all);
    this.peakCoordRss = Math.max(this.peakCoordRss, coord);
    this.peakTaskProcs = Math.max(this.peakTaskProcs, tasks);
    this.ticks++;
    this.tickMs.push(performance.now() - t0);
  }
  stop() {
    clearInterval(this.timer);
    const mb = (kb) => round(kb / 1024, 1);
    const workers = [...this.procs.values()].filter((p) => p.role === 'worker');
    const nx = [...this.procs.values()].find((p) => p.role === 'nx');
    const workerComms = {};
    for (const w of workers) workerComms[w.comm] = (workerComms[w.comm] ?? 0) + 1;
    return {
      nxPeakRssMb: nx ? mb(nx.hwmKb) : null,
      workers: workers.length,
      workersPeakRssMbSum: mb(sum(workers.map((w) => w.hwmKb))),
      workersPeakRssMbMax: workers.length ? mb(max(workers.map((w) => w.hwmKb))) : 0,
      workerComms,
      coordTreePeakRssMb: round(this.peakCoordRss / 2 ** 20, 1),
      treePeakRssMb: round(this.peakTreeRss / 2 ** 20, 1),
      peakTaskProcs: this.peakTaskProcs,
      taskProcsSeen: [...this.procs.values()].filter((p) => p.role === 'task').length,
      samplerTicks: this.ticks,
      samplerTickMsMean: this.tickMs.length ? round(sum(this.tickMs) / this.tickMs.length, 2) : null,
    };
  }
}

// ------------------------------------------------------------------ one measured command
function nxBin(ws) {
  return join(ws, 'node_modules', 'nx', 'dist', 'bin', 'nx.js');
}

/**
 * Runs `node <nx|hook> ...args` under /usr/bin/time in `ws`. stdout/stderr go to files.
 * Returns timing + memory. `launcher`: 'nx' (the workspace's nx bin) or 'hook' (nx-hook.cjs).
 */
async function measure({ ws, args, launcher = 'nx', env = {}, stdoutFile, stderrFile, timeoutMs, intervalMs }) {
  const timeFile = `${stderrFile}.time`;
  const entry = launcher === 'hook' ? [HOOK] : launcher === 'ready' ? ['-e', READY_LAUNCHER] : [nxBin(ws)];
  const argv = ['-f', '%e %M %U %S', '-o', timeFile, process.execPath, ...entry, ...args];
  const out = stdoutFile ? createWriteStream(stdoutFile) : null;
  const err = createWriteStream(stderrFile);
  const spawnAt = Date.now();
  const child = spawn('/usr/bin/time', argv, { cwd: ws, env: nxEnv(ws, env), stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  if (out) child.stdout.pipe(out);
  else child.stdout.resume();
  child.stderr.pipe(err);
  const sampler = new TreeSampler(child.pid, intervalMs);
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {}
  }, timeoutMs);
  const [code, signal] = await new Promise((r) => child.on('close', (c, s) => r([c, s])));
  const exitAt = Date.now();
  clearTimeout(timer);
  const mem = sampler.stop();
  await Promise.all([out && new Promise((r) => out.end(r)), new Promise((r) => err.end(r))]);
  let time = null;
  try {
    const lines = readFileSync(timeFile, 'utf8').trim().split('\n');
    const [e, m, u, s] = lines[lines.length - 1].split(' ').map(Number);
    time = { wallS: e, maxRssMb: round(m / 1024, 1), userS: u, sysS: s, cpuS: round(u + s, 2) };
    rmSync(timeFile, { force: true });
  } catch {}
  return { spawnAt, exitAt, wallMs: exitAt - spawnAt, exitCode: code, signal, timedOut, time, mem };
}

/**
 * `node -e` launcher for the `hash` phase: runs the workspace's own nx in-process and exits
 * the moment Nx constructs its PerformanceLifeCycle. In Nx 23.3 that happens in
 * tasks-runner/run-command.js invokeTasksRunner, right after the project graph, the task graph
 * AND hashTasksThatDoNotDependOnOutputsOfOtherTasks (upfront hashing of every task whose
 * inputs don't read dependency outputs) and right before the orchestrator starts the first
 * task. So wall = boot + project graph + task graph + upfront hashing, on the real run path.
 * Nx's own performance measures (main process) are dumped from the perf_hooks timeline.
 */
const READY_LAUNCHER = `
const path = require('node:path');
const fs = require('node:fs');
const out = process.env.BENCH_SCALE_READY_OUT;
delete process.env.BENCH_SCALE_READY_OUT;
const r = require('node:module').createRequire(path.join(process.cwd(), 'package.json'));
const nxBin = r.resolve('nx/bin/nx.js');
const nxRoot = path.resolve(path.dirname(nxBin), '..', '..');
const plc = require(path.join(nxRoot, 'dist', 'src', 'tasks-runner', 'life-cycles', 'performance-life-cycle.js'));
const Orig = plc.PerformanceLifeCycle;
plc.PerformanceLifeCycle = class extends Orig {
  constructor(taskGraph, ...rest) {
    super(taskGraph, ...rest);
    const tasks = Object.values(taskGraph.tasks);
    const measures = {};
    for (const e of performance.getEntriesByType('measure')) measures[e.name] = (measures[e.name] ?? 0) + e.duration;
    fs.writeFileSync(out, JSON.stringify({ readyAt: Date.now(), tasks: tasks.length, hashed: tasks.filter((t) => t.hash).length, measures }));
    process.exit(0);
  }
};
process.argv = [process.argv[0], nxBin, ...process.argv.slice(1)];
require(nxBin);
`;

// ------------------------------------------------------------------ helpers
function wipe(ws, what) {
  for (const p of what) rmSync(join(ws, p), { recursive: true, force: true });
  // Vitest/Vite caches (results cache is off, but keep runs equal anyway).
  if (what.includes('.nx')) {
    for (const p of ['node_modules/.vite', 'node_modules/.vitest', 'node_modules/.vite-temp']) rmSync(join(ws, p), { recursive: true, force: true });
  }
}

/** Parse NX_PERF_LOGGING lines ("Time taken for 'x' 12.3ms"); plugin worker pids are normalized. */
export function parsePerfLog(text) {
  const out = {};
  const first = {};
  for (const m of text.matchAll(/Time taken for '(.+?)' ([\d.]+)ms/g)) {
    const name = m[1].replace(/plugin worker \d+/, 'plugin worker').replace(/\/[^ ']*\/node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?/, '');
    out[name] = round((out[name] ?? 0) + Number(m[2]), 1);
    if (!(name in first)) first[name] = round(Number(m[2]), 1);
  }
  // Sums over the whole command; `firstPass` = first occurrence only (`run-many --graph` builds
  // the project graph twice).
  return { ...out, firstPass: first };
}

/** Task-level stats from an NX_PROFILE trace. */
export function profileStats(profile, { spawnAt, exitAt, parallel }) {
  const tasks = profile
    .filter((e) => e.ph === 'X')
    .map((e) => ({ id: e.name, target: e.args?.target?.target ?? '', start: e.ts / 1000, end: (e.ts + e.dur) / 1000, dur: e.dur / 1000, slot: e.tid, status: e.args?.status ?? null }));
  if (!tasks.length) return { count: 0 };
  const isNoop = (t) => t.target === 'test-ci';
  const real = tasks.filter((t) => !isNoop(t));
  const firstStart = Math.min(...tasks.map((t) => t.start));
  const lastEnd = Math.max(...tasks.map((t) => t.end));
  // Per-slot gaps between one task's end and the next task's start on the same slot: time a
  // free slot waited for Nx (scheduling, hashing, spawning bookkeeping) or for dependencies.
  const bySlot = new Map();
  for (const t of tasks) (bySlot.get(t.slot) ?? bySlot.set(t.slot, []).get(t.slot)).push(t);
  const gaps = [];
  for (const list of bySlot.values()) {
    list.sort((a, b) => a.start - b.start);
    for (let i = 1; i < list.length; i++) gaps.push(Math.max(0, list[i].start - list[i - 1].end));
  }
  const statuses = {};
  for (const t of tasks) statuses[t.status] = (statuses[t.status] ?? 0) + 1;
  const sumDur = sum(tasks.map((t) => t.dur));
  const taskPhaseMs = lastEnd - firstStart;
  const wallMs = exitAt - spawnAt;
  const idealMs = sumDur / parallel;
  return {
    count: tasks.length,
    realCount: real.length,
    noopCount: tasks.length - real.length,
    slotsUsed: bySlot.size,
    statuses,
    failed: tasks.filter((t) => t.status === 'failure').map((t) => t.id),
    cacheHits: tasks.filter((t) => CACHE_HIT.has(t.status)).length,
    sumDurMs: round(sumDur),
    sumRealDurMs: round(sum(real.map((t) => t.dur))),
    realDurMeanMs: round(sum(real.map((t) => t.dur)) / Math.max(real.length, 1), 1),
    realDurMedianMs: round(median(real.map((t) => t.dur)), 1),
    realDurP95Ms: round(p95(real.map((t) => t.dur)), 1),
    noopDurSumMs: round(sum(tasks.filter(isNoop).map((t) => t.dur)), 1),
    preTaskMs: round(firstStart - spawnAt),
    taskPhaseMs: round(taskPhaseMs),
    postTaskMs: round(exitAt - lastEnd),
    slotOccupancy: round(sumDur / (taskPhaseMs * parallel), 3),
    gapCount: gaps.length,
    gapSumMs: round(sum(gaps)),
    gapMeanMs: round(gaps.length ? sum(gaps) / gaps.length : 0, 2),
    gapMedianMs: round(median(gaps) ?? 0, 2),
    gapP95Ms: round(p95(gaps) ?? 0, 2),
    // Wall above perfect packing of the measured task durations on P slots. Includes boot,
    // graph, hashing, scheduling and tail (last slots idle while the final tasks finish).
    idealMakespanMs: round(idealMs),
    overheadMs: round(wallMs - idealMs),
    overheadPerTaskMs: round((wallMs - idealMs) / tasks.length, 2),
    inPhaseLossMs: round(taskPhaseMs - idealMs),
  };
}

// ------------------------------------------------------------------ phases
async function phaseStats(ws, variant, dir, opts) {
  const file = join(dir, 'stats.json');
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  const graphFile = join(dir, '.project-graph.json');
  wipe(ws, ['.nx/workspace-data']);
  const m = await measure({ ws, args: ['graph', `--file=${graphFile}`], stderrFile: join(dir, 'stats.log'), timeoutMs: opts.timeoutMs, intervalMs: opts.intervalMs });
  if (m.exitCode !== 0) throw new Error(`nx graph failed in ${ws} (see ${join(dir, 'stats.log')})`);
  rmSync(join(dir, 'stats.log'), { force: true });
  const g = JSON.parse(readFileSync(graphFile, 'utf8')).graph;
  rmSync(graphFile, { force: true });
  let targets = 0;
  let atomTargets = 0;
  let shardTargets = 0;
  for (const node of Object.values(g.nodes)) {
    for (const t of Object.keys(node.data.targets ?? {})) {
      targets++;
      if (/^test-ci--shard-\d+-of-\d+$/.test(t)) shardTargets++;
      else if (t.startsWith('test-ci--')) atomTargets++;
    }
  }
  const projectDeps = Object.values(g.dependencies).flat().filter((d) => !d.target.startsWith('npm:')).length;
  const stats = { variant, projects: Object.keys(g.nodes).length, targets, atomTargets, shardTargets, projectDeps, graphWallMs: m.wallMs };
  writeFileSync(file, JSON.stringify(stats, null, 2) + '\n');
  return stats;
}

async function phaseGraphCold(ws, variant, dir, rep, opts) {
  wipe(ws, ['.nx/workspace-data']);
  const log = join(dir, `graph-cold-r${rep}.log`);
  const m = await measure({ ws, args: ['show', 'projects', '--json'], env: { NX_PERF_LOGGING: 'true' }, stdoutFile: null, stderrFile: log, timeoutMs: opts.timeoutMs, intervalMs: opts.intervalMs });
  const perf = parsePerfLog(readFileSync(log, 'utf8'));
  const ok = m.exitCode === 0 && !m.timedOut;
  if (ok) rmSync(log, { force: true });
  return { ok, ...m, nxPerf: perf };
}

async function phaseTaskgraph(ws, variant, dir, rep, opts) {
  wipe(ws, ['.nx/workspace-data']);
  const target = TARGET[variant];
  const graphFile = join(dir, `.task-graph-r${rep}.json`);
  const log = join(dir, `taskgraph-r${rep}.log`);
  const m = await measure({
    ws,
    args: ['run-many', '-t', target, `--graph=${graphFile}`],
    env: { NX_PERF_LOGGING: 'true' },
    stdoutFile: `${log}.out`,
    stderrFile: log,
    timeoutMs: opts.timeoutMs,
    intervalMs: opts.intervalMs,
  });
  const perf = parsePerfLog(readFileSync(log, 'utf8'));
  const stdout = existsSync(`${log}.out`) ? readFileSync(`${log}.out`, 'utf8') : '';
  let taskCount = null;
  let rootCount = null;
  if (existsSync(graphFile)) {
    const tg = JSON.parse(readFileSync(graphFile, 'utf8')).tasks;
    taskCount = Object.keys(tg.tasks).length;
    rootCount = tg.roots.length;
    rmSync(graphFile, { force: true });
  }
  // `--graph=<file>.json` writes the graph and exits (graph.js generateGraph -> process.exit(0)).
  const ranTasks = /Successfully ran|Ran target|> nx run /.test(stdout);
  const ok = m.exitCode === 0 && !m.timedOut && taskCount != null && !ranTasks;
  if (ok) for (const f of [log, `${log}.out`]) rmSync(f, { force: true });
  return { ok, ...m, taskCount, rootCount, ranTasks, nxPerf: perf };
}

async function phaseHash(ws, variant, dir, rep, opts) {
  wipe(ws, ['.nx']);
  const target = TARGET[variant];
  const readyFile = join(dir, `.hash-r${rep}.ready.json`);
  rmSync(readyFile, { force: true });
  const log = join(dir, `hash-r${rep}.log`);
  const m = await measure({
    ws,
    launcher: 'ready',
    args: ['run-many', '-t', target, `--parallel=${opts.parallel}`, '--skip-nx-cache', '--outputStyle=static'],
    env: { BENCH_SCALE_READY_OUT: readyFile },
    stdoutFile: `${log}.out`,
    stderrFile: log,
    timeoutMs: opts.timeoutMs,
    intervalMs: opts.intervalMs,
  });
  let ready = null;
  if (existsSync(readyFile)) {
    ready = JSON.parse(readFileSync(readyFile, 'utf8'));
    rmSync(readyFile, { force: true });
  }
  const stdout = existsSync(`${log}.out`) ? readFileSync(`${log}.out`, 'utf8') : '';
  const ranTasks = /Successfully ran|> nx run /.test(stdout);
  const ok = m.exitCode === 0 && !m.timedOut && ready != null && !ranTasks;
  if (ok) for (const f of [log, `${log}.out`]) rmSync(f, { force: true });
  const ms = ready?.measures ?? {};
  const pick = (k) => (ms[k] == null ? null : round(ms[k], 1));
  return {
    ok,
    ...m,
    readyMs: ready ? ready.readyAt - m.spawnAt : null,
    taskCount: ready?.tasks ?? null,
    hashedUpfront: ready?.hashed ?? null,
    ranTasks,
    nxMeasures: {
      createProjectGraphAsync: pick('createProjectGraphAsync'),
      buildProjectConfigs: pick('build-project-configs'),
      createDependencies: pick('createDependencies'),
      hashMultipleTasks: pick('hashMultipleTasks'),
      all: Object.fromEntries(Object.entries(ms).filter(([k]) => !k.includes('/')).map(([k, v]) => [k, round(v, 1)])),
    },
  };
}

async function phaseRun(ws, variant, dir, rep, opts) {
  wipe(ws, ['.nx', 'coverage']);
  const target = TARGET[variant];
  const profileFile = join(dir, `run-r${rep}.profile.json`);
  const perfFile = join(dir, `run-r${rep}.nx-perf.json`);
  const log = join(dir, `run-r${rep}.log`);
  const m = await measure({
    ws,
    launcher: 'hook',
    args: ['run-many', '-t', target, `--parallel=${opts.parallel}`, '--skip-nx-cache', '--outputStyle=static'],
    // NX_PROFILE is joined to cwd by Nx, so it is passed relative to the workspace.
    env: { NX_PROFILE: relative(ws, profileFile), BENCH_NX_PERF_OUT: perfFile },
    stdoutFile: log,
    stderrFile: `${log}.err`,
    timeoutMs: opts.timeoutMs,
    intervalMs: opts.intervalMs,
  });
  const logText = readFileSync(log, 'utf8') + readFileSync(`${log}.err`, 'utf8');
  let tasks = null;
  if (existsSync(profileFile)) {
    const profile = JSON.parse(readFileSync(profileFile, 'utf8'));
    tasks = profileStats(profile, { spawnAt: m.spawnAt, exitAt: m.exitAt, parallel: opts.parallel });
    writeFileSync(`${profileFile}.gz`, gzipSync(JSON.stringify(profile)));
    rmSync(profileFile, { force: true });
  }
  let hook = null;
  if (existsSync(perfFile)) {
    const d = JSON.parse(readFileSync(perfFile, 'utf8'));
    const s = d.summary ?? {};
    hook = {
      graphReadyMs: d.lifeCycleCreatedAt?.[0] ? d.lifeCycleCreatedAt[0] - m.spawnAt : null,
      runDuration: s.runDuration ?? null,
      criticalPathDuration: s.criticalPathDuration ?? null,
      criticalPathTaskCount: s.criticalPathTaskCount ?? null,
      overhead: s.overhead ?? null,
      recoverableByParallel: s.recoverableByParallel ?? null,
      recoverableByMachines: s.recoverableByMachines ?? null,
      coordinatorOverhead: s.coordinatorOverhead ?? null,
      error: d.error ?? null,
    };
    rmSync(perfFile, { force: true });
  }
  const printed = parsePerformanceReport(logText);
  const errors = [];
  if (m.exitCode !== 0) errors.push(`exit ${m.exitCode}${m.signal ? ` (${m.signal})` : ''}`);
  if (m.timedOut) errors.push('timed out');
  if (!tasks) errors.push('no NX_PROFILE');
  else {
    if (tasks.failed.length) errors.push(`${tasks.failed.length} failed tasks (${tasks.failed.slice(0, 3).join(', ')}${tasks.failed.length > 3 ? ', ...' : ''})`);
    if (tasks.cacheHits) errors.push(`${tasks.cacheHits} cache hits despite --skip-nx-cache`);
    if (opts.expectedTasks != null && tasks.count !== opts.expectedTasks) errors.push(`profile has ${tasks.count} tasks, task graph has ${opts.expectedTasks}`);
  }
  const ok = errors.length === 0;
  writeFileSync(`${log}.gz`, gzipSync(logText));
  for (const f of [log, `${log}.err`]) rmSync(f, { force: true });
  return { ok, errors, ...m, tasks, hook, printedReport: printed && { runDuration: printed.runDuration, criticalPathDuration: printed.criticalPathDuration, recoverable: printed.recoverable } };
}

// ------------------------------------------------------------------ planning / estimates
function loadResults(out) {
  const res = [];
  const raw = join(out, 'raw');
  if (!existsSync(raw)) return res;
  for (const nDir of readdirSync(raw)) {
    if (!/^n\d+$/.test(nDir)) continue;
    for (const variant of readdirSync(join(raw, nDir))) {
      const vdir = join(raw, nDir, variant);
      for (const f of readdirSync(vdir)) {
        const m = f.match(/^(graph-cold|taskgraph|hash|run)-r(\d+)\.json$/);
        if (m) res.push({ n: Number(nDir.slice(1)), variant, phase: m[1], rep: Number(m[2]), ...JSON.parse(readFileSync(join(vdir, f), 'utf8')) });
      }
    }
  }
  return res;
}

const GRAPH_VARIABLE_KEYS = ['build-project-configs', 'createDependencies', 'createProjectGraphAsync >> build-project-graph-using-project-file-map', 'write cache'];

/**
 * Estimated wall (ms) of one rep of a phase at size n. With measurements at >= 2 sizes:
 * linear through the two largest (projects for graph phases, tasks for run). With one size:
 * the N-dependent part (graph phases: NX_PERF_LOGGING's project-config/dependency steps; run:
 * CPU seconds per task) is scaled, the rest is treated as fixed.
 */
export function estimatePhaseMs(results, phase, variant, n, units, { parallel, cores }) {
  const rs = results.filter((r) => r.phase === phase && r.variant === variant && r.ok);
  const bySize = new Map();
  for (const r of rs) (bySize.get(r.n) ?? bySize.set(r.n, []).get(r.n)).push(r);
  const sizes = [...bySize.keys()].sort((a, b) => a - b);
  if (!sizes.length) return null;
  const unitsOf = (r) => (phase === 'run' ? r.tasks?.count : r.n);
  const pts = sizes.map((s) => {
    const rr = bySize.get(s);
    return { n: s, u: median(rr.map(unitsOf)), wall: median(rr.map((r) => r.wallMs)), rr };
  });
  if (phase !== 'run' && pts.length >= 2) {
    const [a, b] = pts.slice(-2);
    const k = (b.wall - a.wall) / (b.u - a.u);
    return { ms: Math.max(b.wall, b.wall + k * (n - b.u)), method: `linear in projects through N=${a.n},${b.n}` };
  }
  const ref = pts[pts.length - 1];
  if (phase !== 'run') {
    const perfOf = (r) => r.nxPerf ?? r.nxMeasures?.all ?? {};
    const keys = phase === 'hash' ? [...GRAPH_VARIABLE_KEYS, 'hashMultipleTasks'] : GRAPH_VARIABLE_KEYS;
    const variable = median(ref.rr.map((r) => sum(keys.map((k) => perfOf(r)[k] ?? 0))));
    return { ms: ref.wall - variable + (variable * n) / ref.n, method: `N=${ref.n}: fixed + perf-log project steps x N` };
  }
  // run: pre-task (graph + first hashes) scaled like the graph phase, task phase from CPU per task.
  const r = ref.rr[0];
  const cpuPerTaskS = r.time?.cpuS / Math.max(r.tasks.count, 1);
  const slots = Math.min(parallel, cores);
  const graph = estimatePhaseMs(results, 'hash', variant, n, null, { parallel, cores }) ?? estimatePhaseMs(results, 'graph-cold', variant, n, null, { parallel, cores });
  const pre = graph?.ms ?? r.tasks.preTaskMs;
  return { ms: pre + (cpuPerTaskS * 1000 * units) / slots / 0.9, method: `N=${ref.n}: hash-phase estimate + ${round(cpuPerTaskS * 1000)} ms CPU/task over ${slots} cores at 90% occupancy` };
}

// ------------------------------------------------------------------ main
async function main() {
  const { values } = parseArgs({
    options: {
      sizes: { type: 'string', default: '20,100,500,1500' },
      variants: { type: 'string', default: SCALE_VARIANTS.join(',') },
      reps: { type: 'string', default: '2' },
      'run-reps': { type: 'string', default: '1' },
      parallel: { type: 'string', default: '16' },
      phases: { type: 'string', default: PHASES.join(',') },
      out: { type: 'string', default: join(RESULTS_DIR, 'scale') },
      'ws-dir': { type: 'string', default: DEFAULT_SCALE_DIR },
      'timeout-min': { type: 'string', default: '120' },
      interval: { type: 'string', default: '200' },
      cooldown: { type: 'string', default: '2' },
      'est-cores': { type: 'string' },
      'retry-failed': { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
    },
  });
  const sizes = values.sizes.split(',').map(Number);
  const variants = values.variants.split(',');
  for (const v of variants) if (!SCALE_VARIANTS.includes(v)) throw new Error(`unknown variant ${v}`);
  const phases = values.phases.split(',').map((p) => (p === 'graph' ? 'graph-cold' : p));
  for (const p of phases) if (!PHASES.includes(p)) throw new Error(`unknown phase ${p} (${PHASES.join('|')})`);
  const reps = Number(values.reps);
  const runReps = Number(values['run-reps']);
  const parallel = Number(values.parallel);
  const out = resolve(values.out);
  const wsDir = resolve(values['ws-dir']);
  const opts = { parallel, timeoutMs: Number(values['timeout-min']) * 60_000, intervalMs: Number(values.interval) };
  const cooldownMs = Number(values.cooldown) * 1000;
  const cpus = os.availableParallelism();
  const estCores = Number(values['est-cores'] ?? Math.min(parallel, os.cpus().length));

  // Plan + estimates.
  const existing = loadResults(out);
  const plans = new Map();
  let total = 0;
  console.log(`[scale] sizes ${sizes.join(',')} | variants ${variants.join(',')} | phases ${phases.join(',')} | reps ${reps} (run ${runReps}) | --parallel ${parallel} | this process may use ${cpus} CPUs | estimates assume ${estCores} free cores`);
  for (const n of sizes) {
    const model = buildModel(n);
    const files = buildTree(model);
    const plan = await planTotals(model, files);
    plans.set(n, { model, files, plan });
    const parts = [];
    let sizeMs = 0;
    let unknown = false;
    for (const v of variants) {
      const pv = plan.variants[v];
      let vMs = 0;
      for (const ph of phases) {
        const done = existing.filter((r) => r.n === n && r.variant === v && r.phase === ph && r.ok).length;
        const want = ph === 'run' ? runReps : reps;
        const todo = Math.max(0, want - done);
        if (!todo) continue;
        const est = estimatePhaseMs(existing, ph, v, n, ph === 'run' ? pv.tasks : n, { parallel, cores: estCores });
        if (!est) unknown = true;
        else vMs += todo * (est.ms + cooldownMs);
      }
      sizeMs += vMs;
      parts.push(`${v} ${pv.targets} targets / ${pv.tasks} tasks${vMs ? ` ~${fmtEst(vMs)}` : ''}`);
    }
    total += sizeMs;
    console.log(`  N=${n}: ${plan.specs} specs, ${plan.files} files | ${parts.join(' | ')} | est. ${unknown ? 'unknown (no measurement yet' + (sizeMs ? `; known part ~${fmtEst(sizeMs)})` : ')') : `~${fmtEst(sizeMs)}`}`);
  }
  if (total) console.log(`  estimated remaining measurement time: ~${fmtEst(total)} (+ generation/install; graph phases extrapolated, see README caveats)`);
  if (values['dry-run']) return;

  mkdirSync(join(out, 'raw'), { recursive: true });
  for (const n of sizes) {
    const { model, files, plan } = plans.get(n);
    writeFileSync(join(out, 'raw', `plan-${n}.json`), JSON.stringify(plan, null, 2) + '\n');
    const wss = {};
    for (const v of variants) {
      wss[v] = workspaceDir(wsDir, v, n);
      if (!existsSync(join(wss[v], '.git'))) generateWorkspace({ model, files, variant: v, out: wsDir });
    }
    const dirOf = (v) => {
      const d = join(out, 'raw', `n${n}`, v);
      mkdirSync(d, { recursive: true });
      return d;
    };
    const stats = {};
    for (const v of variants) {
      stats[v] = await phaseStats(wss[v], v, dirOf(v), opts);
      const exp = plan.variants[v];
      const mismatch = stats[v].targets !== exp.targets || stats[v].projects !== n;
      console.log(`[scale] N=${n} ${v}: ${stats[v].projects} projects, ${stats[v].targets} targets (${stats[v].atomTargets} atoms, ${stats[v].shardTargets} shards), ${stats[v].projectDeps} project deps${mismatch ? ` — MISMATCH: plan says ${exp.targets} targets` : ''}`);
    }
    const rotate = (i) => variants.map((_, j) => variants[(j + i) % variants.length]);
    const jobs = [];
    for (let rep = 1; rep <= reps; rep++) {
      for (const ph of ['graph-cold', 'taskgraph', 'hash']) if (phases.includes(ph)) for (const v of rotate(rep - 1)) jobs.push({ ph, v, rep });
    }
    if (phases.includes('run')) for (let rep = 1; rep <= runReps; rep++) for (const v of rotate(rep - 1)) jobs.push({ ph: 'run', v, rep });

    for (const { ph, v, rep } of jobs) {
      const dir = dirOf(v);
      const file = join(dir, `${ph}-r${rep}.json`);
      if (existsSync(file)) {
        const prev = JSON.parse(readFileSync(file, 'utf8'));
        if (prev.ok || !values['retry-failed']) continue;
      }
      if (cooldownMs) await new Promise((r) => setTimeout(r, cooldownMs));
      const memAvailGb = round(readMeminfo().memAvailable / 2 ** 30, 1);
      const startedAt = new Date().toISOString();
      let r;
      if (ph === 'graph-cold') r = await phaseGraphCold(wss[v], v, dir, rep, opts);
      else if (ph === 'taskgraph') r = await phaseTaskgraph(wss[v], v, dir, rep, opts);
      else if (ph === 'hash') r = await phaseHash(wss[v], v, dir, rep, opts);
      else {
        const tg = existing.concat(loadResults(out)).find((x) => x.n === n && x.variant === v && x.phase === 'taskgraph' && x.ok);
        r = await phaseRun(wss[v], v, dir, rep, { ...opts, expectedTasks: tg?.taskCount ?? null });
      }
      const result = { n, variant: v, phase: ph, rep, target: TARGET[v], parallel: ph === 'run' ? parallel : null, startedAt, cpus, memAvailGbBefore: memAvailGb, stats: stats[v], ...r };
      writeFileSync(file, JSON.stringify(result, null, 2) + '\n');
      const mem = `nx ${r.mem.nxPeakRssMb}MB, workers ${r.mem.workers}×≤${r.mem.workersPeakRssMbMax}MB`;
      let extra = '';
      if (ph === 'graph-cold') extra = `build-project-configs ${fmtMs(r.nxPerf['build-project-configs'])}, createDependencies ${fmtMs(r.nxPerf.createDependencies)}`;
      if (ph === 'taskgraph') extra = `${r.taskCount} tasks${r.ranTasks ? ' (RAN TASKS?!)' : ''}`;
      if (ph === 'hash') extra = `${r.taskCount} tasks (${r.hashedUpfront} hashed upfront), project graph ${fmtMs(r.nxMeasures.createProjectGraphAsync)}, hashMultipleTasks ${fmtMs(r.nxMeasures.hashMultipleTasks)}${r.ranTasks ? ' (RAN TASKS?!)' : ''}`;
      if (ph === 'run' && r.tasks) extra = `${r.tasks.count} tasks, pre ${fmtMs(r.tasks.preTaskMs)}, Σtask ${fmtMs(r.tasks.sumDurMs)}, gap ${r.tasks.gapMeanMs}ms/task, overhead ${fmtMs(r.tasks.overheadMs)} (${r.tasks.overheadPerTaskMs}ms/task)`;
      console.log(`${r.ok ? 'OK ' : 'ERR'} N=${n} ${v.padEnd(8)} ${ph.padEnd(10)} r${rep} | wall ${fmtMs(r.wallMs)} | ${mem} | ${extra}${r.ok ? '' : ` | ${(r.errors ?? [`exit ${r.exitCode}`]).join('; ')}`}`);
    }
  }
  console.log(`[scale] done. Report: node bench/scale-report.mjs --out ${relative(process.cwd(), out) || '.'}`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  main().catch((e) => {
    console.error(e.stack ?? e);
    process.exit(2);
  });
}
