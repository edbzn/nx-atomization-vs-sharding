/**
 * Shards Vitest unit tests (`*.spec.tsx`) of projects with a `vitest.config.ts` (or `.mts`)
 * next to their `project.json`. Small projects delegate to the whole-project target
 * inferred by @nx/vitest (`delegateTarget`, e.g. `test`).
 *
 * Vitest CLI filters are substring matches on the path relative to the project root (as
 * with @nx/vitest's atoms), so `src/a.spec.tsx` would also select `x/src/a.spec.tsx`.
 */
import { createShardNodes, quoteArg, type RunnerDefinition } from './core.ts';

/**
 * Estimated CI seconds per KB of `.spec.tsx` source. Calibrated like the production plugin:
 * measured task time of the largest project / its spec KB (unit-vehicle: 110.5s `test` task / 1154 KB). Override per workspace with the
 * `secondsPerKb` plugin option.
 */
export const VITEST_SECONDS_PER_KB = 0.095;

export const vitestRunner: RunnerDefinition = {
  technology: 'vitest',
  label: 'Vitest tests',
  configGlob: '**/vitest.config.{ts,mts}',
  specSuffix: '.spec.tsx',
  externalDependency: 'vitest',
  defaultSecondsPerKb: VITEST_SECONDS_PER_KB,
  command: (paths) => `vitest run ${paths.map(quoteArg).join(' ')}`,
};

export const createNodesV2 = createShardNodes(vitestRunner);
/** Nx 23 prefers `createNodes` (same signature) and falls back to `createNodesV2`. */
export const createNodes = createNodesV2;
