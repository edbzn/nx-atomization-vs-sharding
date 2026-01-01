import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Projects are not pnpm workspace packages: @bench/* imports resolve through these aliases,
// which mirror the path aliases of tsconfig.base.json.
const workspaceRoot = join(__dirname, '../..');
const benchAliases = [
  { find: /^@bench\/shared-ui$/, replacement: `${workspaceRoot}/libs/shared-ui/src/index.ts` },
  { find: /^@bench\/(ct|unit)-([^/]+)$/, replacement: `${workspaceRoot}/libs/$1/$1-$2/src/index.ts` },
];

export default defineConfig({
  plugins: [react()],
  resolve: { alias: benchAliases },
  logLevel: 'warn',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    reportCompressedSize: false,
  },
});
