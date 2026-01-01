import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const ci = !!process.env.CI;

// Projects are not pnpm workspace packages: @bench/* imports resolve through these aliases,
// which mirror the path aliases of tsconfig.base.json.
const workspaceRoot = join(__dirname, '../../..');
const benchAliases = [
  { find: /^@bench\/shared-ui$/, replacement: `${workspaceRoot}/libs/shared-ui/src/index.ts` },
  { find: /^@bench\/(ct|unit)-([^/]+)$/, replacement: `${workspaceRoot}/libs/$1/$1-$2/src/index.ts` },
];

export default defineConfig({
  plugins: [react()],
  resolve: { alias: benchAliases },
  test: {
    name: 'unit-asset-0017',
    environment: 'jsdom',
    include: ['src/**/*.spec.tsx'],
    setupFiles: ['./src/test-setup.ts'],
    // Fairness rule: in CI a Vitest process uses one worker and runs files serially, so the
    // only parallelism knob in the benchmark is Nx --parallel (same for every workspace).
    maxWorkers: ci ? 1 : undefined,
    fileParallelism: !ci,
    // Concurrent Vitest processes of one project (atoms or shards) would race on the shared
    // results cache (node_modules/.vite/vitest/results.json), which only reorders files anyway.
    cache: false,
    reporters: [['default', { summary: false }]],
  },
});
