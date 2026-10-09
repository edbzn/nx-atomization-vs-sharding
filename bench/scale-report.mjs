#!/usr/bin/env node
// Aggregates bench/scale.mjs results into <out>/report.md + <out>/report.json.
//
//   node bench/scale-report.mjs [--out results/scale] [--include-failed]
//
// Medians over ok reps per (phase, size, variant). Ratios are atomized/baseline and
// sharded/baseline of those medians. "Δ per extra target/task" = (atomized − baseline) wall
// divided by the extra targets (graph-cold) or tasks (taskgraph, run) atomization adds: the
// marginal Nx-side cost of one more atom at that workspace size.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { RESULTS_DIR } from './lib/config.mjs';
import { median, round, fmtMs } from './lib/stats.mjs';

const VARIANTS = ['baseline', 'atomized', 'sharded'];

function loadAll(out, includeFailed) {
  const raw = join(out, 'raw');
  const res = [];
  if (!existsSync(raw)) return res;
  for (const nDir of readdirSync(raw).filter((d) => /^n\d+$/.test(d))) {
    for (const v of readdirSync(join(raw, nDir))) {
      for (const f of readdirSync(join(raw, nDir, v))) {
        if (!/^(graph-cold|taskgraph|hash|run)-r\d+\.json$/.test(f)) continue;
        const r = JSON.parse(readFileSync(join(raw, nDir, v, f), 'utf8'));
        if (r.ok || includeFailed) res.push(r);
      }
    }
  }
  return res;
}

const med = (rs, f) => {
  const xs = rs.map(f).filter((x) => x != null && Number.isFinite(x));
  return xs.length ? median(xs) : null;
};
const ratio = (a, b) => (a != null && b ? round(a / b, 2) : null);
const s = (ms) => (ms == null ? '-' : fmtMs(ms));
const mb = (x) => (x == null ? '-' : `${Math.round(x)}`);
const num = (x, d = 0) => (x == null ? '-' : String(round(x, d)));

