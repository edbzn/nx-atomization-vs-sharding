// Slow-projects datasets for the blog, from results/slow{,-50,-100}/raw (valid runs only),
// in the same shapes as the quick datasets (runs.json, timelines.json, limits.json), plus
// model.json (work and longest task at --parallel=8 for both workloads, for the break-even chart).
import { loadSummary, findSummaries } from '/home/edouard/work/nx-atomization-vs-sharding/bench/lib/results.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
const R = '/home/edouard/work/nx-atomization-vs-sharding/results';
const OUT = '/home/edouard/work/edbzn.dev.worktrees/nx-atomization-vs-sharding/content/blog/nx-atomization-vs-sharding/data';
const r1 = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
const load = (dir) => findSummaries(`${R}/${dir}/raw`).map(loadSummary);
const real = (s) => s.taskList.filter((t) => !t.isNoop);
const row = (s) => {
  const P = s.config.parallel;
  const ts = real(s);
  const work = ts.reduce((a, t) => a + t.duration, 0) / 1000;
  return {
    s, P, work, ts,
    variant: s.config.workspace,
    runner: s.config.runner,
    target: s.config.workspace === 'sharded' ? Number(String(s.config.label).replace('target', '')) : null,
    wall: s.timing.wallMs / 1000,
    longest: Math.max(...ts.map((t) => t.duration)) / 1000,
  };
};
const limits = [];
const model = [];
for (const [dir, size] of [['slow', 12], ['slow-50', 50], ['slow-100', 100]]) {
  const rows = load(dir).map(row);
  const runs = rows.map((x) => ({
    config: `${x.variant}/full/${x.runner}/p${x.P}${x.target ? `/target${x.target}` : ''}`,
    variant: x.variant, scenario: 'full', runner: x.runner, parallel: x.P, shard_target_s: x.target,
    reps: 1, failures: 0, wall_s: r1(x.wall), tasks: x.ts.length,
    slot_util: r1(x.work / ((x.s.timing.taskPhaseMs / 1000) * x.P), 3),
    avg_cores: x.s.resources.avgCores, cpu_s: Math.round(x.s.resources.cpuSecondsAttributed),
    critical_path_s: r1((x.s.nxPerformance?.criticalPathDuration ?? 0) / 1000),
    pre_task_s: r1(x.s.timing.preTaskMs / 1000, 2),
  }));
  mkdirSync(`${OUT}/slow/${size}`, { recursive: true });
  writeFileSync(`${OUT}/slow/${size}/runs.json`, JSON.stringify(runs));
  const all = rows.filter((x) => x.runner === 'all');
  const timelines = all.flatMap((x) => x.ts.map((t) => ({ variant: x.variant, task: t.id, kind: t.kind, slot: t.slot, start_s: r1(t.start / 1000, 2), end_s: r1(t.end / 1000, 2) })));
  writeFileSync(`${OUT}/slow/${size}/timelines.json`, JSON.stringify(timelines));
  for (const x of all) {
    limits.push({ size, variant: x.variant, parallel: x.P, target: x.target, biggest: r1(x.longest), work: r1(x.work / x.P), wall: r1(x.wall) });
    model.push({ workload: 'slow', size, variant: x.variant, work_s: r1(x.work), longest_s: r1(x.longest), wall_s: r1(x.wall) });
  }
}
writeFileSync(`${OUT}/slow/limits.json`, JSON.stringify(limits, null, 1));
for (const [dir, size] of [['quick', 12], ['quick-50', 50], ['quick-100', 100]]) {
  for (const x of load(dir).map(row).filter((x) => x.runner === 'all' && x.P === 8 && (x.target == null || x.target === 10)))
    model.push({ workload: 'quick', size, variant: x.variant, work_s: r1(x.work), longest_s: r1(x.longest), wall_s: r1(x.wall) });
}
model.sort((a, b) => a.workload.localeCompare(b.workload) || a.size - b.size || a.variant.localeCompare(b.variant));
writeFileSync(`${OUT}/model.json`, JSON.stringify(model, null, 1));
console.log(limits.length, 'limits,', model.length, 'model rows');
console.log(model.map((m) => `${m.workload} ${m.size} ${m.variant} W=${m.work_s} L=${m.longest_s} wall=${m.wall_s}`).join('\n'));
