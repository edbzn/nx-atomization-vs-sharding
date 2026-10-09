#!/usr/bin/env node
// Workspace-size scaling experiment: generates Vitest-only Nx workspaces with N libs.
//
//   node generator/scale.mjs --projects N [--variant baseline|atomized|sharded|all] [--out workspaces/scale]
//        [--force] [--no-install] [--shard-spec-seconds 5]
//   node generator/scale.mjs --plan [--projects 20,100,500,1500]     # totals only, writes nothing
//
// Writes <out>/<variant>-<N>/. Source trees are byte-identical across variants for a given N;
// only nx.json's plugin config differs (and `sharded` gets tools/shard-plugin/src):
//   baseline: @nx/vitest without ciTargetName (one `test` task per project)
//   atomized: @nx/vitest with ciTargetName "test-ci" (one atom per spec + noop parent)
//   sharded:  baseline + ./tools/shard-plugin/src/vitest.ts {ciTargetName: "test-ci", delegateTarget: "test", secondsPerKb}
//
// Deterministic (seeded PRNG). One lockfile (generator/scale/pnpm-lock.yaml) serves every size
// and variant: libs are not pnpm workspace packages, so the root package.json is the only
// importer. It is seeded once from generator/pnpm-lock.yaml (same transitive versions as the
// main workspaces), then every workspace installs with --frozen-lockfile from the pnpm store.
//
// An existing workspace (it has .git) is left alone unless --force.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync, copyFileSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { createRng } from './lib/rng.mjs';
import { IMPORT_SCOPE, scaleLibFiles, scaleNxJson, scaleRootFiles } from './scale/templates.mjs';

const GEN_DIR = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(GEN_DIR, '..');
const SEED_LOCKFILE = join(GEN_DIR, 'pnpm-lock.yaml');
const SCALE_LOCKFILE = join(GEN_DIR, 'scale', 'pnpm-lock.yaml');
const SHARD_PLUGIN_SRC = join(REPO, 'shard-plugin', 'src');
const SEED = 'nx-atomization-vs-sharding/scale/v1';
export const SCALE_VARIANTS = ['baseline', 'atomized', 'sharded'];
export const DEFAULT_SCALE_DIR = join(REPO, 'workspaces', 'scale');

export const LAYERS = 10;
/** Specs per project: long-tailed (mean ≈ 8.25). Shares are exact (stratified), order is shuffled. */
export const SPEC_TIERS = [
  { share: 0.6, min: 2, max: 5 },
  { share: 0.3, min: 6, max: 15 },
  { share: 0.1, min: 20, max: 40 },
];
/** Fold rounds per spec (its CPU work, ~1.1 ns/round): log-normal around the median, clamped. */
export const SPEC_ROUNDS = { median: 2e7, sigma: 0.8, min: 3e6, max: 1.2e8 };
/**
 * Nominal CI seconds per spec used to derive the shard plugin's `secondsPerKb`. Our specs run
 * in milliseconds, so with the plugin's default (calibrated on the React specs: 0.095 s/KB)
 * no project would ever reach the 90 s shard target and `sharded` would degenerate into
 * `baseline` + one noop parent per project. At 5 s/spec the 20-40-spec projects get 2-3
 * shards (like Cypress CT projects in the main benchmark). 0 = plugin default.
 */
export const DEFAULT_SHARD_SPEC_SECONDS = 5;
/** secondsPerKb is derived from this size's mean spec bytes so it is the same for every N. */
const SHARD_REFERENCE_SIZE = 1500;

const NOUNS = [
  'billing', 'catalog', 'checkout', 'claims', 'consent', 'contracts', 'dispatch', 'documents', 'eligibility', 'events',
  'fleet', 'forms', 'geo', 'identity', 'imaging', 'insights', 'inventory', 'invoices', 'labs', 'ledger',
  'messaging', 'metrics', 'notes', 'orders', 'payments', 'payroll', 'pricing', 'profiles', 'quotes', 'referrals',
  'reports', 'rostering', 'routing', 'schedules', 'search', 'settings', 'shipping', 'staffing', 'tasks', 'vitals',
];
const MODULE_WORDS = [
  'parser', 'encoder', 'reducer', 'matcher', 'indexer', 'planner', 'resolver', 'selector', 'mapper', 'validator',
  'formatter', 'scorer', 'merger', 'splitter', 'ranker', 'hasher', 'sampler', 'tracker', 'filter', 'grouper',
];
const TOPICS = ['basics', 'edge-cases', 'large-input', 'determinism', 'labels', 'regression', 'bounds', 'batches', 'seeds', 'stability'];

