#!/usr/bin/env node
// Builds the chart datasets used by the results report and the blog post from the benchmark
// results: node bench/report-data.mjs  ->  results/report/*.json
//
// Inputs: results/aggregate.json (bench/aggregate.mjs), results/charts/*.json, results/sim/*.json
// (bench/simulate.mjs), results/scale/report.json (bench/scale-report.mjs), results/matrix.log
// (sweep status, optional), results/report/nx-profile.cpuprofile (optional: a
// `node --cpu-prof` profile of the main Nx process; without it the committed
// results/report/nx-profile.json is kept).
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
// --results: where aggregate.json, charts/ and sim/ live (e.g. results/closeup for the
// 100-project close-up); --out: where the datasets go; --default-shard-target: the target of
// unlabelled sharded runs (90 for the main workspaces, 15 for the size-sweep workspaces).
const { values: cli } = parseArgs({
  options: {
    results: { type: 'string', default: join(REPO, 'results') },
    out: { type: 'string' },
    'default-shard-target': { type: 'string', default: '90' },
    // The sharded configuration the charts present as "sharded" (e.g. target1.5): its runs
    // replace the unlabelled sharded runs in the timelines, resources and durations.
    'sharded-label': { type: 'string' },
  },
});
const RES = resolve(cli.results);
const OUT = resolve(cli.out ?? join(RES, 'report'));
const DEFAULT_SHARD_TARGET = Number(cli['default-shard-target']);
const SHARDED_LABEL = cli['sharded-label'] ?? null;
// Is this group/chart entry the presented configuration? Unlabelled runs, except sharded
// ones when another sharded label is presented.
const presented = (g) => (g.workspace === 'sharded' && SHARDED_LABEL ? g.label === SHARDED_LABEL : !g.label);
mkdirSync(OUT, { recursive: true });
const r1 = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
const write = (name, rows) => writeFileSync(join(OUT, name), JSON.stringify(rows));

const agg = JSON.parse(readFileSync(join(RES, 'aggregate.json'), 'utf8'));
const groups = agg.groups.filter((g) => g.runsUsed > 0);

// 1. runs: one row per configuration (median over reps)
const runs = groups.map((g) => ({
  config: g.key,
  variant: g.workspace,
  scenario: g.scenario,
  runner: g.runner,
  parallel: g.parallel,
  shard_target_s: g.label?.startsWith('target') ? Number(g.label.slice(6)) : g.workspace === 'sharded' ? DEFAULT_SHARD_TARGET : null,
  reps: g.runsUsed,
  failures: g.failures,
  wall_s: r1(g.wallMs.median / 1000),
  wall_min_s: r1(g.wallMs.min / 1000),
  wall_max_s: r1(g.wallMs.max / 1000),
  tasks: g.taskCount,
  task_time_min: r1(g.sumTaskMs / 60000, 2),
  critical_path_s: r1((g.nx?.criticalPathMs ?? 0) / 1000),
  slot_util: Math.round(g.slotUtilisation * 1000) / 1000,
  peak_pss_gb: r1(g.peakPssMb / 1024, 2),
  avg_cores: r1(g.avgCores, 2),
  // CPU time of the whole Nx process tree, attributed by the /proc sampler
  cpu_s: Math.round(g.cpuSeconds),
  pre_task_s: r1(g.preTaskMs / 1000, 2),
  runs_failed: g.runs - g.runsUsed,
}));
// granularity ladder: one task per project -> shards at 90/30/15 s -> one task per spec
for (const r of runs) {
  r.granularity = r.variant === 'baseline' ? 'per project' : r.variant === 'atomized' ? 'per spec' : `shard ${r.shard_target_s} s`;
}
write('runs.json', runs);

// 2. startup tax per atom (atomized, full, p8): measured from atoms vs whole-project runs
const tax = groups
  .filter((g) => g.workspace === 'atomized' && g.scenario === 'full' && g.parallel === 8 && g.runner !== 'all' && !g.label)
  .map((g) => ({ runner: g.runner, startup_tax_s: r1(Object.values(g.startupTaxMs)[0] / 1000, 2), source: 'measured here (atoms vs whole-project run)' }));
write('startup-tax.json', tax);