function aggregate(results) {
  const groups = new Map();
  for (const r of results) {
    const k = `${r.phase}|${r.n}|${r.variant}`;
    (groups.get(k) ?? groups.set(k, []).get(k)).push(r);
  }
  const sizes = [...new Set(results.map((r) => r.n))].sort((a, b) => a - b);
  const agg = { sizes, phases: {} };
  for (const phase of ['graph-cold', 'taskgraph', 'hash', 'run']) {
    agg.phases[phase] = {};
    for (const n of sizes) {
      const row = {};
      for (const v of VARIANTS) {
        const rs = groups.get(`${phase}|${n}|${v}`);
        if (!rs?.length) continue;
        const st = rs[0].stats ?? {};
        row[v] = {
          reps: rs.length,
          failedReps: rs.filter((r) => !r.ok).length,
          wallMs: med(rs, (r) => r.wallMs),
          wallMinMs: Math.min(...rs.map((r) => r.wallMs)),
          wallMaxMs: Math.max(...rs.map((r) => r.wallMs)),
          cpuS: med(rs, (r) => r.time?.cpuS),
          nxPeakRssMb: med(rs, (r) => r.mem?.nxPeakRssMb),
          workersPeakRssMbSum: med(rs, (r) => r.mem?.workersPeakRssMbSum),
          coordTreePeakRssMb: med(rs, (r) => r.mem?.coordTreePeakRssMb),
          treePeakRssMb: med(rs, (r) => r.mem?.treePeakRssMb),
          timeMaxRssMb: med(rs, (r) => r.time?.maxRssMb),
          projects: st.projects,
          targets: st.targets,
          atomTargets: st.atomTargets,
          shardTargets: st.shardTargets,
          projectDeps: st.projectDeps,
          ...(phase === 'graph-cold' || phase === 'taskgraph'
            ? {
                buildProjectConfigsMs: med(rs, (r) => r.nxPerf?.['build-project-configs']),
                createDependenciesMs: med(rs, (r) => r.nxPerf?.createDependencies),
                loadPluginsMs: med(rs, (r) => (r.nxPerf?.loadSpecifiedNxPlugins ?? 0) + (r.nxPerf?.loadDefaultNxPlugins ?? 0) || null),
                createProjectGraphMs: med(rs, (r) => r.nxPerf?.createProjectGraphAsync),
              }
            : {}),
          ...(phase === 'taskgraph' ? { tasks: med(rs, (r) => r.taskCount) } : {}),
          ...(phase === 'hash'
            ? {
                tasks: med(rs, (r) => r.taskCount),
                hashedUpfront: med(rs, (r) => r.hashedUpfront),
                readyMs: med(rs, (r) => r.readyMs),
                createProjectGraphMs: med(rs, (r) => r.nxMeasures?.createProjectGraphAsync),
                buildProjectConfigsMs: med(rs, (r) => r.nxMeasures?.buildProjectConfigs),
                createDependenciesMs: med(rs, (r) => r.nxMeasures?.createDependencies),
                hashMultipleTasksMs: med(rs, (r) => r.nxMeasures?.hashMultipleTasks),
                hashMsPerTask: med(rs, (r) => (r.hashedUpfront ? r.nxMeasures?.hashMultipleTasks / r.hashedUpfront : null)),
              }
            : {}),
          ...(phase === 'run'
            ? {
                tasks: med(rs, (r) => r.tasks?.count),
                parallel: rs[0].parallel,
                cpus: rs[0].cpus,
                preTaskMs: med(rs, (r) => r.tasks?.preTaskMs),
                graphReadyMs: med(rs, (r) => r.hook?.graphReadyMs),
                taskPhaseMs: med(rs, (r) => r.tasks?.taskPhaseMs),
                postTaskMs: med(rs, (r) => r.tasks?.postTaskMs),
                sumDurMs: med(rs, (r) => r.tasks?.sumDurMs),
                realDurMedianMs: med(rs, (r) => r.tasks?.realDurMedianMs),
                idealMakespanMs: med(rs, (r) => r.tasks?.idealMakespanMs),
                overheadMs: med(rs, (r) => r.tasks?.overheadMs),
                overheadPerTaskMs: med(rs, (r) => r.tasks?.overheadPerTaskMs),
                gapMeanMs: med(rs, (r) => r.tasks?.gapMeanMs),
                gapMedianMs: med(rs, (r) => r.tasks?.gapMedianMs),
                gapSumMs: med(rs, (r) => r.tasks?.gapSumMs),
                slotOccupancy: med(rs, (r) => r.tasks?.slotOccupancy),
                criticalPathMs: med(rs, (r) => r.hook?.criticalPathDuration),
              }
            : {}),
        };
      }
      const b = row.baseline;
      const a = row.atomized;
      const sh = row.sharded;
      row.ratios = {
        atomizedOverBaseline: ratio(a?.wallMs, b?.wallMs),
        shardedOverBaseline: ratio(sh?.wallMs, b?.wallMs),
        nxRssAtomizedOverBaseline: ratio(a?.nxPeakRssMb, b?.nxPeakRssMb),
      };
      if (a && b) {
        const extra = phase === 'graph-cold' ? a.targets - b.targets : a.tasks - b.tasks;
        row.atomizationDelta = { wallMs: a.wallMs - b.wallMs, extraUnits: extra, unit: phase === 'graph-cold' ? 'target' : 'task', msPerExtraUnit: extra > 0 ? round((a.wallMs - b.wallMs) / extra, 2) : null };
        if (phase === 'run') {
          row.atomizationDelta.preTaskMs = a.preTaskMs - b.preTaskMs;
          row.atomizationDelta.overheadMs = a.overheadMs - b.overheadMs;
        }
      }
      if (Object.keys(row).length > 2) agg.phases[phase][n] = row;
    }
  }
  // Growth: ms per added project between consecutive measured sizes.
  agg.slopes = {};
  for (const phase of ['graph-cold', 'taskgraph', 'hash', 'run']) {
    agg.slopes[phase] = {};
    for (const v of VARIANTS) {
      const pts = sizes.map((n) => [n, agg.phases[phase][n]?.[v]?.wallMs]).filter(([, w]) => w != null);
      agg.slopes[phase][v] = pts.slice(1).map(([n, w], i) => ({ from: pts[i][0], to: n, msPerProject: round((w - pts[i][1]) / (n - pts[i][0]), 2) }));
    }
  }
  return agg;
}

