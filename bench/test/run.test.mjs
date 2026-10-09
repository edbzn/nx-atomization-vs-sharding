// End-to-end test of run.mjs -> aggregate.mjs -> simulate.mjs on fake workspaces driven by
// test/fake/fake-nx.mjs (no real Nx, no browsers).  node --test bench/test/
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findPidsWithEnv } from '../lib/proc.mjs';
import { findSummaries, loadSummary } from '../lib/results.mjs';

const BENCH = dirname(dirname(fileURLToPath(import.meta.url)));
const FAKE_NX = join(BENCH, 'test', 'fake', 'fake-nx.mjs');
const root = mkdtempSync(join(tmpdir(), 'bench-test-'));
const wsDir = join(root, 'workspaces');
const raw = join(root, 'raw');

const noop = (project) => ({ id: `${project}:test-ci`, project, target: 'test-ci', executor: 'nx:noop' });
const SPECS = {
  baseline: {
    graphMs: 200,
    tasks: [
      { id: 'lib1:test', project: 'lib1', target: 'test', ms: 2500, mb: 60, cpu: 1 },
      { id: 'lib2:test', project: 'lib2', target: 'test', ms: 1500, mb: 60, cpu: 1 },
    ],
  },
  atomized: {
    graphMs: 200,
    tasks: [
      { id: 'lib1:test-ci--src/a.spec.ts', project: 'lib1', target: 'test-ci--src/a.spec.ts', ms: 1200, mb: 200, cpu: 1, children: 2 },
      { id: 'lib1:test-ci--src/b.spec.ts', project: 'lib1', target: 'test-ci--src/b.spec.ts', ms: 1200, mb: 40, cpu: 0.5, orphan: true },
      { id: 'lib1:test-ci--src/c.spec.ts', project: 'lib1', target: 'test-ci--src/c.spec.ts', ms: 900, mb: 40, cpu: 1 },
      { id: 'lib2:test-ci--src/a.spec.ts', project: 'lib2', target: 'test-ci--src/a.spec.ts', ms: 1000, mb: 40, cpu: 1 },
      { id: 'lib2:test-ci--src/b.spec.ts', project: 'lib2', target: 'test-ci--src/b.spec.ts', ms: 1000, mb: 40, cpu: 1 },
      { ...noop('lib1'), deps: ['lib1:test-ci--src/a.spec.ts', 'lib1:test-ci--src/b.spec.ts', 'lib1:test-ci--src/c.spec.ts'] },
      { ...noop('lib2'), deps: ['lib2:test-ci--src/a.spec.ts', 'lib2:test-ci--src/b.spec.ts'] },
    ],
  },
};

