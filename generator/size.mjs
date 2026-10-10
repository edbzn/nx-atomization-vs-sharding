#!/usr/bin/env node
// Size sweep: the full benchmark workspace (Cypress component tests + Playwright e2e + Vitest,
// the same templates as generator/generate.mjs) at N projects.
//
//   node generator/size.mjs --projects N[,N...] [--variant baseline|atomized|sharded|all]
//        [--out workspaces/size] [--force] [--no-install] [--shard-target 15]
//   node generator/size.mjs --plan [--projects 10,25,...] [--shard-target 15]   # totals only, writes nothing
//
// Writes <out>/<variant>-<N>/. N counts every project except shared-ui: ~40% Cypress CT libs,
// ~40% Vitest libs, ~10% Vite apps and ~10% Playwright e2e projects (one per app), at least
// one of each. Source trees are byte-identical across variants; only nx.json's plugin config
// differs (generator/templates/root.mjs nxJson, exactly as the main workspaces) and `sharded`
// gets tools/shard-plugin/src.
//
// Differences from the main workspaces (see bench/README.md "Size sweep"):
// - Projects are not pnpm workspace packages (no per-project package.json; shared-ui gets a
//   project.json). Imports resolve through TS path aliases in tsconfig.base.json (Nx infers
//   the project graph from them) and matching Vite aliases in the Cypress / Vitest / Vite
//   configs. So the root package.json is the only importer and one lockfile
//   (generator/size/pnpm-lock.yaml, seeded from generator/pnpm-lock.yaml) serves every size.
// - Short specs (Cypress / Playwright ~0.5-2 s, Vitest ~0.1-0.5 s of in-process work) and
//   smaller table fixtures (12-20 rows), via the templates' cost model.
// - Libs are layered and import 0-2 libs of lower layers (src/lib/integrations.ts); apps
//   import 2-4 libs (src/features.ts, not bundled: it only shapes the project graph).
//
// Generation streams: each project's files are written to every variant directory as soon as
// they are rendered, so memory stays flat at N=2000 (~10k spec files per workspace).

import { execFileSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { createRng } from './lib/rng.mjs';
import { DOMAINS, makeRows } from './lib/domain.mjs';
import { sharedUiFiles } from './templates/shared-ui.mjs';
import { libFiles } from './templates/lib.mjs';
import { appFiles } from './templates/app.mjs';
import { e2eFiles } from './templates/e2e.mjs';
import { nxJson, rootFiles } from './templates/root.mjs';
import { tsPath } from './templates/aliases.mjs';

const GEN_DIR = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(GEN_DIR, '..');
const SEED_LOCKFILE = join(GEN_DIR, 'pnpm-lock.yaml');
export const SIZE_LOCKFILE = join(GEN_DIR, 'size', 'pnpm-lock.yaml');
const SHARD_PLUGIN_SRC = join(REPO, 'shard-plugin', 'src');
const SEED = 'nx-atomization-vs-sharding/size/v1';
export const SIZE_VARIANTS = ['baseline', 'atomized', 'sharded'];
export const DEFAULT_SIZE_DIR = join(REPO, 'workspaces', 'size');
export const DEFAULT_SIZES = [10, 25, 50, 100, 250, 500, 1000, 2000];
export const DEFAULT_SHARD_TARGET = 15;

export const LAYERS = 8;
/**
 * Specs per project. Shares are exact per runner (stratified), order shuffled.
 * SIZE_DENSITY=small (default): long-tailed, mean ≈ 5 — mostly tiny projects.
 * SIZE_DENSITY=large: component-library sizes, mean ≈ 20 (6 to 60), so a 15 s shard target
 * actually splits most projects and sharding lands between one task per project and one
 * per spec. Use a separate --out / --ws-dir for each density.
 */
const DENSITIES = {
  small: [
    { share: 0.55, min: 1, max: 3 },
    { share: 0.35, min: 4, max: 8 },
    { share: 0.1, min: 12, max: 24 },
  ],
  large: [
    { share: 0.25, min: 6, max: 10 },
    { share: 0.4, min: 11, max: 20 },
    { share: 0.25, min: 21, max: 35 },
    { share: 0.1, min: 36, max: 60 },
  ],
};
export const SPEC_DENSITY = process.env.SIZE_DENSITY ?? 'small';
if (!DENSITIES[SPEC_DENSITY]) throw new Error(`unknown SIZE_DENSITY ${SPEC_DENSITY} (small | large)`);
export const SPEC_TIERS = DENSITIES[SPEC_DENSITY];
/**
 * In-process seconds per spec (log-normal around the median, clamped), turned into `it`
 * blocks by the templates' cost model (generator/calibration.json), so spec bytes track runtime.
 */
export const SPEC_SECONDS = {
  cypress: { median: 0.95, sigma: 0.4, min: 0.5, max: 2 },
  playwright: { median: 0.95, sigma: 0.4, min: 0.5, max: 2 },
  vitest: { median: 0.22, sigma: 0.45, min: 0.1, max: 0.5 },
};
/** Rows of a table spec's fixture (main workspaces: 24-44). */
const FIXTURE_ROWS = [12, 20];
const CT_DOMAINS = ['product', 'invoice', 'ticket', 'shipment', 'patient', 'booking'];
const UNIT_DOMAINS = ['employee', 'asset', 'campaign', 'contract', 'recipe', 'vehicle'];
const APPS = [
  { name: 'academy', title: 'Academy Portal', domain: 'course', catalog: 64 },
  { name: 'homes', title: 'Homes Finder', domain: 'listing', catalog: 96 },
  { name: 'shop', title: 'Shop Admin', domain: 'order', catalog: 140 },
];

const pad4 = (i) => String(i).padStart(4, '0');
const domainByKey = (key) => DOMAINS.find((d) => d.key === key);
const json = (o) => JSON.stringify(o, null, 2) + '\n';

// ------------------------------------------------------------------ model (pure, deterministic per N)
/** Project counts for N (shared-ui excluded). */
export function projectMix(n) {
  if (!Number.isInteger(n) || n < 4) throw new Error(`--projects must be an integer >= 4 (got ${n})`);
  const apps = Math.max(1, Math.round(0.1 * n));
  const rest = n - 2 * apps;
  const ct = Math.ceil(rest / 2);
  return { ct, unit: rest - ct, apps, e2e: apps };
}

/** Exact tier counts for `count` projects, shuffled. */
function tierList(rng, count) {
  const counts = SPEC_TIERS.map((t) => Math.round(t.share * count));
  counts[0] = count - counts[1] - counts[2];
  return rng.shuffle(counts.flatMap((c, t) => Array(c).fill(t)));
}

function specSeconds(rng, count, p) {
  return Array.from({ length: count }, () => Math.round(Math.min(p.max, Math.max(p.min, p.median * Math.exp(p.sigma * rng.normal()))) * 100) / 100);
}

export function buildModel(n) {
  const mix = projectMix(n);
  const rng = createRng(`${SEED}/${n}`);
  const libCount = mix.ct + mix.unit;
  const groups = rng.fork('lib-order').shuffle([...Array(mix.ct).fill('ct'), ...Array(mix.unit).fill('unit')]);
  const tiers = { ct: tierList(rng.fork('tiers/ct'), mix.ct), unit: tierList(rng.fork('tiers/unit'), mix.unit), e2e: tierList(rng.fork('tiers/e2e'), mix.e2e) };
  const layers = Math.min(LAYERS, libCount);
  const byLayer = Array.from({ length: layers }, () => []);
  const seen = { ct: 0, unit: 0 };
  const libs = [];
  groups.forEach((group, i) => {
    const k = seen[group]++;
    const domain = domainByKey((group === 'ct' ? CT_DOMAINS : UNIT_DOMAINS)[k % 6]);
    const name = `${group}-${domain.key}-${pad4(i)}`;
    const r = createRng(`${SEED}/lib/${name}`);
    const layer = Math.floor((i * layers) / libCount);
    const lib = { name, group, runner: group === 'ct' ? 'cypress' : 'vitest', domain, layer, root: `libs/${group}/${name}`, tier: tiers[group][k], deps: [] };
    if (layer > 0) {
      const want = r.int(0, 2);
      for (let attempt = 0; attempt < 20 && lib.deps.length < want; attempt++) {
        const l = r.bool(0.6) ? layer - 1 : r.int(0, layer - 1);
        const cand = r.pick(byLayer[l]);
        if (cand && !lib.deps.includes(cand)) lib.deps.push(cand);
      }
    }
    const tier = SPEC_TIERS[lib.tier];
    lib.targets = specSeconds(r.fork('targets'), r.int(tier.min, tier.max), SPEC_SECONDS[lib.runner]);
    libs.push(lib);
    byLayer[layer].push(lib);
  });
  const apps = [];
  for (let j = 0; j < mix.apps; j++) {
    const cfg = APPS[j % APPS.length];
    const name = `${cfg.name}-${pad4(j)}`;
    const r = createRng(`${SEED}/app/${name}`);
    const want = Math.min(libs.length, r.int(2, 4));
    const imports = r.shuffle(libs).slice(0, want).sort((a, b) => (a.name < b.name ? -1 : 1));
    const tier = SPEC_TIERS[tiers.e2e[j]];
    apps.push({ name, title: cfg.title, domain: domainByKey(cfg.domain), catalog: cfg.catalog, imports, targets: specSeconds(r.fork('targets'), r.int(tier.min, tier.max), SPEC_SECONDS.playwright) });
  }
  return { n, mix, layers, libs, apps };
}

// ------------------------------------------------------------------ files
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** `import { <Entity>Table as <alias> } from '@bench/<dep>'` for each dep + an exported map. */
function importsModule(deps, exportName, header) {
  const lines = deps.map((d) => `import { ${d.domain.entity}Table as ${camel(d.name)}Table } from '@bench/${d.name}';`);
  return `${header}\n${lines.join('\n')}\n\nexport const ${exportName} = {\n${deps.map((d) => `  '${d.name}': ${camel(d.name)}Table,`).join('\n')}\n} as const;\n`;
}

export function rootFilesFor(model) {
  const base = rootFiles();
  const files = {
    'package.json': base['package.json'], // identical to the main workspaces: same lockfile importer
    '.gitignore': base['.gitignore'],
    'tools/free-port.mjs': base['tools/free-port.mjs'],
  };
  files['pnpm-workspace.yaml'] = `# No workspace packages: projects are Nx projects (project.json) wired with TS path aliases,
# so the lockfile is the same for every size and variant.
allowBuilds:
  '@swc/core': true
  cypress: true
  esbuild: true
  nx: true
`;
  files['.npmrc'] = `# Keep resolution inside this workspace (never hoist to a parent directory).
auto-install-peers=true
`;
  const tsBase = JSON.parse(rootFiles()['tsconfig.base.json']);
  const paths = { '@bench/shared-ui': tsPath('libs/shared-ui') };
  for (const lib of model.libs) paths[`@bench/${lib.name}`] = tsPath(lib.root);
  tsBase.compilerOptions.baseUrl = '.';
  tsBase.compilerOptions.paths = paths;
  files['tsconfig.base.json'] = json(tsBase);
  const m = model.mix;
  files['README.md'] = `# Nx size-sweep workspace (generated)

Generated by \`generator/size.mjs\` in the nx-atomization-vs-sharding repo. Do not edit by hand.
${model.n} projects + \`libs/shared-ui\`: ${m.ct} Cypress CT libs (\`libs/ct/*\`), ${m.unit} Vitest libs
(\`libs/unit/*\`), ${m.apps} Vite apps and ${m.e2e} Playwright e2e projects (\`apps/*\`). Libs form a
${model.layers}-layer DAG through the \`@bench/*\` path aliases in \`tsconfig.base.json\`.

Git tags: \`base\` (initial) and \`full\` (touches shared-ui: everything affected). \`main\` stays at \`base\`.
Run atomized/sharded CI targets with \`NX_SKIP_ATOMIZER_VALIDATION=true\`.
`;
  return files;
}

/**
 * Render the workspace project by project and hand every file to `emit(rel, content)`.
 * Returns per-project spec metadata ({path, bytes}) for the plan.
 */
export function renderWorkspace(model, emit, { calibration }) {
  for (const [k, v] of Object.entries(rootFilesFor(model))) emit(k, v);
  for (const [k, v] of Object.entries(sharedUiFiles({ projectJson: true }))) emit(k, v);
  const projects = [];
  const specMeta = (root, files, specs) => specs.map((s) => ({ path: s.path, bytes: Buffer.byteLength(files[`${root}/${s.path}`]), target: s.target }));
  for (const lib of model.libs) {
    const out = libFiles({
      runner: lib.runner,
      name: lib.name,
      domain: lib.domain,
      targets: lib.targets,
      rng: createRng(`${SEED}/lib/${lib.name}`).fork('specs'),
      model: calibration[lib.runner],
      fixtureRows: FIXTURE_ROWS,
      packageJson: false,
      aliases: true,
    });
    const files = out.files;
    const project = files[`${lib.root}/project.json`];
    files[`${lib.root}/project.json`] = json({ ...JSON.parse(project), tags: [...JSON.parse(project).tags, `layer:${lib.layer}`] });
    if (lib.deps.length) {
      files[`${lib.root}/src/lib/integrations.ts`] = importsModule(lib.deps, 'INTEGRATIONS', '// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project\n// dependencies from these imports through the tsconfig.base.json path aliases).');
      files[`${lib.root}/src/index.ts`] += `export * from './lib/integrations';\n`;
    }
    for (const [k, v] of Object.entries(files)) emit(k, v);
    const specs = specMeta(lib.root, files, out.specs);
    assertNoSubstringPaths(lib.name, specs);
    projects.push({ name: lib.name, root: lib.root, runner: lib.runner, layer: lib.layer, deps: lib.deps.map((d) => d.name), specs });
  }
  for (const [appIndex, app] of model.apps.entries()) {
    const rows = makeRows(createRng(`${SEED}/catalog/${app.name}`), app.domain, app.catalog);
    const servePort = process.env.SIZE_E2E_SERVER === 'shared' ? 4300 + appIndex : undefined;
    const a = appFiles({ name: app.name, title: app.title, domain: app.domain, rows, packageJson: false, aliases: true, servePort });
    a.files[`${a.root}/src/features.ts`] = importsModule(app.imports, 'FEATURES', '// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).');
    for (const [k, v] of Object.entries(a.files)) emit(k, v);
    const e = e2eFiles({ app: app.name, title: app.title, domain: app.domain, rows, targets: app.targets, rng: createRng(`${SEED}/e2e/${app.name}`), model: calibration.playwright, packageJson: false, servePort });
    for (const [k, v] of Object.entries(e.files)) emit(k, v);
    const specs = specMeta(e.root, e.files, e.specs);
    assertNoSubstringPaths(e.name, specs);
    projects.push({ name: app.name, root: a.root, runner: null, deps: app.imports.map((d) => d.name), specs: [] });
    projects.push({ name: e.name, root: e.root, runner: 'playwright', app: app.name, specs });
  }
  return projects;
}

/** Vitest/Playwright CLI filters are substring matches: no spec path may contain another of its project. */
function assertNoSubstringPaths(name, specs) {
  for (const a of specs) for (const b of specs) if (a !== b && b.path.includes(a.path)) throw new Error(`${name}: ${a.path} is a substring of ${b.path}`);
}

// ------------------------------------------------------------------ plan
export async function planTotals(model, projects, { shardTarget = DEFAULT_SHARD_TARGET } = {}) {
  const { planShards, DEFAULT_MAX_SHARDS } = await import(join(SHARD_PLUGIN_SRC, 'core.ts'));
  const spk = {
    cypress: (await import(join(SHARD_PLUGIN_SRC, 'cypress-ct.ts'))).CYPRESS_CT_SECONDS_PER_KB,
    playwright: (await import(join(SHARD_PLUGIN_SRC, 'playwright.ts'))).PLAYWRIGHT_SECONDS_PER_KB,
    vitest: (await import(join(SHARD_PLUGIN_SRC, 'vitest.ts'))).VITEST_SECONDS_PER_KB,
  };
  const byRunner = {};
  for (const r of ['cypress', 'vitest', 'playwright']) {
    const ps = projects.filter((p) => p.runner === r);
    const specs = ps.flatMap((p) => p.specs);
    let shards = 0;
    let shardedProjects = 0;
    let delegated = 0;
    const hist = {};
    for (const p of ps) {
      const plan = planShards(p.specs, { secondsPerKb: spk[r], targetShardSeconds: shardTarget, maxShards: DEFAULT_MAX_SHARDS });
      const k = plan.sharded ? plan.shardCount : 1;
      hist[k] = (hist[k] ?? 0) + 1;
      if (plan.sharded) {
        shardedProjects++;
        shards += plan.shardCount;
      } else delegated++;
    }
    const tierHist = {};
    for (const p of ps) {
      const n = p.specs.length;
      const t = SPEC_TIERS.find((x) => n >= x.min && n <= x.max) ?? SPEC_TIERS[SPEC_TIERS.length - 1];
      const key = `${t.min}-${t.max}`;
      tierHist[key] = (tierHist[key] ?? 0) + 1;
    }
    byRunner[r] = {
      projects: ps.length,
      specs: specs.length,
      specsPerProject: { mean: Number((specs.length / Math.max(1, ps.length)).toFixed(2)), hist: tierHist },
      estimatedSpecSeconds: Math.round(specs.reduce((s, x) => s + x.target, 0)),
      specBytes: specs.reduce((s, x) => s + x.bytes, 0),
      shard: { secondsPerKb: spk[r], shardedProjects, shards, delegated, shardsPerProjectHist: hist },
    };
  }
  const R = Object.values(byRunner);
  const testProjects = R.reduce((s, x) => s + x.projects, 0);
  const specs = R.reduce((s, x) => s + x.specs, 0);
  const shards = R.reduce((s, x) => s + x.shard.shards, 0);
  const delegated = R.reduce((s, x) => s + x.shard.delegated, 0);
  const builds = model.mix.apps; // e2e targets depend on ^build
  return {
    projects: model.n,
    mix: model.mix,
    layers: model.layers,
    depEdges: model.libs.reduce((s, l) => s + l.deps.length, 0),
    appImports: model.apps.reduce((s, a) => s + a.imports.length, 0),
    specs,
    byRunner,
    shardTarget,
    // Tasks of `nx affected -t <ct>,<e2e>,<unit>` on the `full` tag (everything affected).
    variants: {
      baseline: { tasks: testProjects + builds, real: testProjects + builds },
      atomized: { tasks: specs + testProjects + builds, real: specs + builds, atoms: specs, noopParents: testProjects },
      sharded: { tasks: shards + delegated + testProjects + builds, real: shards + delegated + builds, shards, delegated, noopParents: testProjects },
    },
  };
}

export function printTotals(t) {
  const r = t.byRunner;
  const line = (k, x) =>
    `  ${k.padEnd(10)} ${String(x.projects).padStart(4)} projects, ${String(x.specs).padStart(5)} specs (mean ${x.specsPerProject.mean}; ${Object.entries(x.specsPerProject.hist).map(([a, b]) => `${a}:${b}`).join(' ')}), ~${x.estimatedSpecSeconds}s spec work, ` +
    `${(x.specBytes / 1e6).toFixed(2)} MB; shards@${t.shardTarget}s: ${x.shard.shards} in ${x.shard.shardedProjects} projects (${Object.entries(x.shard.shardsPerProjectHist).map(([a, b]) => `${a}×${b}`).join(' ')})`;
  const v = t.variants;
  console.log(
    `N=${t.projects}: ${t.mix.ct} CT + ${t.mix.unit} Vitest libs + ${t.mix.apps} apps + ${t.mix.e2e} e2e; ${t.layers} layers, ${t.depEdges} lib->lib edges, ${t.appImports} app->lib edges; ${t.specs} specs\n` +
      `${line('cypress', r.cypress)}\n${line('vitest', r.vitest)}\n${line('playwright', r.playwright)}\n` +
      `  tasks: baseline ${v.baseline.tasks} | atomized ${v.atomized.tasks} (${v.atomized.atoms} atoms + ${v.atomized.noopParents} noop parents + ${t.mix.apps} builds) | ` +
      `sharded ${v.sharded.tasks} (${v.sharded.shards} shards + ${v.sharded.delegated} delegated + ${v.sharded.noopParents} noop parents + ${t.mix.apps} builds)`,
  );
}

// ------------------------------------------------------------------ fs + process helpers
function run(cmd, argv, opts = {}) {
  return execFileSync(cmd, argv, { stdio: opts.capture ? 'pipe' : 'inherit', encoding: 'utf8', maxBuffer: 64 * 2 ** 20, ...opts });
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

function pnpmInstall(dir, frozen) {
  // Explicit --dir: pnpm must never treat a parent directory ($HOME has a package.json and
  // node_modules) as the workspace root.
  const env = { ...process.env, CI: 'true', npm_config_workspace_dir: dir };
  delete env.npm_config_global;
  run('pnpm', ['install', '--dir', dir, frozen ? '--frozen-lockfile' : '--no-frozen-lockfile', '--prefer-offline', '--reporter=append-only'], { cwd: dir, env, capture: true });
}

/** Every runner and Nx plugin must resolve inside the workspace, never from a parent node_modules. */
function verifyLocalResolution(dir) {
  const mods = ['nx', '@nx/cypress', '@nx/playwright', '@nx/vitest', '@nx/js', 'cypress', '@playwright/test', 'vitest', 'vite', 'react', 'react-dom', '@vitejs/plugin-react', 'typescript', 'jsdom'];
  const script = `const r = require('node:module').createRequire(${JSON.stringify(join(dir, 'package.json'))});
const fs = require('node:fs');
for (const m of ${JSON.stringify(mods)}) {
  // Node's own lookup order (some packages don't export ./package.json): first node_modules hit wins.
  const hit = r.resolve.paths(m).map((d) => d + '/' + m + '/package.json').find((f) => fs.existsSync(f));
  if (!hit) throw new Error('cannot resolve ' + m);
  const p = fs.realpathSync(hit);
  console.log(m + '@' + JSON.parse(fs.readFileSync(p, 'utf8')).version + ' ' + p);
}`;
  const out = run('node', ['-e', script], { cwd: dir, capture: true }).trim().split('\n');
  for (const line of out) {
    const p = line.split(' ')[1];
    if (!p.startsWith(dir + '/')) throw new Error(`${dir}: ${line} resolves outside the workspace`);
  }
  const nxVersion = run('pnpm', ['exec', 'nx', '--version'], { cwd: dir, capture: true, env: { ...process.env, NX_DAEMON: 'false', NX_NO_CLOUD: 'true' } }).trim().replace(/\s+/g, ' ');
  if (!/Local: v23\.3\.0/.test(nxVersion) || !/Global: Not found/.test(nxVersion)) throw new Error(`${dir}: unexpected nx --version: ${nxVersion}`);
  return { modules: out.map((l) => l.split(' ')[0]), nxVersion };
}

function copyShardPlugin(dir) {
  const dest = join(dir, 'tools', 'shard-plugin', 'src');
  mkdirSync(dest, { recursive: true });
  cpSync(SHARD_PLUGIN_SRC, dest, { recursive: true, filter: (src) => !/\.(spec|test)\.ts$/.test(src) && !src.includes('node_modules') });
}

/** Writes each file into every target dir, creating directories once. */
function multiWriter(dirs) {
  const made = new Set();
  let files = 0;
  let bytes = 0;
  const emit = (rel, content) => {
    files++;
    bytes += Buffer.byteLength(content);
    const sub = dirname(rel);
    for (const d of dirs) {
      const absDir = join(d, sub);
      if (!made.has(absDir)) {
        mkdirSync(absDir, { recursive: true });
        made.add(absDir);
      }
      writeFileSync(join(d, rel), content);
    }
  };
  return { emit, stats: () => ({ files, bytes }) };
}

export const workspaceDir = (out, variant, n) => join(out, `${variant}-${n}`);
const isGenerated = (dir) => existsSync(join(dir, '.git')) && existsSync(join(dir, 'node_modules', '.modules.yaml'));

/**
 * Generate the missing variants of size N (all variants share one rendering pass).
 * Returns {plan, timings}.
 */
export async function generateSize({ n, variants = SIZE_VARIANTS, out = DEFAULT_SIZE_DIR, force = false, install = true, shardTarget = DEFAULT_SHARD_TARGET, log = console.log }) {
  const calibration = JSON.parse(readFileSync(join(GEN_DIR, 'calibration.json'), 'utf8'));
  const todo = variants.filter((v) => force || !isGenerated(workspaceDir(out, v, n)));
  for (const v of variants) if (!todo.includes(v)) log(`${v}-${n}: exists (${workspaceDir(out, v, n)}), skipped (use --force to regenerate)`);
  const timings = {};
  let t = Date.now();
  const model = buildModel(n);
  const dirs = todo.map((v) => workspaceDir(out, v, n));
  for (const dir of dirs) {
    if (existsSync(dir)) {
      for (const entry of readdirSync(dir)) if (entry !== 'node_modules') rmSync(join(dir, entry), { recursive: true, force: true });
    } else mkdirSync(dir, { recursive: true });
  }
  const writer = multiWriter(dirs);
  const projects = renderWorkspace(model, writer.emit, { calibration });
  timings.renderWriteS = (Date.now() - t) / 1000;
  const plan = await planTotals(model, projects, { shardTarget });
  plan.files = writer.stats().files;
  plan.sourceBytes = writer.stats().bytes;
  if (!todo.length) return { plan, timings, generated: [] };

  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, `plan-${n}.json`), json({ seed: SEED, ...plan, projectList: projects.map((p) => ({ name: p.name, runner: p.runner, layer: p.layer, deps: p.deps, specs: p.specs.length, specBytes: p.specs.reduce((s, x) => s + x.bytes, 0) })) }));
  const full = sharedUiFiles({ buttonSize: true, projectJson: true });
  const baseUi = sharedUiFiles({ projectJson: true });
  const fullChange = Object.fromEntries(Object.entries(full).filter(([k, v]) => baseUi[k] !== v));

  for (const variant of todo) {
    const dir = workspaceDir(out, variant, n);
    const vt = (timings[variant] = {});
    writeFileSync(join(dir, 'nx.json'), nxJson(variant, { sharedServer: process.env.SIZE_E2E_SERVER === 'shared' }));
    if (variant === 'sharded') copyShardPlugin(dir);
    t = Date.now();
    const haveLock = existsSync(SIZE_LOCKFILE);
    copyFileSync(haveLock ? SIZE_LOCKFILE : SEED_LOCKFILE, join(dir, 'pnpm-lock.yaml'));
    if (install) {
      pnpmInstall(dir, haveLock);
      if (!haveLock) {
        mkdirSync(dirname(SIZE_LOCKFILE), { recursive: true });
        copyFileSync(join(dir, 'pnpm-lock.yaml'), SIZE_LOCKFILE);
        log(`lockfile resolved once from ${SEED_LOCKFILE} and saved to ${SIZE_LOCKFILE}`);
      }
      const res = verifyLocalResolution(dir);
      log(`${variant}-${n}: resolution OK (${res.modules.length} packages inside the workspace), nx ${res.nxVersion}`);
    }
    vt.installS = (Date.now() - t) / 1000;
    t = Date.now();
    git(dir, ['init', '-q']);
    git(dir, ['add', '-A']);
    git(dir, ['commit', '-q', '-m', `Size-sweep workspace: ${n} projects (${variant})`], '2026-01-01T10:00:00Z');
    git(dir, ['tag', 'base']);
    git(dir, ['checkout', '-q', '-b', 'stage-full']);
    for (const [k, v] of Object.entries(fullChange)) writeFileSync(join(dir, k), v);
    git(dir, ['add', '-A']);
    git(dir, ['commit', '-q', '-m', 'feat(shared-ui): add a size prop to Button'], '2026-01-01T11:00:00Z');
    git(dir, ['tag', 'full']);
    git(dir, ['checkout', '-q', 'main']);
    git(dir, ['branch', '-q', '-D', 'stage-full']);
    vt.gitS = (Date.now() - t) / 1000;
    const sha = (x) => git(dir, ['rev-parse', '--short', x]).trim();
    log(`${variant}-${n}: base=${sha('base')} full=${sha('full')} (install ${vt.installS.toFixed(1)}s, git ${vt.gitS.toFixed(1)}s)`);
  }
  log(`N=${n}: rendered + wrote ${plan.files} files × ${todo.length} variant(s) in ${timings.renderWriteS.toFixed(1)}s`);
  return { plan, timings, generated: todo };
}

