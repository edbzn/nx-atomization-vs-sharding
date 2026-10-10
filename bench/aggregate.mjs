#!/usr/bin/env node
// Aggregate raw runs into results/aggregate.{json,md} + chart-ready data in results/charts/.
//
//   node bench/aggregate.mjs [--raw results/raw] [--out results] [--include-flagged]
//
// Groups by workspace/scenario/runner/pN[/label]. Stats use the group's clean runs (ok:
// no failed task, exit 0, profile present); flagged runs are only used when a group has
// no clean run (or with --include-flagged), and are always counted under `failures`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { BASE_TARGETS, RAW_DIR, RESULTS_DIR } from './lib/config.mjs';
import { findSummaries, groupKey, loadSamples, loadSummary } from './lib/results.mjs';
import { downsampleMax, fmtMs, max, mean, median, min, p95, round, sum } from './lib/stats.mjs';

const { values } = parseArgs({
  options: {
    raw: { type: 'string', default: RAW_DIR },
    out: { type: 'string', default: RESULTS_DIR },
    'include-flagged': { type: 'boolean', default: false },
    'timeline-points': { type: 'string', default: '600' },
  },
});
const rawDir = resolve(values.raw);
const rawDirLabel = relative(process.cwd(), rawDir) || '.';
const outDir = resolve(values.out);
const chartsDir = join(outDir, 'charts');
const POINTS = Number(values['timeline-points']);

const runs = findSummaries(rawDir).map(loadSummary);
if (!runs.length) {
  console.error(`no summary.json under ${rawDir}`);
  process.exit(1);
}
const groups = new Map();
for (const s of runs) {
  const k = groupKey(s);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(s);
}

const realTasks = (s) => s.taskList.filter((t) => !t.isNoop);
const medOf = (xs, f) => median(xs.map(f).filter((x) => x != null));

const aggregate = [];
const used = new Map();
for (const [key, all] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
  const ok = all.filter((s) => s.ok);
  const use = values['include-flagged'] || !ok.length ? all : ok;
  used.set(key, use);
  const c = all[0].config;
  const walls = use.map((s) => s.timing.wallMs);
  const pooled = use.flatMap((s) => realTasks(s).map((t) => t.duration));
  const perf = use.map((s) => s.nxPerformance).filter(Boolean);
  aggregate.push({
    key,
    workspace: c.workspace,
    scenario: c.scenario,
    runner: c.runner,
    parallel: c.parallel,
    label: c.label,
    runs: all.length,
    runsUsed: use.length,
    failures: all.filter((s) => !s.ok).length,
    failureReasons: [...new Set(all.filter((s) => !s.ok).flatMap((s) => Object.entries(s.flags).filter(([, v]) => v).map(([k]) => k)))],
    failedTasks: [...new Set(all.flatMap((s) => s.tasks.failed))],
    wallMs: { median: median(walls), min: min(walls), max: max(walls), all: walls },
    preTaskMs: medOf(use, (s) => s.timing.preTaskMs),
    graphMs: medOf(use, (s) => s.timing.graphMs),
    taskPhaseMs: medOf(use, (s) => s.timing.taskPhaseMs),
    taskCount: medOf(use, (s) => s.tasks.realCount),
    atomCount: medOf(use, (s) => s.tasks.atomCount),
    noopCount: medOf(use, (s) => s.tasks.noopCount),
    sumTaskMs: medOf(use, (s) => s.tasks.sumRealDurationMs),
    taskMs: { mean: round(mean(pooled)), median: round(median(pooled)), p95: round(p95(pooled)), max: max(pooled) },
    slotUtilisation: round(medOf(use, (s) => s.slotUtilisation), 4),
    peakPssMb: medOf(use, (s) => s.resources?.peakPssMb),
    peakRssMb: medOf(use, (s) => s.resources?.peakRssMb),
    avgCores: medOf(use, (s) => s.resources?.avgCoresTaskPhase),
    peakCores: medOf(use, (s) => s.resources?.peakCores),
    cpuSeconds: medOf(use, (s) => s.resources?.cpuSecondsAttributed),
    cpuSecondsSystem: medOf(use, (s) => s.resources?.cpuSecondsSystem),
    minMemAvailableMb: min(use.map((s) => s.resources?.minMemAvailableMb).filter((x) => x != null)),
    nx: {
      criticalPathMs: round(median(perf.map((p) => p.criticalPathDuration).filter((x) => x != null))),
      recoverableMs: round(median(perf.map((p) => p.recoverable).filter((x) => x != null))),
      recoverableByParallelMs: round(median(perf.map((p) => p.recoverableByParallel).filter((x) => x != null))),
      recoverableByMachinesMs: round(median(perf.map((p) => p.recoverableByMachines).filter((x) => x != null))),
      coordinatorOverheadMs: round(median(perf.map((p) => p.coordinatorOverhead).filter((x) => x != null))),
      source: [...new Set(perf.map((p) => p.source))].join(','),
    },
    samplerCores: { median: medOf(all, (s) => s.sampler?.cores), max: max(all.map((s) => s.sampler?.cores ?? 0)) },
    representativeRun: basename(representative(use)._dir),
  });
}

