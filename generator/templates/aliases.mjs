// Vite `resolve.alias` entries for workspaces whose projects are not package-manager
// workspace packages (generator/size.mjs): there `@bench/*` imports resolve through the TS
// path aliases of tsconfig.base.json (which Nx uses for the project graph), mirrored here for
// Vite (Cypress CT dev server, Vitest, app builds). The main workspaces (generator/generate.mjs)
// link projects as pnpm workspace packages instead and never use this.
//
// Project roots: libs/shared-ui, libs/ct/ct-<x>, libs/unit/unit-<x> (project name = dir name).

/** `import { join } from 'node:path'` must be in scope. `relToRoot`: config dir -> workspace root. */
export function aliasDeclaration(relToRoot) {
  return `// Projects are not pnpm workspace packages: @bench/* imports resolve through these aliases,
// which mirror the path aliases of tsconfig.base.json.
const workspaceRoot = join(__dirname, '${relToRoot}');
const benchAliases = [
  { find: /^@bench\\/shared-ui$/, replacement: \`\${workspaceRoot}/libs/shared-ui/src/index.ts\` },
  { find: /^@bench\\/(ct|unit)-([^/]+)$/, replacement: \`\${workspaceRoot}/libs/$1/$1-$2/src/index.ts\` },
];
`;
}

/** tsconfig.base.json `paths` entry for one project root (`libs/...`). */
export function tsPath(root) {
  return [`${root}/src/index.ts`];
}
