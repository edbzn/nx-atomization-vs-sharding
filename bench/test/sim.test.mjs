// Hand-computed scheduling cases for the DTE simulator.  node --test bench/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulate } from '../lib/sim.mjs';

const T = (id, duration, extra = {}) => ({ id, duration, ...extra });
const ends = (r) => Object.fromEntries(r.gantt.map((g) => [g.id, g.end]));
const where = (r) => Object.fromEntries(r.gantt.map((g) => [g.id, g.agent]));

test('single slot runs everything serially', () => {
  const r = simulate({ tasks: [T('a', 10), T('b', 20), T('c', 30)], deps: {} }, { agents: 1, slots: 1 });
  assert.equal(r.makespanMs, 60);
  assert.equal(r.slotUtilisation, 1);
});

test('greedy longest-first (LPT) on 2 slots: 5,4,3,3,3 -> makespan 10', () => {
  // t0 s0=a(5) s1=b(4); t4 s1 takes c(3)->7; t5 s0 takes d(3)->8; t7 s1 takes e(3)->10
  const tasks = [T('a', 5), T('b', 4), T('c', 3), T('d', 3), T('e', 3)];
  const r = simulate({ tasks, deps: {} }, { agents: 1, slots: 2, order: 'longest-first' });
  assert.equal(r.makespanMs, 10);
  assert.deepEqual(ends(r), { a: 5, b: 4, c: 7, d: 8, e: 10 });
});

test('greedy vs batch: batch waits for the whole batch before pulling', () => {
  const tasks = [T('long', 10), T('s1', 2), T('s2', 2), T('s3', 2)];
  const g = simulate({ tasks, deps: {} }, { agents: 1, slots: 2, policy: 'greedy', order: 'longest-first' });
  // greedy: long 0-10; s1 0-2, s2 2-4, s3 4-6 -> 10
  assert.equal(g.makespanMs, 10);
  const b = simulate({ tasks, deps: {} }, { agents: 1, slots: 2, policy: 'batch', order: 'longest-first' });
  // batch1 {long, s1} 0-10; batch2 {s2, s3} 10-12 -> 12
  assert.equal(b.makespanMs, 12);
  assert.deepEqual(ends(b), { long: 10, s1: 2, s2: 12, s3: 12 });
});

test('dependencies are respected and graph-order follows topological order', () => {
  const tasks = [T('test', 5), T('build', 3), T('lint', 1)];
  const deps = { test: ['build'] };
  const r = simulate({ tasks, deps }, { agents: 1, slots: 1, order: 'graph-order' });
  // topo order (stable on task order): build, lint, test -> build 0-3, lint 3-4, test 4-9
  assert.deepEqual(ends(r), { build: 3, lint: 4, test: 9 });
  const lf = simulate({ tasks, deps }, { agents: 1, slots: 1, order: 'longest-first' });
  // only build & lint ready at 0: build(3) first, then test(5) is ready and longer than lint
  assert.deepEqual(ends(lf), { build: 3, test: 8, lint: 9 });
});

test('critical-path order prefers the long chain over long leaves', () => {
  // bottom levels: leaf1 6, leaf2 6, b 2+6=8, t 6
  const tasks = [T('leaf1', 6), T('leaf2', 6), T('b', 2), T('t', 6)];
  const deps = { t: ['b'] };
  const cp = simulate({ tasks, deps }, { agents: 1, slots: 2, order: 'critical-path' });
  // b 0-2 + leaf1 0-6; t=2: leaf2 (tie with t, earlier index) 2-8; t=6: t 6-12
  assert.deepEqual(ends(cp), { b: 2, leaf1: 6, leaf2: 8, t: 12 });
  const lf = simulate({ tasks, deps }, { agents: 1, slots: 2, order: 'longest-first' });
  // leaf1 + leaf2 0-6, b 6-8, t 8-14
  assert.equal(lf.makespanMs, 14);
});

