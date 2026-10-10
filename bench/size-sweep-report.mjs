#!/usr/bin/env node
// Size-sweep report: <out>/raw/**/summary.json -> <out>/report.json + <out>/report.md
//
//   node bench/size-sweep-report.mjs [--out results/size-sweep] [--parallel 8]
//
// One row per size × variant (the newest run of that workspace; flagged runs are kept and
// marked). Expected totals come from generator/size.mjs (same seed, so they match the
// generated workspaces) at the run's shard target (label `target<s>`, else 15).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { REPO_DIR } from './lib/config.mjs';
import { findSummaries, loadSamples, loadSummary } from './lib/results.mjs';
import { fmtMs, mean, median, round, sum } from './lib/stats.mjs';

const { values } = parseArgs({
  options: {
    out: { type: 'string', default: 'results/size-sweep' },
    parallel: { type: 'string' },
  },
});
const out = resolve(REPO_DIR, values.out);
const VARIANTS = ['baseline', 'atomized', 'sharded'];

const { buildModel, renderWorkspace, planTotals } = await import(join(REPO_DIR, 'generator', 'size.mjs'));
const calibration = JSON.parse(readFileSync(join(REPO_DIR, 'generator', 'calibration.json'), 'utf8'));
const planCache = new Map();
async function planFor(n, shardTarget) {
  const key = `${n}/${shardTarget}`;
  if (!planCache.has(key)) {
    const model = buildModel(n);
    planCache.set(key, await planTotals(model, renderWorkspace(model, () => {}, { calibration }), { shardTarget }));
  }
  return planCache.get(key);
}

/**
 * Idle time between one real task's end and the next real task's start on the same slot.
 * Noop parents (atomizer / shard CI targets) are skipped: they finish instantly once their
 * children are done, so they only mark dependency waits, not coordinator latency.
 */
function slotGaps(taskList) {
  const bySlot = new Map();
  for (const t of taskList) {
    if (t.slot == null || t.isNoop) continue;
    if (!bySlot.has(t.slot)) bySlot.set(t.slot, []);
    bySlot.get(t.slot).push(t);
  }
  const gaps = [];
  for (const list of bySlot.values()) {
    list.sort((a, b) => a.start - b.start);
    for (let i = 1; i < list.length; i++) gaps.push(Math.max(0, list[i].start - list[i - 1].end));
  }
  return gaps;
}

const runs = new Map();
for (const f of findSummaries(join(out, 'raw'))) {
  const s = loadSummary(f);
  const c = s.config;
  const m = /^(baseline|atomized|sharded)-(\d+)$/.exec(c.workspace);
  if (!m || c.scenario !== 'full' || c.runner !== 'all') continue;
  if (values.parallel && c.parallel !== Number(values.parallel)) continue;
  const key = `${m[2]}/${m[1]}/p${c.parallel}`;
  const prev = runs.get(key);
  if (!prev || prev.spawnAt < s.spawnAt) runs.set(key, s);
}

const rows = [];
for (const s of runs.values()) {
  const c = s.config;
  const [, variant, nStr] = /^(baseline|atomized|sharded)-(\d+)$/.exec(c.workspace);
  const n = Number(nStr);
  const shardTarget = c.label?.startsWith('target') ? Number(c.label.slice(6)) : 15;
  const plan = await planFor(n, shardTarget);
  const samples = loadSamples(s._dir);
  const nxMain = samples?.processes?.find((p) => p.pid === samples.rootPid) ?? null;
  const gaps = slotGaps(s.taskList ?? []);
  const nx = s.nxPerformance ?? {};
  const r = s.resources ?? {};
  rows.push({
    key: `${n}/${variant}`,
    projects: n,
    variant,
    parallel: c.parallel,
    shardTarget: variant === 'sharded' ? shardTarget : null,
    specs: plan.specs,
    specsByRunner: { cypress: plan.byRunner.cypress.specs, vitest: plan.byRunner.vitest.specs, playwright: plan.byRunner.playwright.specs },
    tasks: s.tasks.count,
    realTasks: s.tasks.realCount,
    noopTasks: s.tasks.noopCount,
    expectedTasks: plan.variants[variant].tasks,
    graphTasks: s.tasks.graphCount,
    tasksByKind: Object.fromEntries(Object.entries(s.tasks.byKind ?? {}).map(([k, v]) => [k, v.count])),
    wallMs: s.timing.wallMs,
    preTaskMs: s.timing.preTaskMs,
    nxBootMs: s.timing.nxBootMs,
    graphMs: s.timing.graphMs,
    dispatchMs: s.timing.dispatchMs,
    taskPhaseMs: s.timing.taskPhaseMs,
    postTaskMs: s.timing.postTaskMs,
    graphExportMs: s.timing.graphExportMs ?? null,
    sumTaskMs: s.tasks.sumDurationMs,
    sumRealTaskMs: s.tasks.sumRealDurationMs,
    medianTaskMs: s.tasks.medianMs,
    p95TaskMs: s.tasks.p95Ms,
    cpuSeconds: r.cpuSecondsAttributed ?? null,
    cpuSecondsSystem: r.cpuSecondsSystem ?? null,
    avgCores: r.avgCores ?? null,
    avgCoresTaskPhase: r.avgCoresTaskPhase ?? null,
    peakCores: r.peakCores ?? null,
    slotUtilisation: s.slotUtilisation,
    peakPssMb: r.peakPssMb ?? null,
    peakRssMb: r.peakRssMb ?? null,
    minMemAvailableMb: r.minMemAvailableMb ?? null,
    nxCoordinatorOverheadMs: nx.coordinatorOverhead ?? null,
    nxOverheadMs: nx.overhead ?? null,
    nxCriticalPathMs: nx.criticalPathDuration ?? null,
    nxRecoverableByParallelMs: nx.recoverableByParallel ?? null,
    nxPerfSource: nx.source ?? null,
    gapMeanMs: gaps.length ? round(mean(gaps), 1) : null,
    gapMedianMs: gaps.length ? round(median(gaps), 1) : null,
    gapSumMs: round(sum(gaps)),
    nxMainPeakRssMb: nxMain?.peakRssMb ?? null,
    nxMainCpuSeconds: nxMain?.cpuSeconds ?? null,
    nxCoordinatorPeakRssMb: r.nxCoordinator?.peakRssMb ?? null,
    nxCoordinatorCpuSeconds: r.nxCoordinator?.cpuSeconds ?? null,
    ok: s.ok,
    timedOut: !!s.flags.timedOut,
    failed: s.tasks.failed.length,
    notRun: s.tasks.notRun.length,
    flags: Object.entries(s.flags).filter(([, v]) => v).map(([k]) => k),
    runDir: s._dir.slice(REPO_DIR.length + 1),
    timestamp: c.timestamp,
  });
}
rows.sort((a, b) => a.projects - b.projects || VARIANTS.indexOf(a.variant) - VARIANTS.indexOf(b.variant));
const sizes = [...new Set(rows.map((r) => r.projects))];