// 3. DTE simulation grid
const sim = [];
for (const f of readdirSync(join(RES, 'sim'))) {
  const m = f.match(/^(baseline|atomized|sharded)_full_all_p8(?:_(target[\d.]+))?(_tax-ct-17)?(?:_x(\d+))?\.json$/);
  if (!m) continue;
  if (m[1] === 'sharded' && (m[2] ?? null) !== SHARDED_LABEL) continue;
  const d = JSON.parse(readFileSync(join(RES, 'sim', f), 'utf8'));
  for (const r of d.results) {
    if (r.params.order !== 'longest-first') continue;
    sim.push({
      variant: m[1],
      ct_startup: m[3] ? 'heavy (+17 s)' : 'measured',
      load: `${m[4] ?? 1}x`,
      policy: r.params.policy,
      agents: r.params.agents,
      makespan_min: r1(r.makespanMs / 60000, 2),
      agent_min: r1(r.agentMinutes, 1),
      slot_util: Math.round(r.slotUtilisation * 1000) / 1000,
    });
  }
}
// keep one row per (variant, startup, load, policy, agents): the K=4/8/16 rerun overwrote nothing,
// but x1 has K=1..16 from the first sweep and K=4..16 from the second
const seen = new Set();
const simRows = sim.filter((r) => {
  const k = [r.variant, r.ct_startup, r.load, r.policy, r.agents].join('|');
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});
write('dte-sim.json', simRows);

// 4. slot timelines of one representative run per variant (full pipeline, -P 8)
const gantt = JSON.parse(readFileSync(join(RES, 'charts/gantt.json'), 'utf8'));
const tl = [];
for (const g of gantt) {
  if (g.scenario !== 'full' || g.runner !== 'all' || g.parallel !== 8 || !presented(g)) continue;
  for (const t of g.tasks) {
    if (t.isNoop) continue;
    tl.push({
      variant: g.workspace,
      task: t.id,
      kind: t.kind,
      slot: t.slot,
      start_s: r1(t.start / 1000, 2),
      end_s: r1(t.end / 1000, 2),
    });
  }
}
write('timelines.json', tl);

// 4b. resources over time, full pipeline -P 8, the same representative run per variant, 1 s buckets
const timelines = JSON.parse(readFileSync(join(RES, 'charts/timelines.json'), 'utf8'));
const res = [];
for (const t of timelines) {
  if (t.scenario !== 'full' || t.runner !== 'all' || t.parallel !== 8 || !presented(t)) continue;
  const iT = t.columns.indexOf('tS'), iP = t.columns.indexOf('pssGb'), iC = t.columns.indexOf('cores');
  const buckets = new Map();
  for (const row of t.rows) {
    const b = Math.floor(row[iT]);
    const cur = buckets.get(b) ?? { n: 0, pss: 0, cores: 0 };
    cur.n++; cur.pss = Math.max(cur.pss, row[iP]); cur.cores += row[iC];
    buckets.set(b, cur);
  }
  for (const [b, v] of buckets) res.push({ variant: t.workspace, t_s: b, pss_gb: r1(v.pss, 2), cores: r1(v.cores / v.n, 2) });
}
write('resources.json', res);

// 4c. every task duration (all reps) of the full pipeline at -P 8, by kind
const durations = JSON.parse(readFileSync(join(RES, 'charts/task-durations.json'), 'utf8'));
const dur = [];
for (const d of durations) {
  if (d.scenario !== 'full' || d.runner !== 'all' || d.parallel !== 8 || !presented(d)) continue;
  for (const [kind, ms] of Object.entries(d.byKind)) {
    if (kind === 'build') continue;
    ms.forEach((m, i) => dur.push({ id: `${d.workspace}-${kind}-${i}`, variant: d.workspace, kind, duration_s: r1(m / 1000, 2) }));
  }
}
write('task-durations.json', dur);

// 4d. workspace-size sweep (Vitest-only workspaces, 20..1500 projects)
try {
  const sr = JSON.parse(readFileSync(join(REPO, 'results/scale/report.json'), 'utf8'));
  const scale = [];
  for (const n of sr.sizes) for (const variant of ['baseline', 'atomized', 'sharded']) {
    const g = sr.phases['graph-cold'][n]?.[variant], h = sr.phases.hash[n]?.[variant], r = sr.phases.run[n]?.[variant];
    if (!g || !h || !r) continue;
    scale.push({
      key: `${n}/${variant}`, projects: Number(n), variant, tasks: r.tasks,
      graph_cold_s: r1(g.wallMs / 1000, 2), ready_s: r1(h.wallMs / 1000, 2),
      run_wall_min: r1(r.wallMs / 60000, 2), task_time_min: r1(r.sumDurMs / 60000, 1), task_median_s: r1(r.realDurMedianMs / 1000, 2),
      gap_mean_ms: r1(r.gapMeanMs, 1), nx_rss_mb: Math.round(r.nxPeakRssMb), cpu_s: Math.round(r.cpuS),
    });
  }
  write('scale.json', scale);
} catch (e) { console.warn('no scale report', e.message); }