function representative(use) {
  const m = median(use.map((s) => s.timing.wallMs));
  return [...use].sort((a, b) => Math.abs(a.timing.wallMs - m) - Math.abs(b.timing.wallMs - m))[0];
}

// --- startup tax ---------------------------------------------------------------------
// For a project + runner: (sum of its unit task durations in the variant - its whole-project
// task duration in baseline) / (unit count - 1) ~= fixed per-task cost. Durations are medians
// over the group's reps. Units = non-noop tasks of that runner kind (atoms, shards, or the
// whole-project target an unsharded project delegates to).
function projectUnits(s, kind) {
  const m = new Map();
  for (const t of realTasks(s)) {
    if (t.kind !== kind) continue;
    if (!m.has(t.project)) m.set(t.project, []);
    m.get(t.project).push(t);
  }
  return m;
}
const startupTax = [];
for (const a of aggregate) {
  if (a.workspace === 'baseline') continue;
  const baseKey = ['baseline', a.scenario, a.runner, `p${a.parallel}`, a.label].filter(Boolean).join('/');
  if (!used.has(baseKey)) continue;
  const baseRuns = used.get(baseKey);
  const varRuns = used.get(a.key);
  for (const kind of Object.keys(BASE_TARGETS)) {
    const perProject = [];
    const baseDur = new Map();
    for (const s of baseRuns) {
      for (const [p, ts] of projectUnits(s, kind)) {
        const whole = ts.find((t) => t.target === BASE_TARGETS[kind]);
        if (!whole) continue;
        if (!baseDur.has(p)) baseDur.set(p, []);
        baseDur.get(p).push(whole.duration);
      }
    }
    const varSum = new Map();
    const varCount = new Map();
    for (const s of varRuns) {
      for (const [p, ts] of projectUnits(s, kind)) {
        if (!varSum.has(p)) varSum.set(p, []);
        varSum.get(p).push(sum(ts.map((t) => t.duration)));
        varCount.set(p, Math.max(varCount.get(p) ?? 0, ts.length));
      }
    }
    for (const [p, sums] of varSum) {
      const n = varCount.get(p);
      if (!baseDur.has(p) || n < 2) continue;
      const b = median(baseDur.get(p));
      const v = median(sums);
      perProject.push({ project: p, units: n, baselineMs: round(b), variantSumMs: round(v), taxMs: round((v - b) / (n - 1)) });
    }
    if (!perProject.length) continue;
    startupTax.push({
      variant: a.workspace,
      scenario: a.scenario,
      runner: a.runner,
      parallel: a.parallel,
      label: a.label,
      kind,
      projects: perProject.length,
      medianTaxMs: round(median(perProject.map((x) => x.taxMs))),
      p25TaxMs: round(quantile25(perProject.map((x) => x.taxMs))),
      p75TaxMs: round(quantile75(perProject.map((x) => x.taxMs))),
      perProject,
    });
  }
}
function quantile25(xs) {
  const v = [...xs].sort((a, b) => a - b);
  return v[Math.floor((v.length - 1) * 0.25)];
}
function quantile75(xs) {
  const v = [...xs].sort((a, b) => a - b);
  return v[Math.ceil((v.length - 1) * 0.75)];
}
for (const a of aggregate) {
  const rows = startupTax.filter((x) => x.variant === a.workspace && x.scenario === a.scenario && x.runner === a.runner && x.parallel === a.parallel && x.label === a.label);
  a.startupTaxMs = Object.fromEntries(rows.map((r) => [r.kind, r.medianTaxMs]));
}