writeFileSync(join(out, 'report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), sizes, variants: VARIANTS, rows }, null, 1) + '\n');

// ------------------------------------------------------------------ markdown
const f = (ms) => (ms == null ? '-' : fmtMs(ms));
const gb = (mb) => (mb == null ? '-' : (mb / 1024).toFixed(1));
const wall = (r) => `${r.timedOut ? '≥' : ''}${f(r.wallMs)}${r.timedOut ? ' (timeout)' : !r.ok ? ' (flagged)' : ''}`;
const md = [];
md.push('# Size sweep', '');
md.push('Full workspace (Cypress CT + Playwright e2e + Vitest) at N projects; one `nx affected` run per size × variant on the `full` tag (everything affected), all three runners together, `--skip-nx-cache`, cold workspace data. Generated by `bench/size-sweep-report.mjs`; metrics as in `bench/README.md`.', '');
md.push('| N | variant | specs | tasks (real) | wall | pre-task | task phase | Σ task time | median task | CPU s | avg / peak cores | slot util | peak PSS GB | Nx coord. overhead | mean / median slot gap | nx main RSS MB | flags |');
md.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows) {
  md.push(
    `| ${r.projects} | ${r.variant}${r.shardTarget ? ` (${r.shardTarget}s)` : ''} | ${r.specs} | ${r.tasks} (${r.realTasks})${r.graphTasks != null && r.graphTasks !== r.expectedTasks ? ` ≠ plan ${r.expectedTasks}` : ''} | ${wall(r)} | ${f(r.preTaskMs)} | ${f(r.taskPhaseMs)} | ${f(r.sumTaskMs)} | ${f(r.medianTaskMs)} | ${r.cpuSeconds ?? '-'} | ${r.avgCores ?? '-'} / ${r.peakCores ?? '-'} | ${r.slotUtilisation != null ? `${Math.round(r.slotUtilisation * 100)}%` : '-'} | ${gb(r.peakPssMb)} | ${f(r.nxCoordinatorOverheadMs)} | ${r.gapMeanMs ?? '-'} / ${r.gapMedianMs ?? '-'} ms | ${r.nxMainPeakRssMb ?? '-'} | ${r.flags.join(', ') || '-'} |`,
  );
}
md.push('', '## Wall time relative to baseline', '');
md.push('| N | baseline | atomized | sharded | atomized / baseline | sharded / baseline |');
md.push('|---|---|---|---|---|---|');
for (const n of sizes) {
  const g = Object.fromEntries(rows.filter((r) => r.projects === n).map((r) => [r.variant, r]));
  const ratio = (x) => (x && g.baseline ? `${x.timedOut ? '≥' : ''}${(x.wallMs / g.baseline.wallMs).toFixed(2)}×` : '-');
  md.push(`| ${n} | ${g.baseline ? wall(g.baseline) : '-'} | ${g.atomized ? wall(g.atomized) : '-'} | ${g.sharded ? wall(g.sharded) : '-'} | ${ratio(g.atomized)} | ${ratio(g.sharded)} |`);
}
md.push('', '## Nx-side cost', '');
md.push('Pre-task = spawn → first task start (boot, project graph, task graph, upfront hashing). Graph = hook start → PerformanceLifeCycle created. Coordinator overhead = Nx performance summary (`coordinatorOverhead`). Slot gap = idle time between consecutive real (non-noop) tasks on one slot.', '');
md.push('| N | variant | tasks | pre-task | of which graph | coord. overhead | per task | mean slot gap | nx main peak RSS MB | nx tree CPU s | task-graph export |');
md.push('|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows) {
  const per = r.nxCoordinatorOverheadMs != null && r.tasks ? `${(r.nxCoordinatorOverheadMs / r.tasks).toFixed(1)} ms` : '-';
  md.push(`| ${r.projects} | ${r.variant} | ${r.tasks} | ${f(r.preTaskMs)} | ${f(r.graphMs)} | ${f(r.nxCoordinatorOverheadMs)} | ${per} | ${r.gapMeanMs ?? '-'} ms | ${r.nxMainPeakRssMb ?? '-'} | ${r.nxCoordinatorCpuSeconds ?? '-'} | ${f(r.graphExportMs)} |`);
}
writeFileSync(join(out, 'report.md'), md.join('\n') + '\n');
console.log(`${rows.length} row(s) -> ${join(out, 'report.json')}, ${join(out, 'report.md')}`);
if (!existsSync(join(out, 'raw'))) console.warn(`no runs under ${join(out, 'raw')}`);