const pad4 = (i) => String(i).padStart(4, '0');

// ------------------------------------------------------------------ model
/** The whole workspace as data. Pure + deterministic for a given N. */
export function buildModel(n) {
  if (!Number.isInteger(n) || n < 1) throw new Error(`--projects must be a positive integer (got ${n})`);
  const rng = createRng(SEED);
  const layers = Math.min(LAYERS, n);
  const tierCounts = SPEC_TIERS.map((t) => Math.round(t.share * n));
  tierCounts[0] = n - tierCounts[1] - tierCounts[2];
  const tierOf = rng.fork(`tiers/${n}`).shuffle(tierCounts.flatMap((c, t) => Array(c).fill(t)));

  const libs = [];
  const byLayer = Array.from({ length: layers }, () => []);
  for (let i = 0; i < n; i++) {
    const r = rng.fork(`lib/${i}`);
    const layer = Math.floor((i * layers) / n);
    const noun = NOUNS[i % NOUNS.length];
    const dir = `${noun}-${pad4(i)}`;
    const lib = {
      index: i,
      layer: `l${layer}`,
      layerIndex: layer,
      name: `l${layer}-${dir}`,
      root: `libs/l${layer}/${dir}`,
      importPath: `${IMPORT_SCOPE}/l${layer}-${dir}`,
      salt: r.int(0, 0xffffffff) >>> 0,
      tier: tierOf[i],
      deps: [],
      modules: [],
      specs: [],
    };
    // Dependencies: 1-3 libs from lower layers, 60% from the layer right below.
    if (layer > 0) {
      const want = r.int(1, 3);
      for (let attempt = 0; attempt < 20 && lib.deps.length < want; attempt++) {
        const l = r.bool(0.6) ? layer - 1 : r.int(0, layer - 1);
        const cand = r.pick(byLayer[l]);
        if (cand && !lib.deps.includes(cand)) lib.deps.push(cand);
      }
    }
    const tier = SPEC_TIERS[lib.tier];
    const specCount = r.int(tier.min, tier.max);
    const moduleCount = Math.min(8, Math.max(2, Math.ceil(specCount / 4)));
    lib.modules = r.shuffle(MODULE_WORDS).slice(0, moduleCount).sort().map((name) => ({
      name,
      multiplier: ((r.int(0, 0x7fffffff) << 1) | 1) >>> 0,
      deps: [],
    }));
    lib.deps.forEach((d, j) => lib.modules[j % moduleCount].deps.push(d));
    const topicUse = {};
    for (let s = 0; s < specCount; s++) {
      const mod = lib.modules[s % moduleCount];
      const k = (topicUse[mod.name] = (topicUse[mod.name] ?? -1) + 1);
      const topic = k < TOPICS.length ? TOPICS[k] : `${TOPICS[k % TOPICS.length]}-${Math.floor(k / TOPICS.length) + 1}`;
      const total = Math.round(Math.min(SPEC_ROUNDS.max, Math.max(SPEC_ROUNDS.min, SPEC_ROUNDS.median * Math.exp(SPEC_ROUNDS.sigma * r.normal()))));
      const its = r.int(1, 3);
      lib.specs.push({
        module: mod.name,
        topic,
        path: `src/lib/${mod.name}.${topic}.spec.tsx`,
        rounds: total,
        folds: Array.from({ length: its }, () => ({ seed: r.int(1, 999_999), rounds: Math.round(total / its) })),
        batchSeeds: [r.int(1, 999_999), r.int(1, 999_999), r.int(1, 999_999)],
      });
    }
    libs.push(lib);
    byLayer[layer].push(lib);
  }
  assertNoSubstringSpecPaths(libs);
  return { n, layers, libs };
}

