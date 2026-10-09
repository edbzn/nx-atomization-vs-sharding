#!/usr/bin/env node
// A stand-in for `nx affected` used via BENCH_NX_CMD="node bench/test/fake/fake-nx.mjs".
// Reads the fake workspace's task list from $FAKE_NX_SPEC (default <cwd>/fake-nx-spec.json) and mimics Nx 23.3.0's outputs:
//  - `--graph=<file>.json`: writes {graph, tasks: TaskGraph, taskPlans} (command-line/graph/graph.js
//    createJsonOutput) and exits without running anything;
//  - otherwise: schedules tasks greedily on --parallel slots (lowest free slot = Nx groupId),
//    spawns each through `sh -c` with NX_TASK_TARGET_PROJECT/TARGET like Nx, writes
//    $NX_PROFILE (join(cwd, NX_PROFILE), TaskProfilingLifeCycle format) and prints the
//    end-of-run performance report in formatReport's layout.
// Spec: {graphMs, tasks: [{id, project, target, executor?, deps?, ms, mb, cpu, children?, orphan?, fail?}]}
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TASK = join(dirname(fileURLToPath(import.meta.url)), 'fake-task.mjs');
const spec = JSON.parse(readFileSync(process.env.FAKE_NX_SPEC || join(process.cwd(), 'fake-nx-spec.json'), 'utf8'));
const args = process.argv.slice(2);
const arg = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const tasks = new Map(spec.tasks.map((t) => [t.id, { deps: [], executor: 'nx:run-commands', ...t }]));
const taskGraph = {
  roots: [...tasks.values()].filter((t) => !t.deps.length).map((t) => t.id),
  tasks: Object.fromEntries(
    [...tasks.values()].map((t) => [
      t.id,
      { id: t.id, target: { project: t.project, target: t.target }, projectRoot: `libs/${t.project}`, overrides: { __overrides_unparsed__: [] }, outputs: [], cache: true, parallelism: true, continuous: false },
    ]),
  ),
  dependencies: Object.fromEntries([...tasks.values()].map((t) => [t.id, t.deps])),
  continuousDependencies: Object.fromEntries([...tasks.values()].map((t) => [t.id, []])),
};

const graphFile = arg('graph');
if (graphFile) {
  const nodes = {};
  for (const t of tasks.values()) {
    nodes[t.project] ??= { name: t.project, type: 'lib', data: { root: `libs/${t.project}`, targets: {} } };
    nodes[t.project].data.targets[t.target] = { executor: t.executor, options: {}, configurations: {} };
  }
  const file = isAbsolute(graphFile) ? graphFile : join(process.cwd(), graphFile);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify({ graph: { nodes, dependencies: {} }, tasks: taskGraph, taskPlans: {} }, null, 2));
  console.log(`\n NX   JSON output created in ${dirname(file)}\n\n${file}\n`);
  process.exit(0);
}

const parallel = Number(arg('parallel') ?? 3);
await sleep(spec.graphMs ?? 300); // "project graph"

const profile = [];
const groups = new Set();
const slots = Array(parallel).fill(null);
const done = new Map(); // id -> status
const started = new Set();
const timings = new Map();
let running = 0;

function ready() {
  return [...tasks.values()].filter((t) => !started.has(t.id) && t.deps.every((d) => done.get(d) === 'success'));
}
function blocked() {
  return [...tasks.values()].filter((t) => !started.has(t.id) && t.deps.some((d) => done.has(d) && done.get(d) !== 'success'));
}

