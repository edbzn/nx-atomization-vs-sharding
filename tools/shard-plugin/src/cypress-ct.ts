/**
 * Shards Cypress component tests (`*.cy.tsx`) of projects with a `cypress.config.ts` next
 * to their `project.json`. Small projects delegate to the whole-project target inferred by
 * @nx/cypress (`delegateTarget`, e.g. `component-test`).
 */
import { createShardNodes, quoteArg, type RunnerDefinition } from './core.ts';

/**
 * Estimated CI seconds per KB of `.cy.tsx` source. Calibrated from a measured run:
 * measured task time of the largest project / its spec KB (ct-booking: 205.6s `component-test` task / 300 KB). Override per workspace with the
 * `secondsPerKb` plugin option.
 */
export const CYPRESS_CT_SECONDS_PER_KB = 0.7;

export const cypressCtRunner: RunnerDefinition = {
  technology: 'cypress',
  label: 'Cypress component tests',
  configGlob: '**/cypress.config.ts',
  specSuffix: '.cy.tsx',
  externalDependency: 'cypress',
  defaultSecondsPerKb: CYPRESS_CT_SECONDS_PER_KB,
  command: (paths) => `cypress run --component --spec ${quoteArg(paths.join(','))}`,
};

export const createNodesV2 = createShardNodes(cypressCtRunner);
/** Nx 23 prefers `createNodes` (same signature) and falls back to `createNodesV2`. */
export const createNodes = createNodesV2;