function table(header, rows) {
  return [`| ${header.join(' | ')} |`, `|${header.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

function markdown(agg, results) {
  const L = [];
  const P = agg.phases;
  const cpus = [...new Set(results.map((r) => r.cpus))];
  L.push('# Nx atomization: workspace-size scaling');
  L.push('');
  L.push(`Generated by \`bench/scale-report.mjs\` from ${results.length} results (sizes ${agg.sizes.join(', ')}; CPUs available to the runs: ${cpus.join(', ')}). Medians over ok reps. Wall = spawn of \`nx\` to exit.`);
  L.push('');
  L.push('## Workspace shape');
  L.push('');
  const shapeRows = [];
  for (const n of agg.sizes) for (const v of VARIANTS) {
    const g = P['graph-cold'][n]?.[v] ?? P.taskgraph[n]?.[v] ?? P.run[n]?.[v];
    if (!g) continue;
    shapeRows.push([n, v, g.projects ?? '-', g.targets ?? '-', g.atomTargets || g.shardTargets || '-', g.projectDeps ?? '-', P.taskgraph[n]?.[v]?.tasks ?? P.run[n]?.[v]?.tasks ?? '-']);
  }
  L.push(table(['N', 'variant', 'projects', 'targets', 'atom/shard targets', 'project deps', 'tasks (-t test / test-ci)'], shapeRows));

  for (const [phase, title, what] of [
    ['graph-cold', 'Project graph, cold (`nx show projects --json`, .nx/workspace-data wiped)', 'targets'],
    ['taskgraph', 'Task graph export, cold (`nx run-many -t <t> --graph=<file>.json`, no task runs; Nx builds the project graph twice on this path)', 'tasks'],
  ]) {
    L.push('');
    L.push(`## ${title}`);
    L.push('');
    const rows = [];
    for (const n of agg.sizes) {
      const r = P[phase][n];
      if (!r) continue;
      rows.push([
        n,
        ...VARIANTS.map((v) => s(r[v]?.wallMs)),
        num(r.ratios.atomizedOverBaseline, 2),
        num(r.ratios.shardedOverBaseline, 2),
        r.atomizationDelta ? `${s(r.atomizationDelta.wallMs)} / ${r.atomizationDelta.extraUnits} = ${num(r.atomizationDelta.msPerExtraUnit, 2)}ms` : '-',
        VARIANTS.map((v) => s(r[v]?.buildProjectConfigsMs)).join(' / '),
        VARIANTS.map((v) => mb(r[v]?.nxPeakRssMb)).join(' / '),
        VARIANTS.map((v) => mb(r[v]?.coordTreePeakRssMb)).join(' / '),
      ]);
    }
    L.push(table(['N', 'baseline', 'atomized', 'sharded', 'A/B', 'S/B', `A−B per extra ${what.slice(0, -1)}`, 'build-project-configs B/A/S', 'nx peak RSS MB B/A/S', 'nx+workers peak RSS MB B/A/S'], rows));
  }

  L.push('');
  L.push('## Ready to run, cold (`nx run-many -t <t>` exiting where the orchestrator would start)');
  L.push('');
  L.push('Wall = boot + project graph + task graph + upfront hashing of every task that does not read dependency outputs (all atoms/shards/`test` tasks; atomized `test-ci` parents hash later). Breakdown from Nx\'s own perf_hooks measures.');
  L.push('');
  const hRows = [];
  for (const n of agg.sizes) for (const v of VARIANTS) {
    const r = P.hash[n]?.[v];
    if (!r) continue;
    const row = P.hash[n];
    hRows.push([n, v, r.tasks, r.hashedUpfront, s(r.wallMs), s(r.createProjectGraphMs), s(r.buildProjectConfigsMs), s(r.createDependenciesMs), s(r.hashMultipleTasksMs), num(r.hashMsPerTask, 3), v === 'atomized' ? num(row.ratios.atomizedOverBaseline, 2) : v === 'sharded' ? num(row.ratios.shardedOverBaseline, 2) : '1', v === 'atomized' && row.atomizationDelta ? `${num(row.atomizationDelta.msPerExtraUnit, 2)}ms` : '', mb(r.nxPeakRssMb), mb(r.coordTreePeakRssMb)]);
  }
  L.push(hRows.length ? table(['N', 'variant', 'tasks', 'hashed upfront', 'wall', 'project graph', 'build-project-configs', 'createDependencies', 'hashMultipleTasks', 'hash ms/task', 'wall ×B', 'A−B per extra task', 'nx peak RSS MB', 'nx+workers peak RSS MB'], hRows) : '_No results._');

  L.push('');
  L.push('## Uncached run (`nx run-many -t <t> --parallel=P --skip-nx-cache --outputStyle=static`)');
  L.push('');
  L.push('`overhead` = wall − Σ task durations / P (perfect packing of the measured durations): boot, graph, hashing, scheduling, tail. `slot gap` = idle time between consecutive tasks on one slot (Nx scheduling/hashing/spawn latency; the mean also includes waits for dependencies, e.g. a noop parent waiting for its last atom). Task durations include Vitest startup (runtime, not Nx).');
  L.push('');
  const runRows = [];
  for (const n of agg.sizes) for (const v of VARIANTS) {
    const r = P.run[n]?.[v];
    if (!r) continue;
    runRows.push([n, v, r.tasks, `p${r.parallel}/${r.cpus}cpu`, s(r.wallMs), s(r.graphReadyMs), s(r.preTaskMs), s(r.taskPhaseMs), s(r.sumDurMs), s(r.realDurMedianMs), s(r.overheadMs), num(r.overheadPerTaskMs, 1), `${num(r.gapMedianMs, 1)} / ${num(r.gapMeanMs, 1)}`, num(r.slotOccupancy, 2), mb(r.nxPeakRssMb), mb(r.treePeakRssMb), num(r.cpuS, 0)]);
  }
  L.push(table(['N', 'variant', 'tasks', 'P/cpus', 'wall', 'graphs+hash ready', 'first task start', 'task phase', 'Σ task', 'task median', 'overhead', 'overhead/task ms', 'slot gap ms median / mean', 'occupancy', 'nx peak RSS MB', 'tree peak RSS MB', 'CPU s'], runRows));
  L.push('');
  const rr = [];
  for (const n of agg.sizes) {
    const r = P.run[n];
    if (!r?.atomizationDelta) continue;
    rr.push([n, num(r.ratios.atomizedOverBaseline, 2), num(r.ratios.shardedOverBaseline, 2), s(r.atomizationDelta.preTaskMs), s(r.atomizationDelta.overheadMs), `${num(r.atomizationDelta.msPerExtraUnit, 1)}ms`, num(r.ratios.nxRssAtomizedOverBaseline, 2)]);
  }
  if (rr.length) L.push(table(['N', 'wall A/B', 'wall S/B', 'Δ pre-task (A−B)', 'Δ overhead (A−B)', 'Δ wall per extra task', 'nx RSS A/B'], rr));

  L.push('');
  L.push('## Growth (ms of wall per added project, between consecutive sizes)');
  L.push('');
  const gRows = [];
  for (const phase of ['graph-cold', 'taskgraph', 'hash', 'run']) for (const v of VARIANTS) {
    const sl = agg.slopes[phase][v];
    if (sl.length) gRows.push([phase, v, sl.map((x) => `${x.from}→${x.to}: ${x.msPerProject}`).join(', ')]);
  }
  L.push(gRows.length ? table(['phase', 'variant', 'ms/project'], gRows) : '_Needs at least two sizes._');
  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    L.push('');
    L.push('## Failed results (included with --include-failed)');
    for (const r of failed) L.push(`- N=${r.n} ${r.variant} ${r.phase} r${r.rep}: ${(r.errors ?? [`exit ${r.exitCode}`]).join('; ')}`);
  }
  L.push('');
  return L.join('\n');
}

function main() {
  const { values } = parseArgs({ options: { out: { type: 'string', default: join(RESULTS_DIR, 'scale') }, 'include-failed': { type: 'boolean', default: false } } });
  const out = resolve(values.out);
  const results = loadAll(out, values['include-failed']);
  if (!results.length) throw new Error(`no results under ${join(out, 'raw')}`);
  const agg = aggregate(results);
  writeFileSync(join(out, 'report.json'), JSON.stringify(agg, null, 2) + '\n');
  writeFileSync(join(out, 'report.md'), markdown(agg, results));
  console.log(`wrote ${join(out, 'report.md')} and report.json (${results.length} results)`);
}

main();