await new Promise((resolveAll) => {
  const pump = () => {
    for (const t of blocked()) {
      started.add(t.id);
      done.set(t.id, 'skipped');
    }
    for (const t of ready()) {
      const slot = slots.indexOf(null);
      if (slot < 0) break;
      started.add(t.id);
      slots[slot] = t.id;
      running++;
      if (!groups.has(slot)) {
        groups.add(slot);
        profile.push({ name: 'thread_name', ph: 'M', pid: process.pid, tid: slot, ts: 0, args: { name: `Group #${slot + 1}` } });
      }
      const start = Date.now();
      const finish = (status) => {
        const end = Date.now();
        timings.set(t.id, { start, end });
        profile.push({
          name: t.id,
          cat: Object.values({ project: t.project, target: t.target, configuration: undefined }).join(','),
          ph: 'X',
          ts: start * 1000,
          dur: (end - start) * 1000,
          pid: process.pid,
          tid: slot,
          args: { target: { project: t.project, target: t.target }, status },
        });
        done.set(t.id, status);
        slots[slot] = null;
        running--;
        pump();
      };
      if (t.executor === 'nx:noop') {
        setImmediate(() => finish('success'));
        continue;
      }
      console.log(`\n> nx run ${t.id}\n`);
      const cmd = `${process.execPath} ${TASK} ${t.ms ?? 500} ${t.mb ?? 20} ${t.cpu ?? 1} ${t.children ?? 0} ${t.orphan ? 1 : 0} ${t.fail ? 1 : 0}`;
      const child = spawn('/bin/sh', ['-c', cmd], {
        stdio: ['ignore', 'inherit', 'inherit'],
        env: { ...process.env, NX_TASK_TARGET_PROJECT: t.project, NX_TASK_TARGET_TARGET: t.target, NX_TASK_HASH: 'fake' },
      });
      child.on('exit', (code) => finish(code === 0 ? 'success' : 'failure'));
    }
    if (running === 0 && started.size === tasks.size) resolveAll();
  };
  pump();
});

if (process.env.NX_PROFILE) {
  const file = join(process.cwd(), process.env.NX_PROFILE);
  writeFileSync(file, JSON.stringify(profile, null, 2));
  console.log(`Performance Profile: ${file}`);
}

// formatReport-style performance report (critical path = longest dependency chain of measured durations)
const fmt = (ms) => (ms < 1 ? '<1ms' : ms < 1000 ? `${Math.round(ms)}ms` : ms < 60000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`);
const fin = new Map();
const finish = (id) => {
  if (fin.has(id)) return fin.get(id);
  const tm = timings.get(id);
  if (!tm) return 0;
  const v = tm.end - tm.start + Math.max(0, ...tasks.get(id).deps.map(finish));
  fin.set(id, v);
  return v;
};
const ids = [...timings.keys()];
const cp = Math.max(0, ...ids.map(finish));
const runStart = Math.min(...ids.map((i) => timings.get(i).start));
const runEnd = Math.max(...ids.map((i) => timings.get(i).end));
const run = runEnd - runStart;
const rec = Math.max(0, run - cp);
let cpCount = 0;
for (let id = ids.find((i) => fin.get(i) === cp); id; ) {
  cpCount++;
  id = tasks.get(id).deps.filter((d) => timings.has(d)).sort((a, b) => fin.get(b) - fin.get(a))[0];
}
const failed = [...done].filter(([, s]) => s === 'failure');
console.log(`\n NX   ${failed.length ? `Ran ${tasks.size} tasks, ${failed.length} failed` : `Successfully ran ${tasks.size} tasks`}\n`);
console.log(
  [
    `  ${'Run duration:'.padEnd(17)}  ${fmt(run)}`,
    `  ${'Cache:'.padEnd(17)}  Skipped (--skip-nx-cache)`,
    `  ${'Critical path:'.padEnd(17)}  ${fmt(cp)} (${cpCount} ${cpCount === 1 ? 'task' : 'tasks'})`,
    `  ${'Recoverable time:'.padEnd(17)}  ${rec > 0 ? `${fmt(rec)} (${Math.round((rec / run) * 100)}% of the run)` : fmt(rec)}`,
  ].join('\n'),
);
process.exit(failed.length ? 1 : 0);
