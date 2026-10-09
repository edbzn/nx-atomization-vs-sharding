#!/usr/bin/env node
// Generates the three benchmark workspaces (baseline / atomized / sharded) under
// <repo>/workspaces. Their source trees are byte-identical except for the Nx plugin
// configuration in nx.json and, for `sharded`, the copied shard plugin (tools/shard-plugin).
//
// Usage: node generator/generate.mjs [--clean] [--native-parallelism] [--no-install] [--only=<variant>]
//   --clean               remove workspaces/ entirely first (otherwise node_modules is kept)
//   --native-parallelism  keep Nx's inferred `parallelism: false` on CT/e2e targets (see root.mjs)
//   --no-install          skip pnpm install (and therefore commit no lockfile changes)
//   --only=<variant>      only (re)generate one workspace
//
// Everything is deterministic (seeded PRNG). The pnpm lockfile is kept at
// generator/pnpm-lock.yaml once created, so every regeneration installs identical versions.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createRng, sampleTargets } from './lib/rng.mjs';
import { DOMAINS, makeRows } from './lib/domain.mjs';
import { sharedUiFiles } from './templates/shared-ui.mjs';
import { libFiles } from './templates/lib.mjs';
import { appFiles } from './templates/app.mjs';
import { e2eFiles } from './templates/e2e.mjs';
import { nxJson, rootFiles, VERSIONS } from './templates/root.mjs';

const GEN_DIR = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(GEN_DIR, '..');
const WS_DIR = join(REPO, 'workspaces');
const LOCKFILE = join(GEN_DIR, 'pnpm-lock.yaml');
const SHARD_PLUGIN_SRC = join(REPO, 'shard-plugin', 'src');
const SEED = 'nx-atomization-vs-sharding/v1';
const VARIANTS = ['atomized', 'baseline', 'sharded']; // atomized first: it resolves the lockfile

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const only = args.find((a) => a.startsWith('--only='))?.slice(7);
const options = { clean: flag('clean'), nativeParallelism: flag('native-parallelism'), install: !flag('no-install') };

// ------------------------------------------------------------------ workspace layout
export const LAYOUT = {
  ct: [
    { name: 'ct-product', domain: 'product', specs: 2 },
    { name: 'ct-invoice', domain: 'invoice', specs: 4 },
    { name: 'ct-ticket', domain: 'ticket', specs: 8 },
    { name: 'ct-shipment', domain: 'shipment', specs: 14 },
    { name: 'ct-patient', domain: 'patient', specs: 22 },
    { name: 'ct-booking', domain: 'booking', specs: 34 },
  ],
  unit: [
    { name: 'unit-employee', domain: 'employee', specs: 4 },
    { name: 'unit-asset', domain: 'asset', specs: 8 },
    { name: 'unit-campaign', domain: 'campaign', specs: 16 },
    { name: 'unit-contract', domain: 'contract', specs: 30 },
    { name: 'unit-recipe', domain: 'recipe', specs: 50 },
    { name: 'unit-vehicle', domain: 'vehicle', specs: 80 },
  ],
  apps: [
    { name: 'academy', title: 'Academy Portal', domain: 'course', catalog: 64, specs: 5 },
    { name: 'homes', title: 'Homes Finder', domain: 'listing', catalog: 96, specs: 12 },
    { name: 'shop', title: 'Shop Admin', domain: 'order', catalog: 140, specs: 28 },
  ],
};
// The "partial" change touches one mid-size project per runner.
const PARTIAL = { ct: 'ct-shipment', unit: 'unit-contract', app: 'homes' };

// Spec runtime targets (seconds, as reported by the runner for one spec inside a warm process).
const TARGETS = {
  cypress: { mean: 5, min: 1, max: 20, sigma: 0.8 },
  vitest: { mean: 1, min: 0.2, max: 3, sigma: 0.75 },
  playwright: { mean: 4, min: 1, max: 10, sigma: 0.6 },
};

function domainByKey(key) {
  const d = DOMAINS.find((x) => x.key === key);
  if (!d) throw new Error(`unknown domain ${key}`);
  return d;
}

/** Per-spec targets for a group of projects: sampled globally, shuffled, then sliced per project. */
function distributeTargets(rng, projects, params) {
  const total = projects.reduce((s, p) => s + p.specs, 0);
  const all = rng.shuffle(sampleTargets(rng, total, params));
  let i = 0;
  return projects.map((p) => {
    const slice = all.slice(i, i + p.specs);
    i += p.specs;
    return slice;
  });
}

