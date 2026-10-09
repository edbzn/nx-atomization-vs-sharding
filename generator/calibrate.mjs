#!/usr/bin/env node
// Measures per-spec runtimes in a generated workspace and fits the generator's linear cost
// model (generator/calibration.json) with non-negative least squares.
//
// Usage: node generator/calibrate.mjs [--ws=workspaces/baseline] [--runner=cypress,vitest,playwright]
//                                     [--projects=a,b] [--concurrency=3] [--write] [--out=file.json]
//
// Per-spec runtime definition (what the targets refer to):
//   cypress    : stats.duration of the spec in `cypress run --component` (warm process)
//   vitest     : sum of test durations of the file (what Vitest prints next to the file)
//   playwright : sum of test durations of the file (workers: 1)

import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { estimate } from './lib/cost.mjs';

const GEN_DIR = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(GEN_DIR, '..');
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);
const WS = resolve(REPO, args.ws ?? 'workspaces/baseline');
const runners = (args.runner ?? 'cypress,vitest,playwright').split(',');
const onlyProjects = args.projects ? new Set(args.projects.split(',')) : null;
const concurrency = Number(args.concurrency ?? 3);
const manifest = JSON.parse(readFileSync(join(REPO, 'workspaces', 'manifest.json'), 'utf8'));
const calibrationPath = join(GEN_DIR, 'calibration.json');
const model = JSON.parse(readFileSync(calibrationPath, 'utf8'));
const env = { ...process.env, CI: 'true', NX_DAEMON: 'false', NX_NO_CLOUD: 'true', FORCE_COLOR: '0' };

function sh(cmd, argv, cwd, extraEnv = {}) {
  return new Promise((res) => {
    const child = spawn(cmd, argv, { cwd, env: { ...env, ...extraEnv }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.on('close', (code) => res({ code, out }));
  });
}

async function measureCypress(project) {
  const dir = join(WS, project.root);
  const script = `
    const cypress = require(${JSON.stringify(join(WS, 'node_modules', 'cypress'))});
    cypress.run({ project: ${JSON.stringify(dir)}, testingType: 'component', quiet: true }).then((r) => {
      const runs = (r.runs || []).map((x) => ({ spec: x.spec.relative, ms: x.stats.duration, failures: x.stats.failures, tests: x.stats.tests }));
      process.stdout.write('@@RESULT' + JSON.stringify({ runs, totalDuration: r.totalDuration }) + '@@END');
    });`;
  const { out } = await sh(process.execPath, ['-e', script], dir);
  const m = /@@RESULT(.*)@@END/s.exec(out);
  if (!m) throw new Error(`cypress run failed for ${project.name}:\n${out.slice(-3000)}`);
  const r = JSON.parse(m[1]);
  return { total: r.totalDuration / 1000, specs: r.runs.map((x) => ({ path: x.spec, seconds: x.ms / 1000, failures: x.failures })) };
}

async function measureVitest(project) {
  const dir = join(WS, project.root);
  const outFile = join(mkdtempSync(join(tmpdir(), 'vitest-cal-')), 'out.json');
  const t0 = Date.now();
  const { out } = await sh(process.execPath, [join(WS, 'node_modules/vitest/vitest.mjs'), 'run', '--reporter=json', `--outputFile=${outFile}`], dir);
  const total = (Date.now() - t0) / 1000;
  if (!existsSync(outFile)) throw new Error(`vitest failed for ${project.name}:\n${out.slice(-3000)}`);
  const r = JSON.parse(readFileSync(outFile, 'utf8'));
  return {
    total,
    specs: r.testResults.map((f) => ({
      path: f.name.slice(dir.length + 1),
      seconds: f.assertionResults.reduce((s, a) => s + (a.duration ?? 0), 0) / 1000,
      failures: f.assertionResults.filter((a) => a.status !== 'passed').length,
    })),
  };
}

async function measurePlaywright(project) {
  const dir = join(WS, project.root);
  const appDir = join(WS, 'apps', project.app);
  if (!existsSync(join(appDir, 'dist', 'index.html'))) {
    execFileSync(process.execPath, [join(WS, 'node_modules/vite/bin/vite.js'), 'build'], { cwd: appDir, env, stdio: 'ignore' });
  }
  const outFile = join(mkdtempSync(join(tmpdir(), 'pw-cal-')), 'out.json');
  const t0 = Date.now();
  const { out } = await sh(process.execPath, [join(WS, 'node_modules/@playwright/test/cli.js'), 'test', '--reporter=json'], dir, { PLAYWRIGHT_JSON_OUTPUT_NAME: outFile });
  const total = (Date.now() - t0) / 1000;
  if (!existsSync(outFile)) throw new Error(`playwright failed for ${project.name}:\n${out.slice(-3000)}`);
  const r = JSON.parse(readFileSync(outFile, 'utf8'));
  const specs = [];
  const walk = (suite) => {
    if (suite.file && suite.specs?.length) {
      let s = specs.find((x) => x.path === `src/${suite.file}` || x.path === suite.file);
      if (!s) specs.push((s = { path: suite.file.startsWith('src/') ? suite.file : `src/${suite.file}`, seconds: 0, failures: 0 }));
      for (const sp of suite.specs) for (const t of sp.tests) for (const res of t.results) {
        s.seconds += res.duration / 1000;
        if (res.status !== 'passed') s.failures++;
      }
    }
    (suite.suites ?? []).forEach(walk);
  };
  r.suites.forEach(walk);
  return { total, specs };
}

const MEASURE = { cypress: measureCypress, vitest: measureVitest, playwright: measurePlaywright };

/** Non-negative least squares by cyclic coordinate descent (few features, many rows). */
function nnls(X, y, iters = 20000) {
  const n = X[0].length;
  const w = new Array(n).fill(0);
  const colSq = Array.from({ length: n }, (_, j) => X.reduce((s, row) => s + row[j] * row[j], 0));
  const resid = y.slice();
  for (let it = 0; it < iters; it++) {
    let delta = 0;
    for (let j = 0; j < n; j++) {
      if (colSq[j] === 0) continue;
      const g = X.reduce((s, row, i) => s + row[j] * resid[i], 0);
      const nw = Math.max(0, w[j] + g / colSq[j]);
      const d = nw - w[j];
      if (d !== 0) {
        for (let i = 0; i < X.length; i++) resid[i] -= d * X[i][j];
        w[j] = nw;
        delta = Math.max(delta, Math.abs(d));
      }
    }
    if (delta < 1e-9) break;
  }
  return w;
}

function pearson(a, b) {
  const n = a.length;
  const ma = a.reduce((s, v) => s + v, 0) / n;
  const mb = b.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return num / Math.sqrt(da * db);
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

const q = (arr, p) => {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))];
};

