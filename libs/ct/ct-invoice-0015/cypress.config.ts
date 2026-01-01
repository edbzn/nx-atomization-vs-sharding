import { rmSync } from 'node:fs';
import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'cypress';

// Projects are not pnpm workspace packages: @bench/* imports resolve through these aliases,
// which mirror the path aliases of tsconfig.base.json.
const workspaceRoot = join(__dirname, '../../..');
const benchAliases = [
  { find: /^@bench\/shared-ui$/, replacement: `${workspaceRoot}/libs/shared-ui/src/index.ts` },
  { find: /^@bench\/(ct|unit)-([^/]+)$/, replacement: `${workspaceRoot}/libs/$1/$1-$2/src/index.ts` },
];

// Every Cypress process gets its own Vite cache dir: concurrent Nx tasks of the same project
// (atoms or shards) would otherwise race on one dependency-optimizer cache. Each process thus
// starts with a cold optimizer, like a fresh CI agent. The dir is removed after the run.
const cacheDir = join(__dirname, '../../../node_modules/.vite', `ct-ct-invoice-0015-${process.pid}`);

export default defineConfig({
  allowCypressEnv: false,
  video: false,
  screenshotOnRunFailure: false,
  // Cypress always runs one spec at a time per process; Nx --parallel is the only
  // concurrency knob in this benchmark.
  component: {
    specPattern: 'src/**/*.cy.tsx',
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        configFile: false,
        plugins: [react()],
        cacheDir,
        logLevel: 'warn',
        resolve: { alias: benchAliases },
        optimizeDeps: {
          include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-dev-runtime', 'cypress/react'],
        },
      },
    },
    setupNodeEvents(on) {
      on('after:run', () => {
        rmSync(cacheDir, { recursive: true, force: true });
      });
    },
  },
});