/** Build the whole source tree for a stage ('base' | 'full' | 'partial'). Pure + deterministic. */
export function buildTree(stage, model) {
  const rng = createRng(SEED);
  const files = { ...rootFiles(), ...sharedUiFiles({ buttonSize: stage === 'full' }) };
  const manifest = { seed: SEED, versions: VERSIONS, projects: [] };

  const ctTargets = distributeTargets(rng.fork('ct-targets'), LAYOUT.ct, TARGETS.cypress);
  LAYOUT.ct.forEach((p, i) => {
    const lib = libFiles({
      runner: 'cypress',
      name: p.name,
      domain: domainByKey(p.domain),
      targets: ctTargets[i],
      rng: rng.fork(`ct/${p.name}`),
      model: model.cypress,
      touched: stage === 'partial' && p.name === PARTIAL.ct,
    });
    Object.assign(files, lib.files);
    manifest.projects.push({ name: p.name, root: lib.root, runner: 'cypress', specs: lib.specs.map(specMeta(lib.root, lib.files)) });
  });

  const unitTargets = distributeTargets(rng.fork('unit-targets'), LAYOUT.unit, TARGETS.vitest);
  LAYOUT.unit.forEach((p, i) => {
    const lib = libFiles({
      runner: 'vitest',
      name: p.name,
      domain: domainByKey(p.domain),
      targets: unitTargets[i],
      rng: rng.fork(`unit/${p.name}`),
      model: model.vitest,
      touched: stage === 'partial' && p.name === PARTIAL.unit,
    });
    Object.assign(files, lib.files);
    manifest.projects.push({ name: p.name, root: lib.root, runner: 'vitest', specs: lib.specs.map(specMeta(lib.root, lib.files)) });
  });

  const e2eTargets = distributeTargets(rng.fork('e2e-targets'), LAYOUT.apps, TARGETS.playwright);
  LAYOUT.apps.forEach((p, i) => {
    const domain = domainByKey(p.domain);
    const rows = makeRows(rng.fork(`catalog/${p.name}`), domain, p.catalog);
    const app = appFiles({ name: p.name, title: p.title, domain, rows, touched: stage === 'partial' && p.name === PARTIAL.app });
    Object.assign(files, app.files);
    const e2e = e2eFiles({ app: p.name, title: p.title, domain, rows, targets: e2eTargets[i], rng: rng.fork(`e2e/${p.name}`), model: model.playwright });
    Object.assign(files, e2e.files);
    manifest.projects.push({ name: p.name, root: app.root, runner: null, specs: [] });
    manifest.projects.push({ name: e2e.name, root: e2e.root, runner: 'playwright', app: p.name, specs: e2e.specs.map(specMeta(e2e.root, e2e.files)) });
  });

  assertNoSuffixPaths(manifest);
  return { files, manifest };
}

function specMeta(root, files) {
  return (s) => ({
    path: s.path,
    bytes: Buffer.byteLength(files[`${root}/${s.path}`]),
    target: s.target,
    estimate: Math.round(s.estimate * 100) / 100,
    cost: s.cost,
  });
}

/** Vitest/Playwright CLI filters are substring matches: no spec path may be contained in another. */
function assertNoSuffixPaths(manifest) {
  for (const p of manifest.projects) {
    for (const a of p.specs) {
      for (const b of p.specs) {
        if (a !== b && b.path.includes(a.path)) throw new Error(`${p.name}: spec path ${a.path} is a substring of ${b.path}`);
      }
    }
  }
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
const GIT_CFG = ['-c', 'commit.gpgsign=false', '-c', 'tag.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'init.defaultBranch=main', '-c', 'core.autocrlf=false'];

function git(dir, argv, date) {
  const env = { ...process.env, ...GIT_ENV, ...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}) };
  return run('git', [...GIT_CFG, ...argv], { cwd: dir, env, capture: true });
}

function prepareDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return;
  }
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules') continue;
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function pnpmInstall(dir, frozen) {
  // Explicit --dir: pnpm must never treat a parent directory (e.g. $HOME has a package.json
  // and node_modules) as the workspace root.
  const env = { ...process.env, CI: 'true', npm_config_workspace_dir: dir };
  delete env.npm_config_global;
  run('pnpm', ['install', '--dir', dir, frozen ? '--frozen-lockfile' : '--no-frozen-lockfile', '--prefer-offline', '--reporter=append-only'], { cwd: dir, env });
}

