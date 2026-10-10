#!/usr/bin/env node
// One measured `nx affected` run (x reps). See bench/README.md.
//
//   node bench/run.mjs --workspace atomized --scenario full --runner ct --parallel 8 --reps 3
//        [--out results/raw] [--label x] [--rep-start 1] [--interval 250] [--pss-budget 0.15]
//        [--launcher hook|pnpm] [--task-history cold|keep] [--timeout-min 90] [--no-clean]
//        [--keep-full-graph] [--verbose]
//        [--targets a,b] [--dry-run]
//
// Env: BENCH_NX_CMD="node /path/fake-nx.mjs" replaces the nx launcher (tests);
//      BENCH_WORKSPACES_DIR overrides <repo>/workspaces.
// --workspace also takes a path; the variant (target mapping) is --kind, else the directory
// name without a trailing -<N> (size-sweep workspaces: workspaces/size/atomized-500).
import { spawn, fork, execFileSync } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { parseArgs } from 'node:util';
import os from 'node:os';
import { BENCH_DIR, RAW_DIR, WORKSPACES_DIR, nxEnv, targetsFor } from './lib/config.mjs';
import { CLK_TCK, findPidsWithEnv, hostInfo, killPids, listSuspects, readCpuTimes, readMeminfo } from './lib/proc.mjs';
import { buildSummary, oneLine } from './lib/summary.mjs';

const HOOK = join(BENCH_DIR, 'lib', 'nx-hook.cjs');
const SAMPLER = join(BENCH_DIR, 'lib', 'sampler.mjs');

// Directories removed before every rep so runs start equal. Matched by name anywhere in the
// workspace (outside .git / node_modules); `node_modules/.vite*` is matched one level inside
// every node_modules dir (Cypress CT uses per-process vite cacheDirs node_modules/.vite/ct-*).
const OUTPUT_DIR_NAMES = new Set(['dist', 'out-tsc', 'coverage', 'test-output', 'test-results', 'playwright-report', 'blob-report']);
const CYPRESS_OUTPUT_DIRS = new Set(['screenshots', 'videos', 'downloads']);

/**
 * Remove Nx's graph cache + workspace DB (cold graph computation, no task history) and the
 * local cache. With keepTaskHistory the workspace DB files (*.db*: task history the local
 * scheduler uses to start the longest tasks first) survive; graph caches are still removed.
 */
export function cleanNxData(ws, { keepTaskHistory = false } = {}) {
  const removed = [];
  const wd = join(ws, '.nx', 'workspace-data');
  if (existsSync(wd)) {
    for (const n of readdirSync(wd)) {
      if (keepTaskHistory && /\.db/.test(n)) continue;
      rmSync(join(wd, n), { recursive: true, force: true });
      removed.push(join('.nx/workspace-data', n));
    }
  }
  if (existsSync(join(ws, '.nx', 'cache'))) {
    rmSync(join(ws, '.nx', 'cache'), { recursive: true, force: true });
    removed.push('.nx/cache');
  }
  return removed;
}

export function cleanWorkspace(ws, opts = {}) {
  const removed = cleanNxData(ws, opts);
  const rm = (p) => {
    rmSync(p, { recursive: true, force: true });
    removed.push(relative(ws, p));
  };
  const walk = (dir, depth) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const p = join(dir, e.name);
      if (e.name === '.git' || e.name === '.nx') continue;
      if (e.name === 'node_modules') {
        for (const n of readdirSync(p)) if (n.startsWith('.vite')) rm(join(p, n));
        continue;
      }
      if (OUTPUT_DIR_NAMES.has(e.name) || (basename(dir) === 'cypress' && CYPRESS_OUTPUT_DIRS.has(e.name))) {
        rm(p);
        continue;
      }
      if (depth < 12) walk(p, depth + 1);
    }
  };
  walk(ws, 0);
  return removed;
}