async function main() {
  const results = {};
  for (const runner of runners) {
    const projects = manifest.projects.filter((p) => p.runner === runner && (!onlyProjects || onlyProjects.has(p.name)));
    if (!projects.length) continue;
    console.log(`\n### ${runner}: measuring ${projects.map((p) => p.name).join(', ')} (concurrency ${concurrency})`);
    const measured = await pool(projects, concurrency, async (p) => {
      const t0 = Date.now();
      const m = await MEASURE[runner](p);
      console.log(`  ${p.name}: ${m.specs.length} specs, process wall ${m.total.toFixed(1)}s (measured in ${((Date.now() - t0) / 1000).toFixed(0)}s), failures ${m.specs.reduce((s, x) => s + x.failures, 0)}`);
      return { project: p, ...m };
    });
    const rows = [];
    for (const m of measured) {
      for (const spec of m.project.specs) {
        const got = m.specs.find((x) => x.path === spec.path);
        if (!got) {
          console.warn(`  ! no measurement for ${m.project.name}/${spec.path}`);
          continue;
        }
        rows.push({ project: m.project.name, ...spec, seconds: got.seconds, failures: got.failures });
      }
    }
    const features = Object.keys(model[runner]);
    const X = rows.map((r) => features.map((f) => r.cost[f] ?? 0));
    const y = rows.map((r) => r.seconds);
    const w = nnls(X, y);
    const fitted = Object.fromEntries(features.map((f, j) => [f, Number(w[j].toPrecision(4))]));
    const pred = rows.map((r) => estimate(fitted, r.cost));
    const ssRes = y.reduce((s, v, i) => s + (v - pred[i]) ** 2, 0);
    const my = y.reduce((s, v) => s + v, 0) / y.length;
    const ssTot = y.reduce((s, v) => s + (v - my) ** 2, 0);
    const secs = rows.map((r) => r.seconds);
    const bytes = rows.map((r) => r.bytes);
    const targets = rows.map((r) => r.target);
    const summary = {
      specs: rows.length,
      failures: rows.reduce((s, r) => s + r.failures, 0),
      measured: { min: q(secs, 0), p25: q(secs, 0.25), median: q(secs, 0.5), p75: q(secs, 0.75), max: q(secs, 1), mean: my, sum: secs.reduce((s, v) => s + v, 0) },
      target: { mean: targets.reduce((s, v) => s + v, 0) / targets.length, sum: targets.reduce((s, v) => s + v, 0) },
      r_measured_vs_target: pearson(secs, targets),
      r_measured_vs_bytes: pearson(secs, bytes),
      secondsPerKb: secs.reduce((s, v) => s + v, 0) / (bytes.reduce((s, v) => s + v, 0) / 1024),
      fit: { coefficients: fitted, r2: 1 - ssRes / ssTot },
      processWall: Object.fromEntries(measured.map((m) => [m.project.name, Number(m.total.toFixed(2))])),
    };
    results[runner] = { summary, rows };
    console.log(JSON.stringify(summary, null, 2));
    if (args.write) model[runner] = fitted;
  }
  if (args.write) {
    writeFileSync(calibrationPath, JSON.stringify(model, null, 2) + '\n');
    console.log(`\nwrote ${calibrationPath}`);
  }
  if (args.out) writeFileSync(resolve(args.out), JSON.stringify(results, null, 2) + '\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