// --- charts ---------------------------------------------------------------------------
const chartBase = (a) => ({ key: a.key, workspace: a.workspace, scenario: a.scenario, runner: a.runner, parallel: a.parallel, label: a.label });
const charts = {
  'wall-time': aggregate.map((a) => ({ ...chartBase(a), medianMs: a.wallMs.median, minMs: a.wallMs.min, maxMs: a.wallMs.max, runsMs: a.wallMs.all, preTaskMs: a.preTaskMs, taskPhaseMs: a.taskPhaseMs, criticalPathMs: a.nx.criticalPathMs })),
  'task-durations': aggregate.map((a) => {
    const use = used.get(a.key);
    const byKind = {};
    for (const s of use) for (const t of realTasks(s)) (byKind[t.kind] ??= []).push(t.duration);
    return { ...chartBase(a), reps: use.length, durationsMs: use.flatMap((s) => realTasks(s).map((t) => t.duration)), byKind };
  }),
  memory: aggregate.map((a) => {
    const use = used.get(a.key);
    return { ...chartBase(a), peakPssMb: a.peakPssMb, peakRssMb: a.peakRssMb, taskPeakPssMb: use.flatMap((s) => realTasks(s).map((t) => t.peakPssMb).filter((x) => x != null)) };
  }),
  timelines: aggregate.map((a) => {
    const s = used.get(a.key).find((x) => basename(x._dir) === a.representativeRun);
    const samples = loadSamples(s._dir);
    if (!samples) return { ...chartBase(a), run: a.representativeRun, rows: [] };
    const off = samples.startedAt - s.spawnAt;
    const ix = (n) => samples.columns.indexOf(n);
    const rows = samples.samples.map((r) => [round((r[0] + off) / 1000, 2), round(r[ix('pssMb')] / 1024, 2), round(r[ix('rssMb')] / 1024, 2), r[ix('cores')], r[ix('procs')], r[ix('sysCores')]]);
    return { ...chartBase(a), run: a.representativeRun, columns: ['tS', 'pssGb', 'rssGb', 'cores', 'procs', 'sysCores'], firstTaskStartS: s.timing.firstTaskStartMs / 1000, lastTaskEndS: s.timing.lastTaskEndMs / 1000, rows: downsampleMax(rows, POINTS) };
  }),
  gantt: aggregate.map((a) => {
    const s = used.get(a.key).find((x) => basename(x._dir) === a.representativeRun);
    return {
      ...chartBase(a),
      run: a.representativeRun,
      slots: s.config.parallel,
      tasks: s.taskList.map((t) => ({ id: t.id, project: t.project, kind: t.kind, isAtom: t.isAtom, isNoop: t.isNoop, slot: t.slot, start: t.start, end: t.end, status: t.status, peakPssMb: t.peakPssMb })),
    };
  }),
  'startup-tax': startupTax,
};

mkdirSync(chartsDir, { recursive: true });
for (const [name, data] of Object.entries(charts)) writeFileSync(join(chartsDir, `${name}.json`), JSON.stringify(data));
writeFileSync(join(outDir, 'aggregate.json'), JSON.stringify({ generatedAt: new Date().toISOString(), rawDir: rawDirLabel, groups: aggregate, startupTax }, null, 1));