// ------------------------------------------------------------------ main
async function main() {
  const { values } = parseArgs({
    options: {
      projects: { type: 'string' },
      variant: { type: 'string', default: 'all' },
      out: { type: 'string', default: DEFAULT_SIZE_DIR },
      force: { type: 'boolean', default: false },
      'no-install': { type: 'boolean', default: false },
      'shard-target': { type: 'string', default: String(DEFAULT_SHARD_TARGET) },
      plan: { type: 'boolean', default: false },
    },
  });
  const sizes = (values.projects ?? (values.plan ? DEFAULT_SIZES.join(',') : '')).split(',').filter(Boolean).map(Number);
  if (!sizes.length) throw new Error('usage: node generator/size.mjs --projects N[,N...] [--variant baseline|atomized|sharded|all] [--out dir] [--force] [--no-install] | --plan');
  const variants = values.variant === 'all' ? SIZE_VARIANTS : values.variant.split(',');
  for (const v of variants) if (!SIZE_VARIANTS.includes(v)) throw new Error(`unknown variant ${v}`);
  const shardTarget = Number(values['shard-target']);
  const out = resolve(values.out);
  const calibration = JSON.parse(readFileSync(join(GEN_DIR, 'calibration.json'), 'utf8'));

  for (const n of sizes) {
    if (values.plan) {
      const t = Date.now();
      const model = buildModel(n);
      let files = 0;
      let bytes = 0;
      const projects = renderWorkspace(model, (rel, c) => {
        files++;
        bytes += Buffer.byteLength(c);
      }, { calibration });
      const plan = await planTotals(model, projects, { shardTarget });
      printTotals(plan);
      console.log(`  ${files} files, ${(bytes / 1e6).toFixed(1)} MB per workspace (rendered in ${((Date.now() - t) / 1000).toFixed(1)}s)`);
      continue;
    }
    const { plan } = await generateSize({ n, variants, out, force: values.force, install: !values['no-install'], shardTarget });
    printTotals(plan);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.stack ?? e);
    process.exit(1);
  });
}
