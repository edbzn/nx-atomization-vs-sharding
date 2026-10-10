#!/usr/bin/env node
// DTE simulator CLI: replay measured task durations through K agents x P slots.
//
//   node bench/simulate.mjs --from <summary.json | run dir | workspace/scenario/runner/pN[/label]>
//        [--agents 1,2,4,8,16] [--slots 3] [--policy batch,greedy] [--order longest-first]
//        [--mem-cap 32] [--bootstrap 60] [--penalty 3] [--noop instant|slot]
//        [--raw results/raw] [--out results/sim] [--no-gantt] [--extra-tax ct=17,e2e=0,unit=0] [--replicate k]
//   node bench/simulate.mjs --validate [--raw results/raw] [--out results/sim]
//
// An aggregate key uses the median duration / peak PSS per task id over every rep of that
// configuration in --raw. Units: --mem-cap GB per agent (0 = no cap), --bootstrap and
// --penalty seconds. --extra-tax adds a fixed per-task startup cost (seconds) to every test
// task of that kind (not builds, not noops): a what-if for slower startup than measured here,
// e.g. a heavier framework or a slower CI machine (~20s per process vs ~2.7s here). --replicate k
// copies the whole task graph k times (a workspace with k× the projects, same profile), to
// model a load where the agent pool is saturated rather than idle.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { RAW_DIR, RESULTS_DIR } from './lib/config.mjs';
import { findSummaries, groupKey, loadSummary } from './lib/results.mjs';
import { inputFromSummaries, inputFromSummary, simulate } from './lib/sim.mjs';
import { fmtMs, median, round } from './lib/stats.mjs';

const list = (s) => String(s).split(',').map((x) => x.trim()).filter(Boolean);

function loadInput(from, rawDir) {
  let file = null;
  if (existsSync(from)) file = statSync(from).isDirectory() ? join(from, 'summary.json') : from;
  if (file) {
    const s = JSON.parse(readFileSync(file, 'utf8'));
    const tg = readTaskGraph(dirname(file));
    return { key: basename(dirname(file)), source: [file], summary: s, input: inputFromSummary(s, tg) };
  }
  // aggregate key
  const want = from.replace(/^\/+|\/+$/g, '');
  const runs = findSummaries(rawDir).map(loadSummary).filter((s) => groupKey(s) === want && s.taskList?.length);
  if (!runs.length) throw new Error(`no summaries in ${rawDir} for key "${want}" (expected workspace/scenario/runner/pN[/label])`);
  const ok = runs.filter((s) => s.ok);
  const use = ok.length ? ok : runs;
  const tg = readTaskGraph(use[0]._dir);
  return { key: want.replaceAll('/', '_'), source: use.map((s) => s._dir), summary: use[0], input: inputFromSummaries(use, tg) };
}

/** k disjoint copies of the task graph; copy i suffixes every id with `#i`. */
function replicate(input, k) {
  if (!(k > 1)) return input;
  const copies = Array.from({ length: k }, (_, i) => i);
  const tasks = copies.flatMap((i) => input.tasks.map((t) => ({ ...t, id: `${t.id}#${i}` })));
  const deps = Object.fromEntries(
    copies.flatMap((i) => Object.entries(input.deps).map(([id, ds]) => [`${id}#${i}`, ds.map((d) => `${d}#${i}`)])),
  );
  return { ...input, tasks, deps };
}

/** ct | e2e | unit for test tasks (plain, atom or shard), null otherwise (builds). */
function testKind(taskId) {
  const target = (taskId.split(':')[1] ?? '').split('#')[0];
  if (target.startsWith('component-test')) return 'ct';
  if (target.startsWith('e2e')) return 'e2e';
  if (target === 'test' || target.startsWith('test-ci')) return 'unit';
  return null;
}

function readTaskGraph(dir) {
  const f = join(dir, 'task-graph.json');
  if (!existsSync(f)) {
    console.warn(`[sim] ${f} missing: simulating without dependencies`);
    return null;
  }
  return JSON.parse(readFileSync(f, 'utf8'));
}

function table(rows, cols) {
  const w = cols.map((c) => Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length)));
  const line = (vals) => vals.map((v, i) => String(v ?? '').padStart(w[i])).join('  ');
  return [line(cols), line(w.map((n) => '-'.repeat(n))), ...rows.map((r) => line(cols.map((c) => r[c])))].join('\n');
}

function validate(rawDir, outDir) {
  const rows = [];
  for (const f of findSummaries(rawDir)) {
    const s = loadSummary(f);
    if (!s.taskList?.length || !s.timing?.taskPhaseMs) continue;
    const input = inputFromSummary(s, readTaskGraph(s._dir));
    const base = { agents: 1, slots: s.config.parallel, policy: 'greedy', bootstrapMs: 0, penaltyMs: 0, noopMode: 'slot' };
    const obs = simulate(input, { ...base, order: 'observed' });
    const go = simulate(input, { ...base, order: 'graph-order' });
    const lf = simulate(input, { ...base, order: 'longest-first' });
    const actual = s.timing.taskPhaseMs;
    rows.push({
      run: basename(s._dir),
      ok: s.ok,
      actualMs: actual,
      simObservedMs: round(obs.makespanMs),
      errObservedPct: round(((obs.makespanMs - actual) / actual) * 100, 2),
      simGraphOrderMs: round(go.makespanMs),
      errGraphOrderPct: round(((go.makespanMs - actual) / actual) * 100, 2),
      simLongestFirstMs: round(lf.makespanMs),
      errLongestFirstPct: round(((lf.makespanMs - actual) / actual) * 100, 2),
    });
  }
  console.log(table(rows, ['run', 'actualMs', 'simObservedMs', 'errObservedPct', 'errGraphOrderPct', 'errLongestFirstPct']));
  const errs = rows.map((r) => Math.abs(r.errObservedPct));
  console.log(`\n${rows.length} run(s); |error| (observed order) median ${round(median(errs), 2)}%, max ${round(Math.max(0, ...errs), 2)}%`);
  console.log('Negative error = the model is faster than reality: inter-task coordinator gaps (hashing, scheduling) are not in task durations.');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'validate.json'), JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 1));
  return rows;
}

