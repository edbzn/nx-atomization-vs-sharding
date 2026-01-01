/**
 * Shards Playwright e2e tests (`*.spec.ts`) of projects with a `playwright.config.ts` next
 * to their `project.json`. Small projects delegate to the whole-project target inferred by
 * @nx/playwright (`delegateTarget`, e.g. `e2e`).
 *
 * Every shard (and the CI target) depends on `^build`: the e2e project depends on its app
 * through implicitDependencies, and each task serves the built app itself via the config's
 * `webServer` (`vite preview` on a free port), so shards can run concurrently.
 */
import { createShardNodes, quoteArg, type RunnerDefinition } from './core.ts';

/**
 * Estimated CI seconds per KB of `.spec.ts` source. Calibrated from a measured run:
 * measured task time of the largest project / its spec KB (shop-e2e: 126.7s `e2e` task / 901 KB). Override per workspace with the
 * `secondsPerKb` plugin option.
 */
export const PLAYWRIGHT_SECONDS_PER_KB = 0.14;

/**
 * Per-shard `--output` (like @nx/playwright's atoms): concurrent shards of one project
 * would otherwise share, and clear on startup, the same `test-results` dir.
 */
const outputDir = (index: number, count: number): string => `test-results/shard-${index}-of-${count}`;

export const playwrightRunner: RunnerDefinition = {
  technology: 'playwright',
  label: 'Playwright tests',
  configGlob: '**/playwright.config.ts',
  specSuffix: '.spec.ts',
  externalDependency: '@playwright/test',
  defaultSecondsPerKb: PLAYWRIGHT_SECONDS_PER_KB,
  command: (paths, { index, count }) =>
    `playwright test ${paths.map(quoteArg).join(' ')} --output=${outputDir(index, count)}`,
  outputs: ({ index, count }) => [`{projectRoot}/${outputDir(index, count)}`],
  extraDependsOn: ['^build'],
};

export const createNodesV2 = createShardNodes(playwrightRunner);
/** Nx 23 prefers `createNodes` (same signature) and falls back to `createNodesV2`. */
export const createNodes = createNodesV2;
