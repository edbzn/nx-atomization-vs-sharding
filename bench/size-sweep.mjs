#!/usr/bin/env node
// Size sweep: the full workspace (Cypress CT + Playwright e2e + Vitest) at increasing project
// counts, three variants, one measured `nx affected` run each (scenario `full`, all runners).
//
//   node bench/size-sweep.mjs [--sizes 10,25,50,100,250,500,1000,2000] [--variants baseline,atomized,sharded]
//        [--parallel 8] [--timeout-min 90] [--shard-target 15] [--out results/size-sweep]
//        [--ws-dir workspaces/size] [--cooldown 20] [--min-mem-gb 16] [--mem-wait-min 30]
//        [--interval 250] [--retry-flagged] [--dry-run]
//
// For each size, ascending: generate the missing workspaces (generator/size.mjs), then run the
// variants interleaved, rotating their order per size (size #0: b,a,s; #1: a,s,b; ...). Every
// run is a separate bench/run.mjs process, i.e. exactly the main benchmark's measurement
// (NX_PROFILE, /proc sampler, Nx perf hook, cold workspace data, --skip-nx-cache, leftover
// kill). Sharded runs get SHARD_TARGET_SECONDS=<--shard-target> and the label `target<s>`.
//
// - A run that hits --timeout-min is recorded (summary flagged timedOut, wall ≥ timeout) and
//   the sweep continues. A run.mjs crash (exit 2 / signal) stops the sweep.
// - Resumable: a size × variant whose summary.json exists in <out>/raw is skipped
//   (--retry-flagged re-runs flagged ones; the old dir moves to <out>/raw/_superseded/).
// - <out>/sweep-runs.jsonl logs every run (elapsed time incl. task-graph export, exit code).
// - --dry-run prints the plan and an estimated duration from the runs measured so far.
import { spawn, spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { BENCH_DIR, REPO_DIR } from './lib/config.mjs';
import { readMeminfo } from './lib/proc.mjs';
import { findSummaries, loadSummary } from './lib/results.mjs';

const { values } = parseArgs({
  options: {
    sizes: { type: 'string', default: '10,25,50,100,250,500,1000,2000' },
    variants: { type: 'string', default: 'baseline,atomized,sharded' },
    parallel: { type: 'string', default: '8' },
    'timeout-min': { type: 'string', default: '90' },
    'shard-target': { type: 'string', default: '15' },
    out: { type: 'string', default: 'results/size-sweep' },
    'ws-dir': { type: 'string', default: 'workspaces/size' },
    cooldown: { type: 'string', default: '20' },
    'min-mem-gb': { type: 'string', default: '16' },
    'mem-wait-min': { type: 'string', default: '30' },
    interval: { type: 'string', default: '250' },
    'retry-flagged': { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
  },
});

const sizes = values.sizes.split(',').map(Number).sort((a, b) => a - b);
const variants = values.variants.split(',');
for (const v of variants) if (!['baseline', 'atomized', 'sharded'].includes(v)) throw new Error(`unknown variant ${v}`);
const parallel = Number(values.parallel);
const timeoutMin = Number(values['timeout-min']);
const shardTarget = Number(values['shard-target']);
const out = resolve(REPO_DIR, values.out);
const rawDir = join(out, 'raw');
const wsDir = resolve(REPO_DIR, values['ws-dir']);
const cooldownMs = Number(values.cooldown) * 1000;
const minMemGb = Number(values['min-mem-gb']);
const memWaitMs = Number(values['mem-wait-min']) * 60_000;
const runsLog = join(out, 'sweep-runs.jsonl');

const labelFor = (variant) => (variant === 'sharded' ? `target${shardTarget}` : null);
const wsName = (variant, n) => `${variant}-${n}`;

/** Existing summaries for this sweep's configuration, keyed by `<variant>-<N>`. */
function existingRuns() {
  const map = new Map();
  for (const f of findSummaries(rawDir)) {
    const s = loadSummary(f);
    const c = s.config;
    const m = /^(baseline|atomized|sharded)-(\d+)$/.exec(c.workspace);
    if (!m || c.scenario !== 'full' || c.runner !== 'all' || c.parallel !== parallel || (c.label ?? null) !== labelFor(m[1])) continue;
    const prev = map.get(c.workspace);
    if (!prev || prev.spawnAt < s.spawnAt) map.set(c.workspace, s);
  }
  return map;
}

const plan = [];
sizes.forEach((n, i) => {
  const shift = i % variants.length;
  for (const variant of [...variants.slice(shift), ...variants.slice(0, shift)]) plan.push({ n, variant });
});

const fmt = (ms) => (ms >= 3_600_000 ? `${Math.floor(ms / 3_600_000)}h${String(Math.round((ms % 3_600_000) / 60_000)).padStart(2, '0')}m` : ms >= 60_000 ? `${Math.floor(ms / 60_000)}m${String(Math.round((ms % 60_000) / 1000)).padStart(2, '0')}s` : `${(ms / 1000).toFixed(1)}s`);

// ------------------------------------------------------------------ estimate (--dry-run)
async function estimate(existing) {
  const { buildModel, renderWorkspace, planTotals } = await import(join(REPO_DIR, 'generator', 'size.mjs'));
  const calibration = JSON.parse(readFileSync(join(REPO_DIR, 'generator', 'calibration.json'), 'utf8'));
  const totals = new Map();
  for (const n of sizes) {
    const model = buildModel(n);
    totals.set(n, await planTotals(model, renderWorkspace(model, () => {}, { calibration }), { shardTarget }));
  }
  const elapsedByWs = new Map();
  if (existsSync(runsLog)) {
    for (const line of readFileSync(runsLog, 'utf8').split('\n').filter(Boolean)) {
      const r = JSON.parse(line);
      elapsedByWs.set(r.workspace, r.elapsedMs);
    }
  }
  // Per variant, from the largest measured size: Σ real task time per real task (it already
  // includes the contention of a saturated -P run), spread over P slots at ≥ 95 % utilisation
  // (what large task counts reach), plus pre-task time and the task-graph export scaled
  // linearly with the task count. Nx coordinator time is assumed to overlap the tasks, so
  // this is a lower bound where Nx overhead grows superlinearly (atomized at 1000-2000).
  const model = {};
  for (const variant of variants) {
    const measured = [...existing.values()].filter((s) => s.config.kind === variant && !s.flags.timedOut).sort((a, b) => b.tasks.count - a.tasks.count);
    const s = measured[0];
    if (!s) continue;
    const elapsed = elapsedByWs.get(s.config.workspace) ?? s.timing.wallMs + (s.timing.graphExportMs ?? 0);
    model[variant] = {
      from: s.config.workspace,
      perRealTaskMs: s.tasks.sumRealDurationMs / Math.max(1, s.tasks.realCount),
      util: Math.max(0.95, s.slotUtilisation ?? 0),
      preMsPerTask: ((s.timing.preTaskMs ?? 0) + (s.timing.graphExportMs ?? 0)) / Math.max(1, s.tasks.count),
      harnessMs: Math.max(0, elapsed - s.timing.wallMs - (s.timing.graphExportMs ?? 0)), // checkout, clean, idle probe, summary
    };
  }
  let total = 0;
  const rows = [];
  for (const p of plan) {
    const s = existing.get(wsName(p.variant, p.n));
    const t = totals.get(p.n).variants[p.variant];
    let ms;
    let how;
    if (s) {
      ms = 0;
      how = `done (${fmt(s.timing.wallMs)})`;
    } else if (model[p.variant]) {
      const m = model[p.variant];
      const wallMs = Math.min(timeoutMin * 60_000, (m.perRealTaskMs * t.real) / (parallel * m.util) + m.preMsPerTask * t.tasks);
      ms = wallMs + m.harnessMs + cooldownMs;
      how = `~${fmt(wallMs)} wall (Σ task time per task from ${m.from})`;
    } else {
      ms = null;
      how = 'no measurement yet';
    }
    if (ms != null) total += ms;
    rows.push(`  N=${String(p.n).padStart(4)} ${p.variant.padEnd(8)} ${String(t.tasks).padStart(6)} tasks  ${how}`);
  }
  console.log(rows.join('\n'));
  console.log(`[size-sweep] estimated remaining: ${fmt(total)} (each run capped at the ${timeoutMin} min timeout; a lower bound where Nx overhead grows superlinearly)`);
}

// ------------------------------------------------------------------ run
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitForMemory() {
  const deadline = Date.now() + memWaitMs;
  let warned = false;
  for (;;) {
    const avail = readMeminfo().memAvailable / 2 ** 30;
    if (avail >= minMemGb) return;
    if (Date.now() > deadline) {
      console.warn(`[size-sweep] MemAvailable ${avail.toFixed(1)}GB still < ${minMemGb}GB after ${values['mem-wait-min']} min; running anyway`);
      return;
    }
    if (!warned) console.log(`[size-sweep] waiting for MemAvailable >= ${minMemGb}GB (now ${avail.toFixed(1)}GB)`);
    warned = true;
    await sleep(5000);
  }
}

function ensureWorkspaces(n) {
  const missing = variants.filter((v) => !existsSync(join(wsDir, wsName(v, n), '.git')) || !existsSync(join(wsDir, wsName(v, n), 'node_modules', '.modules.yaml')));
  if (!missing.length) return;
  console.log(`\n[size-sweep] generating N=${n}: ${missing.join(', ')}`);
  const t = Date.now();
  const r = spawnSync(process.execPath, [join(REPO_DIR, 'generator', 'size.mjs'), '--projects', String(n), '--variant', missing.join(','), '--out', wsDir, '--shard-target', String(shardTarget)], { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`[size-sweep] generation of N=${n} failed (exit ${r.status}); stopping.`);
    process.exit(2);
  }
  appendFileSync(runsLog, JSON.stringify({ type: 'generate', n, variants: missing, elapsedMs: Date.now() - t, at: new Date().toISOString() }) + '\n');
  console.log(`[size-sweep] N=${n} generated in ${fmt(Date.now() - t)}`);
}

async function main() {
  mkdirSync(rawDir, { recursive: true });
  const existing = existingRuns();
  const todo = plan.filter((p) => {
    const s = existing.get(wsName(p.variant, p.n));
    return !s || (values['retry-flagged'] && !s.ok);
  });
  console.log(`[size-sweep] ${plan.length} planned run(s), ${plan.length - todo.length} already done, ${todo.length} to run -> ${rawDir}`);
  console.log(`[size-sweep] sizes ${sizes.join(',')}; variants ${variants.join(',')}; -P ${parallel}; timeout ${timeoutMin} min; shard target ${shardTarget}s`);
  if (values['dry-run']) {
    await estimate(existing);
    return;
  }

  let i = 0;
  let flagged = 0;
  let lastN = null;
  for (const p of todo) {
    if (p.n !== lastN) {
      ensureWorkspaces(p.n);
      lastN = p.n;
    }
    if (i > 0) await sleep(cooldownMs);
    await waitForMemory();
    const ws = wsName(p.variant, p.n);
    const prev = existing.get(ws);
    if (prev) {
      const dest = join(rawDir, '_superseded', basename(prev._dir));
      mkdirSync(dirname(dest), { recursive: true });
      renameSync(prev._dir, dest);
    }
    i++;
    console.log(`\n[size-sweep] ${i}/${todo.length}: N=${p.n} ${p.variant}`);
    const label = labelFor(p.variant);
    const args = [join(BENCH_DIR, 'run.mjs'), '--workspace', join(wsDir, ws), '--kind', p.variant, '--scenario', 'full', '--runner', 'all', '--parallel', String(parallel), '--reps', '1', '--out', rawDir, '--timeout-min', String(timeoutMin), '--interval', values.interval];
    if (label) args.push('--label', label);
    const env = { ...process.env };
    if (p.variant === 'sharded') env.SHARD_TARGET_SECONDS = String(shardTarget);
    else delete env.SHARD_TARGET_SECONDS;
    const t = Date.now();
    const code = await new Promise((r) => spawn(process.execPath, args, { stdio: 'inherit', env }).on('close', (c) => r(c)));
    const elapsedMs = Date.now() - t;
    const s = existingRuns().get(ws);
    appendFileSync(runsLog, JSON.stringify({ type: 'run', n: p.n, variant: p.variant, workspace: ws, exit: code, elapsedMs, dir: s?._dir ? relative(REPO_DIR, s._dir) : null, ok: s?.ok ?? null, timedOut: s?.flags?.timedOut ?? null, tasks: s?.tasks?.count ?? null, wallMs: s?.timing?.wallMs ?? null, at: new Date().toISOString() }) + '\n');
    if (code === 2 || code === null) {
      console.error(`[size-sweep] run.mjs crashed (exit ${code}); stopping. Re-run the same command to resume.`);
      process.exit(2);
    }
    if (code !== 0) {
      flagged++;
      console.warn(`[size-sweep] N=${p.n} ${p.variant} flagged${s?.flags?.timedOut ? ' (timed out)' : ''}; continuing`);
    }
  }
  console.log(`\n[size-sweep] done: ${todo.length} run(s), ${flagged} flagged. Report: node bench/size-sweep-report.mjs --out ${values.out}`);
}

main().catch((e) => {
  console.error(e.stack ?? e);
  process.exit(2);
});