function diffFiles(base, other) {
  const changed = {};
  for (const [k, v] of Object.entries(other)) if (base[k] !== v) changed[k] = v;
  for (const k of Object.keys(base)) if (!(k in other)) throw new Error(`stage removes ${k}; not supported`);
  return changed;
}

function copyShardPlugin(dir) {
  if (!existsSync(SHARD_PLUGIN_SRC)) {
    console.warn(`WARNING: ${SHARD_PLUGIN_SRC} not found; the sharded workspace has no shard plugin (nx will fail to load it).`);
    return false;
  }
  const dest = join(dir, 'tools', 'shard-plugin', 'src');
  mkdirSync(dest, { recursive: true });
  cpSync(SHARD_PLUGIN_SRC, dest, { recursive: true, filter: (src) => !/\.(spec|test)\.ts$/.test(src) && !src.includes('node_modules') });
  return true;
}

// ------------------------------------------------------------------ main
function main() {
  const model = JSON.parse(readFileSync(join(GEN_DIR, 'calibration.json'), 'utf8'));
  const base = buildTree('base', model);
  const full = diffFiles(base.files, buildTree('full', model).files);
  const partial = diffFiles(base.files, buildTree('partial', model).files);
  console.log(`generated ${Object.keys(base.files).length} files; full changes ${Object.keys(full).join(', ')}; partial changes ${Object.keys(partial).join(', ')}`);

  if (options.clean && !only) rmSync(WS_DIR, { recursive: true, force: true });
  mkdirSync(WS_DIR, { recursive: true });

  for (const variant of VARIANTS) {
    if (only && only !== variant) continue;
    const dir = join(WS_DIR, variant);
    if (options.clean && only) rmSync(dir, { recursive: true, force: true });
    console.log(`\n=== ${variant} (${dir})`);
    prepareDir(dir);
    writeTree(dir, base.files);
    writeFileSync(join(dir, 'nx.json'), nxJson(variant, { nativeParallelism: options.nativeParallelism }));
    if (variant === 'sharded') copyShardPlugin(dir);

    const haveLock = existsSync(LOCKFILE);
    if (haveLock) copyFileSync(LOCKFILE, join(dir, 'pnpm-lock.yaml'));
    if (options.install) {
      pnpmInstall(dir, haveLock);
      if (!haveLock) copyFileSync(join(dir, 'pnpm-lock.yaml'), LOCKFILE);
    }

    git(dir, ['init', '-q']);
    git(dir, ['add', '-A']);
    git(dir, ['commit', '-q', '-m', 'Initial benchmark workspace'], '2026-01-01T10:00:00Z');
    git(dir, ['tag', 'base']);

    git(dir, ['checkout', '-q', '-b', 'stage-full']);
    writeTree(dir, full);
    git(dir, ['add', '-A']);
    git(dir, ['commit', '-q', '-m', 'feat(shared-ui): add a size prop to Button'], '2026-01-01T11:00:00Z');
    git(dir, ['tag', 'full']);

    git(dir, ['checkout', '-q', 'main']);
    git(dir, ['checkout', '-q', '-b', 'stage-partial']);
    writeTree(dir, partial);
    git(dir, ['add', '-A']);
    git(dir, ['commit', '-q', '-m', `feat: touch ${PARTIAL.ct}, ${PARTIAL.unit} and ${PARTIAL.app}`], '2026-01-01T12:00:00Z');
    git(dir, ['tag', 'partial']);

    git(dir, ['checkout', '-q', 'main']);
    git(dir, ['branch', '-q', '-D', 'stage-full', 'stage-partial']);
    const sha = (t) => git(dir, ['rev-parse', '--short', t]).trim();
    console.log(`${variant}: base=${sha('base')} full=${sha('full')} partial=${sha('partial')}`);
  }

  writeFileSync(join(WS_DIR, 'manifest.json'), JSON.stringify({ ...base.manifest, partial: PARTIAL, targets: TARGETS }, null, 2) + '\n');
  console.log(`\nmanifest: ${join(WS_DIR, 'manifest.json')}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
