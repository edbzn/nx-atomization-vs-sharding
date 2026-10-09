import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BENCH_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_DIR = resolve(BENCH_DIR, '..');
export const WORKSPACES_DIR = process.env.BENCH_WORKSPACES_DIR ?? join(REPO_DIR, 'workspaces');
export const RESULTS_DIR = join(REPO_DIR, 'results');
export const RAW_DIR = join(RESULTS_DIR, 'raw');

export const RUNNERS = ['ct', 'e2e', 'unit'];

/** Baseline (whole-project) target per runner. */
export const BASE_TARGETS = { ct: 'component-test', e2e: 'e2e', unit: 'test' };
/** CI (atomized / sharded parent) target per runner. */
export const CI_TARGETS = { ct: 'component-test-ci', e2e: 'e2e-ci', unit: 'test-ci' };

/** Which target names `nx affected -t` gets for a workspace + runner selection. */
export function targetsFor(workspace, runner) {
  const runners = runner === 'all' ? RUNNERS : [runner];
  for (const r of runners) if (!BASE_TARGETS[r]) throw new Error(`unknown runner "${r}" (ct|e2e|unit|all)`);
  const map = workspace === 'baseline' ? BASE_TARGETS : CI_TARGETS;
  return runners.map((r) => map[r]);
}

/**
 * Classify a task target: runner kind (ct|e2e|unit|build|other), whether it is an atom
 * (`<ci-target>--<file>` / `<ci-target>--shard-i-of-n`), the parent CI target, or a
 * whole-project target.
 */
export function classifyTarget(target) {
  const [head, ...rest] = target.split('--');
  const base = head.replace(/-ci$/, '');
  let kind = 'other';
  if (base === 'component-test') kind = 'ct';
  else if (base === 'e2e') kind = 'e2e';
  else if (base === 'test') kind = 'unit';
  else if (base === 'build') kind = 'build';
  const isAtom = rest.length > 0;
  const isCiParent = !isAtom && head.endsWith('-ci');
  return { kind, isAtom, isCiParent, atom: isAtom ? rest.join('--') : null };
}

/**
 * Env for every nx invocation. Inherited NX_* vars are stripped first so a stray shell
 * setting can't skew a run.
 *
 * NX_WORKSPACE_DATA_DIRECTORY / NX_CACHE_DIRECTORY pin Nx's data inside the workspace: Nx 23.3
 * otherwise moves the cache AND the workspace DB (which holds task history, used by the
 * local scheduler to order tasks longest-first) to a per-user shared dir
 * ~/.nx/<sha(repo identity)>/{cache,databases}, which our per-rep cleanup would not see
 * (utils/cache-directory.js computeSharedDataLocation: any of these env vars -> share 'none').
 */
export function nxEnv(ws, extra = {}) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (k.startsWith('NX_') || k === 'GITHUB_ACTIONS' || k === 'GITHUB_STEP_SUMMARY') continue;
    env[k] = v;
  }
  return {
    ...env,
    CI: 'true',
    NX_TUI: 'false',
    NX_DAEMON: 'false',
    NX_NO_CLOUD: 'true',
    // Nx 23.3 refuses to run native atomized parent targets (e2e-ci, ...) without Nx Cloud.
    NX_SKIP_ATOMIZER_VALIDATION: 'true',
    NX_WORKSPACE_DATA_DIRECTORY: join(ws, '.nx', 'workspace-data'),
    NX_CACHE_DIRECTORY: join(ws, '.nx', 'cache'),
    FORCE_COLOR: '0',
    ...extra,
  };
}