/** Vitest CLI filters are substring matches: no spec path may contain another of its project. */
function assertNoSubstringSpecPaths(libs) {
  for (const lib of libs) {
    const paths = lib.specs.map((s) => s.path);
    for (const a of paths) for (const b of paths) if (a !== b && b.includes(a)) throw new Error(`${lib.name}: ${a} is a substring of ${b}`);
  }
}

/** Source files shared by every variant (nx.json and the shard plugin excluded). */
export function buildTree(model) {
  const files = scaleRootFiles(model.libs);
  for (const lib of model.libs) Object.assign(files, scaleLibFiles(lib));
  return files;
}

const specBytes = (files, lib) => lib.specs.map((s) => ({ path: s.path, bytes: Buffer.byteLength(files[`${lib.root}/${s.path}`]) }));

let referenceSecondsPerKb = null;
/** secondsPerKb for the shard plugin: nominal spec seconds / mean spec KB at the reference size. */
export function shardSecondsPerKb(specSeconds = DEFAULT_SHARD_SPEC_SECONDS) {
  if (!specSeconds) return null;
  if (referenceSecondsPerKb == null) {
    const m = buildModel(SHARD_REFERENCE_SIZE);
    let bytes = 0;
    let count = 0;
    for (const lib of m.libs) {
      const files = scaleLibFiles(lib);
      for (const s of specBytes(files, lib)) {
        bytes += s.bytes;
        count++;
      }
    }
    referenceSecondsPerKb = 1 / (bytes / count / 1024);
  }
  return Number((specSeconds * referenceSecondsPerKb).toPrecision(4));
}

/** Expected projects / targets / tasks per variant (shards via the plugin's own planShards). */
export async function planTotals(model, files, { specSeconds = DEFAULT_SHARD_SPEC_SECONDS } = {}) {
  const { planShards, DEFAULT_TARGET_SHARD_SECONDS, DEFAULT_MAX_SHARDS } = await import(join(SHARD_PLUGIN_SRC, 'core.ts'));
  const { VITEST_SECONDS_PER_KB } = await import(join(SHARD_PLUGIN_SRC, 'vitest.ts'));
  const secondsPerKb = shardSecondsPerKb(specSeconds) ?? VITEST_SECONDS_PER_KB;
  const n = model.libs.length;
  const specs = model.libs.reduce((s, l) => s + l.specs.length, 0);
  let shardTargets = 0;
  let shardedProjects = 0;
  let shardTasks = 0;
  const shardHist = {};
  for (const lib of model.libs) {
    const plan = planShards(specBytes(files, lib), { secondsPerKb, targetShardSeconds: DEFAULT_TARGET_SHARD_SECONDS, maxShards: DEFAULT_MAX_SHARDS });
    const k = plan.sharded ? plan.shardCount : 1;
    shardHist[k] = (shardHist[k] ?? 0) + 1;
    if (plan.sharded) {
      shardedProjects++;
      shardTargets += plan.shardCount;
      shardTasks += plan.shardCount;
    } else shardTasks += 1; // delegates to `test`
  }
  const hist = {};
  for (const lib of model.libs) {
    const k = lib.specs.length <= 5 ? '2-5' : lib.specs.length <= 15 ? '6-15' : '20-40';
    hist[k] = (hist[k] ?? 0) + 1;
  }
  const edges = model.libs.reduce((s, l) => s + l.deps.length, 0);
  return {
    projects: n,
    layers: model.layers,
    depEdges: edges,
    specs,
    specsPerProject: { mean: Number((specs / n).toFixed(2)), hist },
    files: Object.keys(files).length,
    sourceBytes: Object.values(files).reduce((s, c) => s + Buffer.byteLength(c), 0),
    shard: { secondsPerKb, shardedProjects, shardTargets, shardsPerProjectHist: shardHist },
    variants: {
      baseline: { target: 'test', targets: n, tasks: n },
      atomized: { target: 'test-ci', targets: 2 * n + specs, tasks: specs + n, atoms: specs },
      sharded: { target: 'test-ci', targets: 2 * n + shardTargets, tasks: shardTasks + n, shards: shardTargets },
    },
  };
}