async function main() {
  const { values } = parseArgs({
    options: {
      from: { type: 'string' },
      agents: { type: 'string', default: '1,2,4,8,16' },
      slots: { type: 'string', default: '3' },
      policy: { type: 'string', default: 'batch,greedy' },
      order: { type: 'string', default: 'longest-first' },
      'mem-cap': { type: 'string', default: '0' },
      bootstrap: { type: 'string', default: '60' },
      penalty: { type: 'string', default: '3' },
      noop: { type: 'string', default: 'instant' },
      raw: { type: 'string', default: RAW_DIR },
      out: { type: 'string', default: join(RESULTS_DIR, 'sim') },
      'no-gantt': { type: 'boolean', default: false },
      validate: { type: 'boolean', default: false },
      quiet: { type: 'boolean', default: false },
      'extra-tax': { type: 'string', default: '' },
      replicate: { type: 'string', default: '1' },
    },
  });
  const rawDir = resolve(values.raw);
  const outDir = resolve(values.out);
  if (values.validate) {
    validate(rawDir, outDir);
    return;
  }
  if (!values.from) {
    console.error('missing --from <summary.json | run dir | workspace/scenario/runner/pN> (or --validate)');
    process.exit(2);
  }
  const loaded = loadInput(values.from, rawDir);
  const { key, source, summary } = loaded;
  const input = replicate(loaded.input, Number(values.replicate));
  const extraTax = Object.fromEntries(list(values['extra-tax']).map((kv) => kv.split('=')).map(([k, v]) => [k, Number(v) * 1000]));
  for (const t of input.tasks) {
    const kind = testKind(t.id);
    if (kind && !t.isNoop && extraTax[kind]) t.duration += extraTax[kind];
  }
  const capGb = Number(values['mem-cap']);
  const results = [];
  for (const policy of list(values.policy))
    for (const order of list(values.order))
      for (const slots of list(values.slots).map(Number))
        for (const agents of list(values.agents).map(Number)) {
          const r = simulate(input, {
            agents,
            slots,
            policy,
            order,
            memCapMb: capGb > 0 ? capGb * 1024 : null,
            bootstrapMs: Number(values.bootstrap) * 1000,
            penaltyMs: Number(values.penalty) * 1000,
            noopMode: values.noop,
          });
          results.push(r);
        }
  const measuredParallel = summary.config?.parallel;
  const slotsList = list(values.slots).map(Number);
  if (measuredParallel && slotsList.some((p) => Math.abs(p - measuredParallel) > Math.max(2, measuredParallel * 0.5))) {
    console.warn(`[sim] caveat: durations were measured at --parallel=${measuredParallel}; simulating P=${slotsList.join(',')} assumes they hold at a different contention level.`);
  }
  const rows = results.map((r) => ({
    policy: r.params.policy,
    order: r.params.order,
    K: r.params.agents,
    P: r.params.slots,
    makespan: fmtMs(r.makespanMs),
    'agent-min': round(r.agentMinutes, 1),
    'agent-min(released)': round(r.agentMinutesReleased, 1),
    'slot-util': `${Math.round((r.slotUtilisation ?? 0) * 100)}%`,
    'busy% (min-max)': `${Math.round(Math.min(...r.agents.map((a) => a.busyPct ?? 0)) * 100)}-${Math.round(Math.max(...r.agents.map((a) => a.busyPct ?? 0)) * 100)}`,
    penalties: r.penalties,
    'peakMem/agent': `${(Math.max(...r.agents.map((a) => a.peakMemMb)) / 1024).toFixed(1)}GB`,
  }));
  if (!values.quiet) {
    console.log(`${key}: ${input.tasks.length} tasks (${input.tasks.filter((t) => t.isNoop).length} noop), sum ${fmtMs(input.tasks.reduce((s, t) => s + t.duration, 0))}${input.reps ? `, median of ${input.reps} rep(s)` : ''}`);
    console.log(`bootstrap ${values.bootstrap}s, cross-agent penalty ${values.penalty}s, mem cap ${capGb > 0 ? `${capGb}GB` : 'none'}, noop ${values.noop}\n`);
    console.log(table(rows, Object.keys(rows[0])));
    for (const w of new Set(results.flatMap((r) => r.warnings))) console.warn(`[sim] ${w}`);
  }
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `${key}${values['extra-tax'] ? `_tax-${values['extra-tax'].replace(/[=,]/g, '-')}` : ''}${Number(values.replicate) > 1 ? `_x${values.replicate}` : ''}.json`);
  writeFileSync(
    file,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        key,
        source,
        measuredParallel,
        params: { bootstrapS: Number(values.bootstrap), penaltyS: Number(values.penalty), memCapGb: capGb || null, noop: values.noop },
        results: results.map((r) => (values['no-gantt'] ? { ...r, gantt: undefined } : r)),
      },
      null,
      0,
    ),
  );
  if (!values.quiet) console.log(`\n-> ${file}`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(2);
});
