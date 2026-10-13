// RAM at the busiest moments of each all-runner --parallel=8 run: the 99th percentile of the
// sampler's summed memory (PSS, capped at RSS per tick, since PSS estimates can overshoot).
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
const ROOT = `${process.env.HOME}/work/nx-atomization-vs-sharding/results`;
const OUT = `${process.env.HOME}/work/edbzn.dev.worktrees/nx-atomization-vs-sharding/content/blog/nx-atomization-vs-sharding/data/memory.json`;
const sets = { quick: { 12: 'quick', 50: 'quick-50', 100: 'quick-100' }, slow: { 12: 'slow', 50: 'slow-50', 100: 'slow-100' } };
const rows = [];
for (const [workload, bySize] of Object.entries(sets)) {
  for (const [size, dir] of Object.entries(bySize)) {
    const raw = join(ROOT, dir, 'raw');
    for (const run of readdirSync(raw)) {
      const f = join(raw, run, 'summary.json');
      if (!existsSync(f) || !existsSync(join(raw, run, 'samples.json.gz'))) continue;
      const c = JSON.parse(readFileSync(f)).config;
      if (c.scenario !== 'full' || c.runner !== 'all' || c.parallel !== 8) continue;
      if (c.kind === 'sharded' && c.label && c.label !== 'target10') continue;
      const s = JSON.parse(gunzipSync(readFileSync(join(raw, run, 'samples.json.gz'))));
      const pi = s.columns.indexOf('pssMb');
      const ri = s.columns.indexOf('rssMb');
      const mem = s.samples.map((t) => Math.min(t[pi], t[ri])).sort((a, b) => a - b);
      const p99 = mem[Math.floor(0.99 * (mem.length - 1))];
      rows.push({ workload, size: Number(size), variant: c.kind === 'baseline' ? 'baseline' : c.kind, mem_gb: Math.round(p99 / 102.4) / 10, run });
    }
  }
}
rows.sort((a, b) => a.workload.localeCompare(b.workload) || a.size - b.size || a.variant.localeCompare(b.variant));
const dup = rows.filter((r, i) => rows.findIndex((q) => q.workload === r.workload && q.size === r.size && q.variant === r.variant) !== i);
if (dup.length) throw new Error('duplicate runs: ' + dup.map((d) => d.run).join(', '));
writeFileSync(OUT, JSON.stringify(rows.map(({ run, ...r }) => r), null, 1));
for (const r of rows) console.log(r.workload, r.size, r.variant, r.mem_gb, 'GB');