const git = (ws, ...args) => execFileSync('git', args, { cwd: ws, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

export function resolveWorkspace(arg) {
  const dir = arg.includes('/') || existsSync(arg) ? resolve(arg) : join(WORKSPACES_DIR, arg);
  if (!existsSync(join(dir, 'nx.json')) && !process.env.BENCH_NX_CMD) throw new Error(`no Nx workspace at ${dir}`);
  return { dir, name: basename(dir) };
}

function launcher(kind) {
  if (process.env.BENCH_NX_CMD) {
    // relative paths are resolved against the caller's cwd (nx itself runs in the workspace)
    const parts = process.env.BENCH_NX_CMD.trim().split(/\s+/).map((x) => (!x.startsWith('/') && existsSync(x) ? resolve(x) : x));
    return { cmd: parts[0], pre: parts.slice(1), kind: 'custom' };
  }
  if (kind === 'pnpm') return { cmd: 'pnpm', pre: ['exec', 'nx'], kind };
  return { cmd: process.execPath, pre: [HOOK], kind: 'hook' };
}

function wsPath(ws) {
  return `${join(ws, 'node_modules', '.bin')}:${process.env.PATH}`;
}

/** Run a command to completion, capturing output. */
function runCapture(cmd, args, opts) {
  return new Promise((res) => {
    const p = spawn(cmd, args, { ...opts, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (out += d));
    p.on('close', (code, signal) => res({ code, signal, out }));
  });
}

function stamp(d = new Date()) {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

async function killStrays(excludePids) {
  const strays = findPidsWithEnv('BENCH_RUN_ID', null, excludePids);
  if (!strays.length) return [];
  console.warn(`[bench] killing ${strays.length} stray process(es) from an earlier run: ${strays.join(' ')}`);
  return killPids(strays);
}

/** Exported for matrix.mjs. Returns the summary. */
export async function runOnce(opts) {
  const { dir: ws, name } = resolveWorkspace(opts.workspace);
  // Size-sweep workspaces are named <variant>-<N> (workspaces/size/atomized-500).
  const kind = opts.kind ?? name.replace(/-\d+$/, '');
  const targets = opts.targets ? opts.targets.split(',') : targetsFor(kind, opts.runner);
  const L = launcher(opts.launcher);
  const parallel = Number(opts.parallel);
  const runId = randomUUID();
  const outRoot = resolve(opts.out ?? RAW_DIR);
  const dirName = [stamp(), name, opts.scenario, opts.runner, `p${parallel}`, `r${opts.rep}`, opts.label].filter(Boolean).join('_');
  const dir = join(outRoot, dirName);
  const env = nxEnv(ws, { PATH: wsPath(ws) });
  const keepTaskHistory = opts.taskHistory === 'keep';
  const affectedArgs = ['affected', '-t', targets.join(','), '--base=base', '--head=HEAD'];

  if (opts.dryRun) {
    console.log(`[dry-run] ${dir}\n  git checkout --detach ${opts.scenario}\n  ${L.cmd} ${[...L.pre, ...affectedArgs, `--graph=${dir}/task-graph.raw.json`].join(' ')}\n  ${L.cmd} ${[...L.pre, ...affectedArgs, `--parallel=${parallel}`, '--skip-nx-cache', '--outputStyle=static'].join(' ')}`);
    return null;
  }
  mkdirSync(dir, { recursive: true });
  const phases = {};
  const self = new Set([process.pid]);

  // 0. preflight: no leftovers from a previous (crashed) run.
  await killStrays(self);

  // 1. checkout
  let t = Date.now();
  git(ws, 'checkout', '--quiet', '--detach', opts.scenario);
  const gitHead = git(ws, 'rev-parse', 'HEAD');
  const gitDirty = git(ws, 'status', '--porcelain', '--untracked-files=no') !== '';

  // 2. clean
  const removed = opts.clean === false ? [] : cleanWorkspace(ws, { keepTaskHistory });
  phases.cleanMs = Date.now() - t;

  // 3. task graph (no tasks run: `affected --graph=<file>.json` writes {graph, tasks, taskPlans} and exits)
  t = Date.now();
  const rawGraphFile = join(dir, 'task-graph.raw.json');
  const g = await runCapture(L.cmd, [...L.pre, ...affectedArgs, `--graph=${rawGraphFile}`], { cwd: ws, env });
  phases.graphExportMs = Date.now() - t;
  let taskGraph = null;
  if (g.code === 0 && existsSync(rawGraphFile)) {
    const raw = JSON.parse(readFileSync(rawGraphFile, 'utf8'));
    const executors = {};
    for (const [id, task] of Object.entries(raw.tasks?.tasks ?? {})) {
      executors[id] = raw.graph?.nodes?.[task.target.project]?.data?.targets?.[task.target.target]?.executor ?? null;
    }
    taskGraph = { source: `nx ${affectedArgs.join(' ')} --graph`, targets, tasks: raw.tasks, executors };
    writeFileSync(join(dir, 'task-graph.json'), JSON.stringify(taskGraph));
    if (!opts.keepFullGraph) rmSync(rawGraphFile);
  } else {
    writeFileSync(join(dir, 'task-graph.error.log'), g.out);
    console.warn(`[bench] task graph export failed (exit ${g.code}); see task-graph.error.log`);
  }
  // The export computed the project graph; drop it again so the measured run is cold.
  // (it also wrote nothing to the task history: no task ran)
  if (opts.clean !== false) cleanNxData(ws, { keepTaskHistory });

  // 4. 1s idle baseline of machine-wide CPU (noise check), then the sampler (forked first
  //    so it is ready the moment nx exists)
  const c0 = readCpuTimes();
  await new Promise((r) => setTimeout(r, 1000));
  const c1 = readCpuTimes();
  const idleSysCores = Math.round(((c1.busy - c0.busy) / CLK_TCK) * 100) / 100;
  const suspectsBefore = listSuspects();
  const sampler = fork(SAMPLER, [], { stdio: ['ignore', 'inherit', 'inherit', 'ipc'] });
  self.add(sampler.pid);
  await new Promise((r) => sampler.once('message', r)); // ready
  const samplerDone = new Promise((r) => sampler.on('message', (m) => m.type === 'done' && r(m.stats)));

  // 5. the measured run
  const profileFile = join(dir, 'profile.json');
  const perfFile = join(dir, 'nx-perf.json');
  const runEnv = {
    ...env,
    NX_PROFILE: relative(ws, profileFile), // TaskProfilingLifeCycle does join(cwd, NX_PROFILE)
    BENCH_RUN_ID: runId,
    BENCH_NX_PERF_OUT: perfFile,
  };
  const runArgs = [...L.pre, ...affectedArgs, `--parallel=${parallel}`, '--skip-nx-cache', '--outputStyle=static'];
  const log = createWriteStream(join(dir, 'nx.log'));
  log.write(`# ${L.cmd} ${runArgs.join(' ')}\n# cwd=${ws} BENCH_RUN_ID=${runId}\n`);
  const spawnAt = Date.now();
  const child = spawn(L.cmd, runArgs, { cwd: ws, env: runEnv, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  sampler.send({ type: 'start', rootPid: child.pid, marker: runId, intervalMs: Number(opts.interval ?? 250), pssBudget: Number(opts.pssBudget ?? 0.15), out: join(dir, 'samples.json.gz') });
  for (const s of [child.stdout, child.stderr]) {
    s.on('data', (d) => {
      log.write(d);
      if (opts.verbose) process.stdout.write(d);
    });
  }
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    console.warn(`[bench] timeout after ${opts.timeoutMin} min, killing run`);
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {}
    setTimeout(() => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {}
    }, 10_000).unref();
  }, Number(opts.timeoutMin ?? 90) * 60_000);
  const onSigint = () => {
    console.warn('\n[bench] interrupted, killing run');
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {}
  };
  process.on('SIGINT', onSigint);
  const { code: exitCode, signal } = await new Promise((r) => child.on('close', (code, sig) => r({ code, signal: sig })));
  const exitAt = Date.now();
  clearTimeout(timeout);
  process.off('SIGINT', onSigint);
  await new Promise((r) => log.end(r));

  // 6. stop sampler, then kill whatever survived (marker env var catches reparented ones)
  sampler.send({ type: 'stop' });
  const samplerStats = await samplerDone;
  const leftovers = await killPids(findPidsWithEnv('BENCH_RUN_ID', runId, self));
  const suspectsAfter = listSuspects();
  const suspectOrphans = [...suspectsAfter.values()].filter((p) => p.orphanLike && !suspectsBefore.has(p.pid));

  // 7. summary
  const readJson = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null);
  let profile = null;
  try {
    profile = readJson(profileFile);
  } catch {}
  const perfHook = readJson(perfFile);
  const samplesFile = join(dir, 'samples.json.gz');
  const samplerResult = existsSync(samplesFile) ? JSON.parse(gunzipSync(readFileSync(samplesFile))) : null;
  const config = {
    workspace: name,
    workspaceDir: ws,
    kind,
    scenario: opts.scenario,
    runner: opts.runner,
    targets,
    parallel,
    rep: Number(opts.rep),
    label: opts.label ?? null,
    launcher: L.kind,
    command: `${L.cmd} ${runArgs.join(' ')}`,
    runId,
    gitHead,
    nxVersion: perfHook?.nxVersion ?? null,
    intervalMs: Number(opts.interval ?? 250),
    cleaned: removed.length,
    taskHistory: keepTaskHistory ? 'keep' : 'cold',
    timestamp: new Date(spawnAt).toISOString(),
    host: { hostname: os.hostname(), cpus: os.availableParallelism(), node: process.version, ...hostInfo(), memAvailableAtStartMb: Math.round(readMeminfo().memAvailable / 2 ** 20) },
  };
  const summary = buildSummary({
    config,
    spawnAt,
    exitAt,
    exitCode,
    signal,
    timedOut,
    profile,
    taskGraph,
    sampler: samplerResult,
    samplerStats,
    perfHook,
    logText: readFileSync(join(dir, 'nx.log'), 'utf8'),
    leftovers,
    suspectOrphans,
    phases,
    gitDirty,
    idleSysCores,
  });
  writeFileSync(join(dir, 'summary.json'), JSON.stringify(summary, null, 1));
  console.log(`${oneLine(summary)}\n  -> ${relative(process.cwd(), dir) || dir}`);
  if (leftovers.length) console.warn(`[bench] killed ${leftovers.length} leftover process(es): ${leftovers.map((p) => `${p.pid}/${p.comm}`).join(' ')}`);
  if (suspectOrphans.length) console.warn(`[bench] ${suspectOrphans.length} new browser/runner process(es) without marker still alive: ${suspectOrphans.map((p) => `${p.pid}/${p.comm}`).join(' ')}`);
  return summary;
}

async function main() {
  const { values } = parseArgs({
    options: {
      workspace: { type: 'string' },
      scenario: { type: 'string' },
      runner: { type: 'string' },
      parallel: { type: 'string' },
      reps: { type: 'string', default: '1' },
      'rep-start': { type: 'string', default: '1' },
      out: { type: 'string' },
      label: { type: 'string' },
      kind: { type: 'string' },
      targets: { type: 'string' },
      interval: { type: 'string', default: '250' },
      'pss-budget': { type: 'string', default: '0.15' },
      launcher: { type: 'string', default: 'hook' },
      'task-history': { type: 'string', default: 'cold' },
      'timeout-min': { type: 'string', default: '90' },
      'no-clean': { type: 'boolean', default: false },
      'keep-full-graph': { type: 'boolean', default: false },
      verbose: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
    },
  });
  for (const k of ['workspace', 'scenario', 'runner', 'parallel']) {
    if (!values[k]) {
      console.error(`missing --${k}\nusage: node bench/run.mjs --workspace <baseline|atomized|sharded|path> --scenario <full|partial|tag> --runner <ct|e2e|unit|all> --parallel N [--reps R] [--out dir] [--label x]`);
      process.exit(2);
    }
  }
  const reps = Number(values.reps);
  const start = Number(values['rep-start']);
  let anyFlag = false;
  for (let i = start; i < start + reps; i++) {
    const s = await runOnce({
      workspace: values.workspace,
      scenario: values.scenario,
      runner: values.runner,
      parallel: values.parallel,
      rep: i,
      out: values.out,
      label: values.label,
      kind: values.kind,
      targets: values.targets,
      interval: values.interval,
      pssBudget: values['pss-budget'],
      launcher: values.launcher,
      taskHistory: values['task-history'],
      timeoutMin: values['timeout-min'],
      clean: !values['no-clean'],
      keepFullGraph: values['keep-full-graph'],
      verbose: values.verbose,
      dryRun: values['dry-run'],
    });
    if (s && !s.ok) anyFlag = true;
  }
  process.exit(anyFlag ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  main().catch((e) => {
    console.error(process.env.BENCH_DEBUG ? e : `[bench] ${e.message}`);
    process.exit(2);
  });
}