test('bootstrap delays the start, cost counts it', () => {
  const r = simulate({ tasks: [T('a', 10), T('b', 10)], deps: {} }, { agents: 2, slots: 1, bootstrapMs: 60 });
  assert.equal(r.makespanMs, 70);
  assert.equal(r.agentMinutes, (2 * 70) / 60000);
  assert.equal(r.slotUtilisation, 1);
});

test('cross-agent dependency penalty', () => {
  // build on agent 0; t1 and t2 depend on build. With 2 agents x 1 slot, greedy:
  // t=0 build->a0 (least loaded tie -> a0). t=4 t1->a0? both agents have 1 free slot -> a0 (first max), t2 -> a1 pays penalty.
  const tasks = [T('build', 4), T('t1', 5), T('t2', 5)];
  const deps = { t1: ['build'], t2: ['build'] };
  const r = simulate({ tasks, deps }, { agents: 2, slots: 1, penaltyMs: 3 });
  assert.deepEqual(ends(r), { build: 4, t1: 9, t2: 12 });
  assert.equal(r.penalties, 1);
  assert.deepEqual(where(r), { build: 0, t1: 0, t2: 1 });
});

test('memory cap: tasks wait until they fit', () => {
  const tasks = [T('a', 10, { peakPssMb: 600 }), T('b', 10, { peakPssMb: 600 }), T('c', 1, { peakPssMb: 300 })];
  const r = simulate({ tasks, deps: {} }, { agents: 1, slots: 3, memCapMb: 1000, order: 'longest-first' });
  // a(600) starts; b(600) doesn't fit (1200>1000) -> backfill c(300) 0-1; b starts at 10 -> 20
  assert.deepEqual(ends(r), { a: 10, c: 1, b: 20 });
  assert.equal(r.agents[0].peakMemMb, 900);
});

test('oversized task runs alone on an empty agent instead of deadlocking', () => {
  const tasks = [T('huge', 5, { peakPssMb: 5000 }), T('x', 5, { peakPssMb: 100 })];
  const r = simulate({ tasks, deps: {} }, { agents: 1, slots: 2, memCapMb: 1000, order: 'longest-first' });
  assert.equal(r.makespanMs, 10);
  assert.ok(r.warnings.length === 1);
});

test('noop parents complete instantly and carry their deps\' agents', () => {
  const tasks = [T('atom1', 5), T('atom2', 5), T('parent', 0, { isNoop: true }), T('after', 1)];
  const deps = { parent: ['atom1', 'atom2'], after: ['parent'] };
  const r = simulate({ tasks, deps }, { agents: 2, slots: 1, penaltyMs: 10 });
  // atoms on a0 and a1 0-5; parent instant at 5; after placed on a0 pays penalty (atom2 ran on a1): 5+10+1
  assert.equal(r.makespanMs, 16);
  assert.equal(r.gantt.find((g) => g.id === 'parent'), undefined);
  const slot = simulate({ tasks, deps }, { agents: 1, slots: 1, noopMode: 'slot' });
  assert.ok(slot.gantt.find((g) => g.id === 'parent'));
  assert.equal(slot.makespanMs, 11);
});

test('observed order with K=1, P=N reproduces a measured schedule', () => {
  // A measured 2-slot run: a 0-4 (s0), b 0-2 (s1), c 2-5 (s1, ready at 0), d 4-6 (s0, dep a)
  const tasks = [T('a', 4, { observedStart: 0 }), T('b', 2, { observedStart: 0 }), T('c', 3, { observedStart: 2 }), T('d', 2, { observedStart: 4 })];
  const r = simulate({ tasks, deps: { d: ['a'] } }, { agents: 1, slots: 2, order: 'observed' });
  assert.equal(r.makespanMs, 6);
  assert.deepEqual(Object.fromEntries(r.gantt.map((g) => [g.id, g.start])), { a: 0, b: 0, c: 2, d: 4 });
});