// ------------------------------------------------------------------ fs + process helpers
function writeTree(dir, files) {
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(dir, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
}

function run(cmd, argv, opts = {}) {
  return execFileSync(cmd, argv, { stdio: opts.capture ? 'pipe' : 'inherit', encoding: 'utf8', ...opts });
}

const GIT_ENV = {
  GIT_AUTHOR_NAME: 'Bench Generator',
  GIT_AUTHOR_EMAIL: 'bench-generator@example.invalid',
  GIT_COMMITTER_NAME: 'Bench Generator',
  GIT_COMMITTER_EMAIL: 'bench-generator@example.invalid',
};
const GIT_CFG = ['-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'init.defaultBranch=main', '-c', 'core.autocrlf=false'];

function git(dir, argv, date) {
  const env = { ...process.env, ...GIT_ENV, ...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}) };
  return run('git', [...GIT_CFG, ...argv], { cwd: dir, env, capture: true });
}

function pnpmInstall(dir, frozen) {
  // Explicit --dir: pnpm must never treat a parent directory ($HOME has a package.json and
  // node_modules) as the workspace root.
  const env = { ...process.env, CI: 'true', npm_config_workspace_dir: dir };
  delete env.npm_config_global;
  run('pnpm', ['install', '--dir', dir, frozen ? '--frozen-lockfile' : '--no-frozen-lockfile', '--prefer-offline', '--reporter=append-only'], { cwd: dir, env });
}

/** `nx` must resolve inside the workspace, never from a parent node_modules. */
function verifyLocalResolution(dir) {
  const script = `const r = require('node:module').createRequire(${JSON.stringify(join(dir, 'package.json'))});
for (const m of ['nx/package.json', '@nx/vitest/package.json', '@nx/js/package.json', 'vitest/package.json', 'vite/package.json', 'typescript/package.json']) {
  const p = require('node:fs').realpathSync(r.resolve(m));
  console.log(m.replace('/package.json', '') + '@' + require(p).version + ' ' + p);
}`;
  const out = run('node', ['-e', script], { cwd: dir, capture: true });
  for (const line of out.trim().split('\n')) {
    const p = line.split(' ')[1];
    if (!p.startsWith(dir + '/')) throw new Error(`${dir}: ${line} resolves outside the workspace`);
  }
  const nxVersion = run('pnpm', ['exec', 'nx', '--version'], { cwd: dir, capture: true, env: { ...process.env, NX_DAEMON: 'false', NX_NO_CLOUD: 'true' } });
  return { modules: out.trim().split('\n'), nxVersion: nxVersion.trim().replace(/\s+/g, ' ') };
}

function copyShardPlugin(dir) {
  const dest = join(dir, 'tools', 'shard-plugin', 'src');
  mkdirSync(dest, { recursive: true });
  cpSync(SHARD_PLUGIN_SRC, dest, { recursive: true, filter: (src) => !/\.(spec|test)\.ts$/.test(src) && !src.includes('node_modules') });
}

export const workspaceDir = (out, variant, n) => join(out, `${variant}-${n}`);