const git = (cwd, ...args) => execFileSync('git', ['-c', 'commit.gpgsign=false', '-c', 'tag.gpgsign=false', '-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd, stdio: 'pipe' });

function makeWorkspace(name) {
  const ws = join(wsDir, name);
  mkdirSync(join(ws, 'libs', 'lib1'), { recursive: true });
  writeFileSync(join(ws, 'nx.json'), '{}\n');
  writeFileSync(join(ws, 'fake-nx-spec.json'), JSON.stringify(SPECS[name], null, 1));
  writeFileSync(join(ws, 'libs', 'lib1', 'index.ts'), 'export const x = 1;\n');
  git(ws, 'init', '-q');
  git(ws, 'add', '-A');
  git(ws, 'commit', '-qm', 'base');
  git(ws, 'tag', 'base');
  writeFileSync(join(ws, 'libs', 'lib1', 'index.ts'), 'export const x = 2;\n');
  git(ws, 'commit', '-qam', 'full');
  git(ws, 'tag', 'full');
  // junk the cleaner must remove
  for (const p of ['node_modules/.vite/ct-1', 'libs/lib1/node_modules/.vitest', 'dist/libs', 'libs/lib1/test-results/x', 'apps/app-e2e/cypress/screenshots', '.nx/workspace-data', '.nx/cache']) {
    mkdirSync(join(ws, p), { recursive: true });
    writeFileSync(join(ws, p, 'f'), 'x');
  }
  mkdirSync(join(ws, 'node_modules', 'keep-me'), { recursive: true });
  return ws;
}

function run(script, args, env = {}) {
  const r = spawnSync(process.execPath, [join(BENCH, script), ...args], {
    encoding: 'utf8',
    env: { ...process.env, BENCH_NX_CMD: `${process.execPath} ${FAKE_NX}`, BENCH_WORKSPACES_DIR: wsDir, ...env },
    timeout: 120_000,
  });
  if (process.env.BENCH_TEST_VERBOSE) console.log(r.stdout, r.stderr);
  return r;
}

after(() => {
  if (!process.env.BENCH_TEST_KEEP) rmSync(root, { recursive: true, force: true });
});

let atomizedRuns;
before(() => {
  makeWorkspace('baseline');
  makeWorkspace('atomized');
  const b = run('run.mjs', ['--workspace', 'baseline', '--scenario', 'full', '--runner', 'unit', '--parallel', '3', '--out', raw]);
  assert.equal(b.status, 0, b.stdout + b.stderr);
  makeWorkspace.cleanedCheck = existsSync(join(wsDir, 'baseline', 'node_modules', '.vite'));
  const a = run('run.mjs', ['--workspace', 'atomized', '--scenario', 'full', '--runner', 'unit', '--parallel', '3', '--reps', '2', '--out', raw]);
  assert.equal(a.status, 0, a.stdout + a.stderr);
  atomizedRuns = findSummaries(raw).map(loadSummary).filter((s) => s.config.workspace === 'atomized');
});

test('workspace is cleaned before the run', () => {
  const ws = join(wsDir, 'atomized');
  for (const p of ['node_modules/.vite', 'libs/lib1/node_modules/.vitest', 'dist', 'libs/lib1/test-results', 'apps/app-e2e/cypress/screenshots', '.nx/workspace-data/f', '.nx/cache']) {
    assert.ok(!existsSync(join(ws, p)), `${p} should be removed`);
  }
  assert.ok(existsSync(join(ws, 'node_modules', 'keep-me')));
});

test('artifacts are written', () => {
  assert.equal(atomizedRuns.length, 2);
  for (const s of atomizedRuns) for (const f of ['summary.json', 'profile.json', 'task-graph.json', 'samples.json.gz', 'nx.log']) assert.ok(existsSync(join(s._dir, f)), f);
});

test('summary: tasks, slots, timing', () => {
  for (const s of atomizedRuns) {
    assert.equal(s.ok, true);
    assert.deepEqual(s.config.targets, ['test-ci']);
    assert.equal(s.tasks.count, 7);
    assert.equal(s.tasks.realCount, 5);
    assert.equal(s.tasks.noopCount, 2);
    assert.equal(s.tasks.atomCount, 5);
    assert.equal(s.tasks.source, 'NX_PROFILE');
    // a slot never runs two tasks at once
    const bySlot = new Map();
    for (const t of s.taskList) {
      assert.ok(t.slot >= 0 && t.slot < 3);
      if (!bySlot.has(t.slot)) bySlot.set(t.slot, []);
      bySlot.get(t.slot).push(t);
    }
    for (const ts of bySlot.values()) {
      ts.sort((a, b) => a.start - b.start);
      for (let i = 1; i < ts.length; i++) assert.ok(ts[i].start >= ts[i - 1].end - 1, 'slot overlap');
    }
    assert.ok(s.timing.preTaskMs >= 200, 'graph phase (fake graphMs=200) is before the first task');
    assert.ok(s.timing.taskPhaseMs > 2000 && s.timing.taskPhaseMs < 6000, `taskPhaseMs ${s.timing.taskPhaseMs}`);
    assert.ok(s.slotUtilisation > 0.4 && s.slotUtilisation <= 1.01, `util ${s.slotUtilisation}`);
    assert.equal(s.nxPerformance.source, 'log');
    assert.ok(s.nxPerformance.runDuration > 2000);
    assert.ok(s.nxPerformance.criticalPathDuration > 800);
  }
});

test('sampler attributes memory and CPU to the right task', () => {
  for (const s of atomizedRuns) {
    const t = (suffix) => s.taskList.find((x) => x.id.endsWith(suffix));
    const big = t('lib1:test-ci--src/a.spec.ts'); // 200MB + 2 children x 100MB, 3 busy processes x 1.2s
    const half = t('lib1:test-ci--src/b.spec.ts'); // 40MB, 50% CPU x 1.2s
    const small = t('lib2:test-ci--src/a.spec.ts'); // 40MB, 1 core x 1s
    assert.ok(big.peakPssMb > 330 && big.peakPssMb < 600, `big PSS ${big.peakPssMb}`);
    assert.ok(small.peakPssMb > 40 && small.peakPssMb < 150, `small PSS ${small.peakPssMb}`);
    assert.ok(big.procs >= 4, `big procs ${big.procs}`); // sh + node + 2 children
    assert.ok(big.cpuSeconds > 2.4 && big.cpuSeconds < 4.2, `big cpu ${big.cpuSeconds}`);
    assert.ok(half.cpuSeconds > 0.3 && half.cpuSeconds < 0.9, `half cpu ${half.cpuSeconds}`);
    assert.ok(small.cpuSeconds > 0.6 && small.cpuSeconds < 1.3, `small cpu ${small.cpuSeconds}`);
    assert.ok(s.resources.peakPssMb > 400, `total PSS ${s.resources.peakPssMb}`);
    assert.ok(s.resources.peakCores > 2, `peak cores ${s.resources.peakCores}`);
    assert.ok(s.resources.nxCoordinator.cpuSeconds >= 0);
    assert.ok(s.sampler.cores < 0.25, `sampler overhead ${s.sampler.cores}`);
  }
});

test('leftover (double-forked) processes are found by marker and killed', () => {
  for (const s of atomizedRuns) {
    assert.ok(s.leftovers.length >= 1, 'orphan sleeper should be reported');
    assert.equal(findPidsWithEnv('BENCH_RUN_ID', s.config.runId).length, 0, 'nothing with this run marker survives');
    // whether the sleeper was first seen as a descendant or (after reparenting) via the
    // marker depends on tick timing; the deterministic marker test is in sampler.test.mjs
    assert.ok(s.taskList.find((t) => t.id.endsWith('b.spec.ts')).procs >= 3, 'orphan chain attributed to its task');
  }
});

test('failed tasks are recorded and flagged', () => {
  const spec = structuredClone(SPECS.atomized);
  spec.tasks[3].fail = true; // lib2 a.spec fails -> lib2:test-ci skipped
  const f = join(root, 'fail-spec.json');
  writeFileSync(f, JSON.stringify(spec));
  const r = run('run.mjs', ['--workspace', 'atomized', '--scenario', 'full', '--runner', 'unit', '--parallel', '3', '--out', raw, '--label', 'fail'], { FAKE_NX_SPEC: f });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FLAG .*failedTasks/);
  const s = findSummaries(raw).map(loadSummary).find((x) => x.config.label === 'fail');
  assert.equal(s.ok, false);
  assert.deepEqual(s.tasks.failed, ['lib2:test-ci--src/a.spec.ts']);
  assert.deepEqual(s.tasks.notRun, ['lib2:test-ci']);
  assert.equal(s.exitCode, 1);
});

test('matrix: interleaved plan, resumable', () => {
  const mf = join(root, 'matrix.json');
  writeFileSync(mf, JSON.stringify({ reps: 2, workspaces: ['baseline', 'atomized'], configs: [{ scenario: 'full', runner: 'unit', parallel: 3 }], cooldownSec: 0, minMemAvailableGb: 1, out: raw }));
  const dry = run('matrix.mjs', [mf, '--dry-run']);
  assert.match(dry.stdout, /4 planned run\(s\), 3 already done, 1 to run/);
  assert.match(dry.stdout, /r2 baseline full unit p3/);
  const r = run('matrix.mjs', [mf]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /done: 1 run\(s\)/);
  const again = run('matrix.mjs', [mf, '--dry-run']);
  assert.match(again.stdout, /0 to run/);
});

test('aggregate: groups, startup tax, charts', () => {
  const out = join(root, 'results');
  const r = run('aggregate.mjs', ['--raw', raw, '--out', out]);
  assert.equal(r.status, 0, r.stderr);
  const agg = JSON.parse(readFileSync(join(out, 'aggregate.json'), 'utf8'));
  const a = agg.groups.find((g) => g.key === 'atomized/full/unit/p3');
  assert.equal(a.runs, 2);
  assert.equal(a.taskCount, 5);
  assert.ok(a.wallMs.median > 0);
  const tax = agg.startupTax.find((t) => t.variant === 'atomized' && t.kind === 'unit' && !t.label);
  assert.equal(tax.projects, 2);
  // lib1: (1200+1200+900 - 2500)/2 = 400; lib2: (1000+1000-1500)/1 = 500 (+ process start noise)
  assert.ok(tax.medianTaxMs > 250 && tax.medianTaxMs < 900, `tax ${tax.medianTaxMs}`);
  for (const c of ['wall-time', 'task-durations', 'timelines', 'gantt', 'startup-tax', 'memory']) assert.ok(existsSync(join(out, 'charts', `${c}.json`)), c);
  const tl = JSON.parse(readFileSync(join(out, 'charts', 'timelines.json'), 'utf8')).find((x) => x.key === 'atomized/full/unit/p3');
  assert.ok(tl.rows.length > 5);
  assert.match(readFileSync(join(out, 'aggregate.md'), 'utf8'), /\| atomized \| full \| unit \| 3 \|/);
});

test('simulate --validate: ~0 error on fake runs', () => {
  const out = join(root, 'sim');
  const r = run('simulate.mjs', ['--validate', '--raw', raw, '--out', out]);
  assert.equal(r.status, 0, r.stderr);
  const v = JSON.parse(readFileSync(join(out, 'validate.json'), 'utf8'));
  assert.ok(v.rows.length >= 4);
  for (const row of v.rows) assert.ok(Math.abs(row.errObservedPct) < 3, `${row.run}: ${row.errObservedPct}%`);
});

test('simulate sweeps agents from an aggregate key', () => {
  const out = join(root, 'sim');
  const r = run('simulate.mjs', ['--from', 'atomized/full/unit/p3', '--raw', raw, '--out', out, '--agents', '1,2', '--slots', '2', '--policy', 'batch,greedy', '--bootstrap', '1', '--penalty', '0.5', '--mem-cap', '0.25']);
  assert.equal(r.status, 0, r.stderr);
  const res = JSON.parse(readFileSync(join(out, 'atomized_full_unit_p3.json'), 'utf8'));
  assert.equal(res.results.length, 4);
  for (const x of res.results) assert.ok(x.makespanMs > 1000 && x.gantt.length === 5);
  assert.ok(r.stdout.includes('agent-min'));
});