// 4d'. size sweep (full workspace: CT + e2e + Vitest, 10..2000 projects), when its report exists
try {
  const sw = JSON.parse(readFileSync(join(REPO, 'results/size-sweep/report.json'), 'utf8'));
  write('size-sweep.json', sw.rows.map((r) => ({
    key: r.key, projects: r.projects, variant: r.variant, parallel: r.parallel, shard_target_s: r.shardTarget,
    specs: r.specs, tasks: r.tasks, real_tasks: r.realTasks,
    wall_min: r1(r.wallMs / 60000, 2), pre_task_s: r1((r.preTaskMs ?? 0) / 1000, 2), task_phase_min: r1((r.taskPhaseMs ?? 0) / 60000, 2),
    task_time_min: r1(r.sumTaskMs / 60000, 1), median_task_s: r1((r.medianTaskMs ?? 0) / 1000, 2),
    cpu_s: r.cpuSeconds == null ? null : Math.round(r.cpuSeconds), avg_cores: r.avgCores, peak_cores: r.peakCores,
    slot_util: r.slotUtilisation == null ? null : Math.round(r.slotUtilisation * 1000) / 1000,
    peak_pss_gb: r.peakPssMb == null ? null : r1(r.peakPssMb / 1024, 2),
    nx_coord_overhead_s: r.nxCoordinatorOverheadMs == null ? null : r1(r.nxCoordinatorOverheadMs / 1000, 2),
    gap_mean_ms: r.gapMeanMs, nx_rss_mb: r.nxMainPeakRssMb == null ? null : Math.round(r.nxMainPeakRssMb),
    timed_out: r.timedOut, failed_tasks: r.failed, ok: r.ok,
  })));
} catch (e) { if (e.code !== 'ENOENT') throw e; }

// 4e. where the Nx main process spends its CPU: atomized, 100 projects, 912 tasks (node --cpu-prof)
try {
  const prof = JSON.parse(readFileSync(join(OUT, 'nx-profile.cpuprofile'), 'utf8'));
  const byId = new Map(prof.nodes.map((n) => [n.id, n]));
  const self = new Map();
  let total = 0;
  prof.samples.forEach((id, i) => {
    const us = prof.timeDeltas[i] ?? 0;
    const name = byId.get(id).callFrame.functionName || '(anonymous)';
    if (name === '(idle)') return;
    total += us;
    self.set(name, (self.get(name) ?? 0) + us);
  });
  const LABELS = {
    plan: 'Hash planning (native planner)', detectTaskInvocationLoop: 'Invocation-loop check (SQLite write per task)', completeTasks: 'Task completion bookkeeping',
    spawn: 'Spawning task processes', persistTerminalOutputs: 'Persisting terminal output', recordTerminalOutputs: 'Recording terminal output to cache',
  };
  const rows = Object.entries(LABELS).map(([fn, label]) => ({ step: label, function: fn, self_s: r1((self.get(fn) ?? 0) / 1e6, 1) }));
  const named = rows.reduce((a, r) => a + r.self_s, 0);
  rows.push({ step: 'Everything else', function: '(other)', self_s: r1(total / 1e6 - named, 1) });
  write('nx-profile.json', rows);
} catch { console.warn('no results/report/nx-profile.cpuprofile: keeping results/report/nx-profile.json'); }


// 6. sweep status
// matrix.log has one section per matrix, each opening with "[matrix] N planned run(s)"
let log = '';
try { log = readFileSync(join(REPO, 'results/matrix.log'), 'utf8'); } catch {}
const sections = log.split(/^\[matrix\] (?=\d+ planned)/m).slice(1);
const names = ['Main comparison', 'Parallelism sweep', 'Shard-target sweep'];
const planned = [72, 24, 16];
const sweeps = names.map((sweep, i) => {
  const sec = sections[i] ?? '';
  const runsDone = (sec.match(/^(OK|FLAG)\s/gm) ?? []).length;
  return { sweep, runs_planned: planned[i], runs_done: runsDone, status: runsDone >= planned[i] ? 'done' : sec ? 'running' : 'queued' };
});
// workspace-size sweep: one results folder per size (n20, n100, n500, n1500); the newest one is in progress
let sizesStarted = 0;
try { sizesStarted = readdirSync(join(REPO, 'results/scale/raw')).filter((f) => /^n\d+$/.test(f)).length; } catch {}
const scaleReport = (() => { try { return JSON.parse(readFileSync(join(REPO, 'results/scale/report.json'), 'utf8')).sizes.length >= 4; } catch { return false; } })();
sweeps.push({ sweep: 'Workspace-size sweep (sizes)', runs_planned: 4, runs_done: scaleReport ? 4 : Math.max(0, sizesStarted - 1), status: scaleReport ? 'done' : 'running' });
write('sweeps.json', sweeps);

console.log({ res: res.length, dur: dur.length, runs: runs.length, tax: tax.length, sim: simRows.length, timelines: tl.length });