// --- markdown -------------------------------------------------------------------------
const gb = (mb) => (mb == null ? '-' : `${(mb / 1024).toFixed(1)}`);
const pct = (x) => (x == null ? '-' : `${Math.round(x * 100)}%`);
const md = [];
md.push(`# Aggregate results`, '', `Generated ${new Date().toISOString()} from ${runs.length} run(s) in \`${rawDirLabel}\`.`, '');
md.push('Times are medians over clean reps (min-max for wall). Task stats exclude noop parent tasks. PSS/RSS = peak of the whole Nx process tree. CPU = mean cores busy (attributed to the tree) during the task phase.', '');
md.push('| variant | scenario | runner | -P | reps (fail) | wall median (min-max) | pre-task | task phase | crit. path | tasks | sum task time | task mean / med / p95 | slot util | peak PSS GB | peak RSS GB | avg CPU | startup tax |');
md.push('|---|---|---|--:|--:|---|--:|--:|--:|--:|--:|---|--:|--:|--:|--:|---|');
for (const a of aggregate) {
  const tax = Object.entries(a.startupTaxMs ?? {}).map(([k, v]) => `${k} ${fmtMs(v)}`).join(', ') || '-';
  md.push(
    `| ${a.workspace}${a.label ? ` (${a.label})` : ''} | ${a.scenario} | ${a.runner} | ${a.parallel} | ${a.runsUsed} (${a.failures}) | ${fmtMs(a.wallMs.median)} (${fmtMs(a.wallMs.min)}-${fmtMs(a.wallMs.max)}) | ${fmtMs(a.preTaskMs)} | ${fmtMs(a.taskPhaseMs)} | ${fmtMs(a.nx.criticalPathMs)} | ${a.taskCount} | ${fmtMs(a.sumTaskMs)} | ${fmtMs(a.taskMs.mean)} / ${fmtMs(a.taskMs.median)} / ${fmtMs(a.taskMs.p95)} | ${pct(a.slotUtilisation)} | ${gb(a.peakPssMb)} | ${gb(a.peakRssMb)} | ${a.avgCores ?? '-'} | ${tax} |`,
  );
}
if (startupTax.length) {
  md.push('', '## Startup tax', '', '(sum of unit durations - baseline whole-project duration) / (units - 1), per project; median and IQR across projects.', '');
  md.push('| variant | scenario | runner | -P | kind | projects | median | p25-p75 |', '|---|---|---|--:|---|--:|--:|---|');
  for (const t of startupTax) md.push(`| ${t.variant} | ${t.scenario} | ${t.runner} | ${t.parallel} | ${t.kind} | ${t.projects} | ${fmtMs(t.medianTaxMs)} | ${fmtMs(t.p25TaxMs)}-${fmtMs(t.p75TaxMs)} |`);
}
const flagged = aggregate.filter((a) => a.failures);
if (flagged.length) {
  md.push('', '## Flagged runs', '');
  for (const a of flagged) md.push(`- \`${a.key}\`: ${a.failures} flagged (${a.failureReasons.join(', ')})${a.failedTasks.length ? `; failed tasks: ${a.failedTasks.slice(0, 10).map((x) => `\`${x}\``).join(', ')}${a.failedTasks.length > 10 ? ', ...' : ''}` : ''}`);
}
md.push('', `Sampler overhead: median ${pct(median(aggregate.map((a) => a.samplerCores.median)))} of one core, max ${pct(max(aggregate.map((a) => a.samplerCores.max)))}.`);
writeFileSync(join(outDir, 'aggregate.md'), `${md.join('\n')}\n`);
console.log(md.join('\n'));
console.log(`\n-> ${join(outDir, 'aggregate.json')}, ${join(outDir, 'aggregate.md')}, ${chartsDir}/*.json`);
