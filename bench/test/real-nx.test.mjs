// Optional integration test against a REAL Nx install (no browsers: tasks are `node -e`).
// Validates the hook launcher, `affected --graph` export, NX_PROFILE format and env-based
// task attribution. Skipped unless BENCH_TEST_NX_PKG points at an installed nx package dir:
//   BENCH_TEST_NX_PKG=/path/to/node_modules/nx node --test bench/test/real-nx.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findSummaries, loadSummary } from '../lib/results.mjs';

const NX_PKG = process.env.BENCH_TEST_NX_PKG;
const BENCH = dirname(dirname(fileURLToPath(import.meta.url)));

test('real nx: hook, graph export, profile, attribution', { skip: !NX_PKG && 'set BENCH_TEST_NX_PKG to run' }, () => {
  const root = mkdtempSync(join(tmpdir(), 'bench-realnx-'));
  const ws = join(root, 'workspaces', 'atomized');
  mkdirSync(join(ws, 'node_modules'), { recursive: true });
  symlinkSync(NX_PKG, join(ws, 'node_modules', 'nx'));
  writeFileSync(join(ws, 'package.json'), '{"name":"realnx","private":true}\n');
  writeFileSync(join(ws, 'nx.json'), JSON.stringify({ neverConnectToCloud: true, targetDefaults: { 'test-ci--a': { dependsOn: ['^build'] }, 'test-ci--b': { dependsOn: ['^build'] } } }));
  const burn = (mb, ms) => `node -e "const a=Buffer.alloc(${mb}e6,1);let x=0;const e=Date.now()+${ms};while(Date.now()<e)x++"`;
  const project = (name, deps) => {
    mkdirSync(join(ws, 'libs', name), { recursive: true });
    writeFileSync(join(ws, 'libs', name, 'index.ts'), `export const ${name} = 1;\n`);
    writeFileSync(
      join(ws, 'libs', name, 'project.json'),
      JSON.stringify({
        name,
        root: `libs/${name}`,
        implicitDependencies: deps,
        targets: {
          build: { executor: 'nx:run-commands', options: { command: burn(10, 200) } },
          'test-ci--a': { executor: 'nx:run-commands', options: { command: burn(80, 900) } },
          'test-ci--b': { executor: 'nx:run-commands', options: { command: burn(80, 600) } },
          'test-ci': { executor: 'nx:noop', dependsOn: ['test-ci--a', 'test-ci--b'] },
        },
      }),
    );
  };
  project('core', []);
  project('feat', ['core']);
  const git = (...a) => execFileSync('git', ['-c', 'commit.gpgsign=false', '-c', 'tag.gpgsign=false', '-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: ws, stdio: 'pipe' });
  git('init', '-q');
  git('add', '-A');
  git('commit', '-qm', 'base');
  git('tag', 'base');
  writeFileSync(join(ws, 'libs', 'core', 'index.ts'), 'export const core = 2;\n');
  git('commit', '-qam', 'full');
  git('tag', 'full');

  const raw = join(root, 'raw');
  const r = spawnSync(process.execPath, [join(BENCH, 'run.mjs'), '--workspace', 'atomized', '--scenario', 'full', '--runner', 'unit', '--parallel', '3', '--out', raw], {
    encoding: 'utf8',
    env: { ...process.env, BENCH_WORKSPACES_DIR: join(root, 'workspaces'), BENCH_NX_CMD: '' },
    timeout: 120_000,
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const [s] = findSummaries(raw).map(loadSummary);
  assert.equal(s.ok, true);
  assert.match(s.config.nxVersion, /^\d+\.\d+\.\d+/);
  assert.equal(s.tasks.source, 'NX_PROFILE');
  // core + feat: 2 builds (^build of feat = core:build only; core has no deps) ... count from graph
  assert.equal(s.tasks.count, s.tasks.graphCount);
  assert.equal(s.tasks.noopCount, 2); // core:test-ci, feat:test-ci (nx:noop from the project graph)
  assert.equal(s.nxPerformance.source, 'hook');
  assert.ok(s.nxPerformance.criticalPathDuration > 0);
  assert.ok(Array.isArray(s.nxPerformance.criticalPath) && s.nxPerformance.criticalPath.length >= 1);
  assert.ok(s.nxPerformance.recoverableByParallel != null && s.nxPerformance.coordinatorOverhead != null);
  assert.ok(s.timing.graphMs > 0 && s.timing.nxBootMs >= 0);
  for (const t of s.taskList.filter((x) => x.id.includes('test-ci--'))) {
    assert.ok(t.procs >= 1, `${t.id} has attributed processes`);
    assert.ok(t.peakPssMb > 60, `${t.id} peak PSS ${t.peakPssMb}`);
  }
  assert.ok(existsSync(join(s._dir, 'nx-perf.json')));
  const tg = JSON.parse(readFileSync(join(s._dir, 'task-graph.json'), 'utf8'));
  assert.ok(tg.tasks.dependencies['feat:test-ci'].includes('feat:test-ci--a'));
  assert.equal(tg.executors['feat:test-ci'], 'nx:noop');
  if (!process.env.BENCH_TEST_KEEP) rmSync(root, { recursive: true, force: true });
});