/** Generate (if needed) one workspace. Returns its dir. */
export function generateWorkspace({ model, files, variant, out, force = false, install = true, specSeconds = DEFAULT_SHARD_SPEC_SECONDS, log = console.log }) {
  const dir = workspaceDir(out, variant, model.n);
  if (existsSync(join(dir, '.git')) && !force) {
    log(`${variant}-${model.n}: exists (${dir}), skipped (use --force to regenerate)`);
    return dir;
  }
  log(`\n=== ${variant}-${model.n} (${dir})`);
  if (existsSync(dir)) {
    for (const entry of readdirSync(dir)) if (entry !== 'node_modules') rmSync(join(dir, entry), { recursive: true, force: true });
  } else mkdirSync(dir, { recursive: true });
  writeTree(dir, files);
  writeFileSync(join(dir, 'nx.json'), scaleNxJson(variant, { shardSecondsPerKb: shardSecondsPerKb(specSeconds) }));
  if (variant === 'sharded') copyShardPlugin(dir);

  const haveLock = existsSync(SCALE_LOCKFILE);
  copyFileSync(haveLock ? SCALE_LOCKFILE : SEED_LOCKFILE, join(dir, 'pnpm-lock.yaml'));
  if (install) {
    pnpmInstall(dir, haveLock);
    if (!haveLock) {
      copyFileSync(join(dir, 'pnpm-lock.yaml'), SCALE_LOCKFILE);
      log(`lockfile resolved once and saved to ${SCALE_LOCKFILE}`);
    }
    const res = verifyLocalResolution(dir);
    log(`resolution OK: nx ${res.nxVersion}\n  ${res.modules.join('\n  ')}`);
  }
  git(dir, ['init', '-q']);
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-q', '-m', `Scaling workspace: ${model.n} projects (${variant})`], '2026-01-01T10:00:00Z');
  log(`${variant}-${model.n}: commit ${git(dir, ['rev-parse', '--short', 'HEAD']).trim()}`);
  return dir;
}

function printTotals(t) {
  const v = t.variants;
  console.log(
    `N=${t.projects}: ${t.layers} layers, ${t.depEdges} dep edges, ${t.specs} specs (mean ${t.specsPerProject.mean}/project; ` +
      `${Object.entries(t.specsPerProject.hist).map(([k, c]) => `${k}: ${c}`).join(', ')}), ${t.files} files, ${(t.sourceBytes / 1e6).toFixed(1)} MB\n` +
      `  shard plugin: secondsPerKb ${t.shard.secondsPerKb}, ${t.shard.shardedProjects} sharded projects, ${t.shard.shardTargets} shard targets ` +
      `(shards/project: ${Object.entries(t.shard.shardsPerProjectHist).map(([k, c]) => `${k}×${c}`).join(' ')})\n` +
      `  baseline: ${v.baseline.targets} targets, ${v.baseline.tasks} tasks (-t test)\n` +
      `  atomized: ${v.atomized.targets} targets, ${v.atomized.tasks} tasks (-t test-ci: ${v.atomized.atoms} atoms + ${t.projects} noop parents)\n` +
      `  sharded:  ${v.sharded.targets} targets, ${v.sharded.tasks} tasks (-t test-ci: ${v.sharded.shards} shards + ${t.projects - t.shard.shardedProjects} delegated test + ${t.projects} noop parents)`,
  );
}

// ------------------------------------------------------------------ main
async function main() {
  const { values } = parseArgs({
    options: {
      projects: { type: 'string' },
      variant: { type: 'string', default: 'all' },
      out: { type: 'string', default: DEFAULT_SCALE_DIR },
      force: { type: 'boolean', default: false },
      'no-install': { type: 'boolean', default: false },
      'shard-spec-seconds': { type: 'string', default: String(DEFAULT_SHARD_SPEC_SECONDS) },
      plan: { type: 'boolean', default: false },
    },
  });
  const sizes = (values.projects ?? (values.plan ? '20,100,500,1500' : '')).split(',').filter(Boolean).map(Number);
  if (!sizes.length) throw new Error('usage: node generator/scale.mjs --projects N [--variant baseline|atomized|sharded|all] [--out dir] | --plan');
  const variants = values.variant === 'all' ? SCALE_VARIANTS : values.variant.split(',');
  for (const v of variants) if (!SCALE_VARIANTS.includes(v)) throw new Error(`unknown variant ${v}`);
  const specSeconds = Number(values['shard-spec-seconds']);
  const out = resolve(values.out);

  for (const n of sizes) {
    const model = buildModel(n);
    const files = buildTree(model);
    const totals = await planTotals(model, files, { specSeconds });
    printTotals(totals);
    if (values.plan) continue;
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, `plan-${n}.json`), JSON.stringify({ seed: SEED, ...totals }, null, 2) + '\n');
    for (const variant of variants) generateWorkspace({ model, files, variant, out, force: values.force, install: !values['no-install'], specSeconds });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.stack ?? e);
    process.exit(1);
  });
}
