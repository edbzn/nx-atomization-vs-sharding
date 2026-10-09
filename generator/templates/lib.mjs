// Domain library projects: `libs/ct/<name>` (Cypress component tests) and
// `libs/unit/<name>` (Vitest + jsdom + Testing Library).

import { kebab, makeRows } from '../lib/domain.mjs';
import { PLANNERS } from '../lib/scenarios.mjs';
import { componentDirs, componentNames, libComponentFiles } from './lib-components.mjs';
import { ctSpecFile, emitCtBlock } from './ct-spec.mjs';
import { emitUnitBlock, unitSpecFile } from './unit-spec.mjs';
import { estimate } from '../lib/cost.mjs';

const KINDS = ['table', 'form', 'tags', 'wizard', 'board'];
const TOPICS = {
  table: ['filtering', 'sorting', 'pagination', 'search', 'columns', 'large-dataset', 'empty-results', 'navigation'],
  form: ['validation', 'submission', 'editing', 'required-fields', 'email', 'amount', 'notes', 'error-summary'],
  tags: ['adding', 'duplicates', 'removal', 'normalization', 'limits', 'keyboard', 'clearing'],
  wizard: ['happy-path', 'validation', 'navigation', 'review', 'tags-step', 'back-and-forth'],
  board: ['workflow', 'filtering', 'moving-cards', 'deleting', 'duplicates', 'summary', 'columns'],
};

function json(o) {
  return JSON.stringify(o, null, 2) + '\n';
}

function specNames(domain) {
  const n = componentNames(domain);
  return {
    ...n,
    rowType: `${domain.entity}Row`,
    saveLabel: `Save ${domain.entity.toLowerCase()}`,
    createLabel: `Create ${domain.entity.toLowerCase()}`,
  };
}

/**
 * Build the spec files of one lib. Every spec has a runtime target (seconds); `it` blocks are
 * added until the cost model says the target is reached, so spec size tracks spec runtime.
 */
function buildSpecs({ runner, rng, domain, targets, model }) {
  const names = specNames(domain);
  const dirs = componentDirs(domain);
  const emit = runner === 'cypress' ? emitCtBlock : emitUnitBlock;
  const file = runner === 'cypress' ? ctSpecFile : unitSpecFile;
  const ext = runner === 'cypress' ? '.cy.tsx' : '.spec.tsx';
  const kinds = rng.shuffle(KINDS);
  const usedTopics = {};
  const specs = [];
  targets.forEach((target, i) => {
    const kind = kinds[i % kinds.length];
    const topicList = TOPICS[kind];
    const used = (usedTopics[kind] ??= 0);
    usedTopics[kind]++;
    const topic = used < topicList.length ? topicList[used] : `${topicList[used % topicList.length]}-${Math.floor(used / topicList.length) + 1}`;
    const base = kind === 'tags' ? 'tag-editor' : kebab(names[kind]);
    const path = `${dirs[kind]}/${base}.${topic}${ext}`;
    // Table specs share one row fixture per file (blocks use a prefix of it).
    const fixture = kind === 'table' ? makeRows(rng.fork(`${path}#rows`), domain, rng.int(24, 44), rng.int(0, 400)) : undefined;
    const blocks = [];
    let est = estimate(model, { spec: 1, rows: fixture?.length ?? 0 });
    let j = 0;
    while (blocks.length === 0 || est < target * 0.97) {
      const remaining = Math.max(target - est, 0.05);
      let size = rng.int(3, 12);
      let block;
      for (let attempt = 0; attempt < 6; attempt++) {
        const plan = PLANNERS[kind](rng.fork(`${path}#${j}.${attempt}`), domain, size, fixture);
        block = emit(plan, names);
        const c = estimate(model, block.cost);
        if (c <= remaining * 1.25 || size === 1) break;
        size = Math.max(1, Math.floor((size * remaining) / c));
      }
      blocks.push(block);
      est += estimate(model, block.cost);
      j++;
      if (j > 400) throw new Error(`runaway spec ${path}`);
    }
    const cost = blocks.reduce((acc, b) => {
      for (const [k, v] of Object.entries(b.cost)) acc[k] = (acc[k] ?? 0) + v;
      return acc;
    }, { spec: 1, rows: fixture?.length ?? 0 });
    const describe = `${kind === 'tags' ? 'TagEditor' : names[kind]} ${topic.replace(/-/g, ' ')}`;
    specs.push({ path, kind, target, estimate: est, cost, content: file({ kind, names, describe, blocks, fixture }) });
  });
  return specs;
}

export function libFiles({ runner, name, domain, targets, rng, model, touched = false }) {
  const group = runner === 'cypress' ? 'ct' : 'unit';
  const root = `libs/${group}/${name}`;
  const files = {};
  files[`${root}/package.json`] = json({
    name: `@bench/${name}`,
    version: '0.0.0',
    private: true,
    main: './src/index.ts',
    types: './src/index.ts',
    dependencies: { '@bench/shared-ui': 'workspace:*' },
  });
  files[`${root}/project.json`] = json({
    $schema: '../../../node_modules/nx/schemas/project-schema.json',
    name,
    sourceRoot: `${root}/src`,
    projectType: 'library',
    tags: [`type:${group === 'ct' ? 'feature' : 'domain'}`, `runner:${runner}`],
  });
  files[`${root}/tsconfig.json`] = json({
    extends: '../../../tsconfig.base.json',
    compilerOptions: { types: runner === 'cypress' ? ['cypress', 'node'] : ['node'] },
    include: ['src/**/*.ts', 'src/**/*.tsx', ...(runner === 'cypress' ? ['cypress/**/*.ts', 'cypress.config.ts'] : ['vitest.config.ts'])],
  });
  Object.assign(files, libComponentFiles(root, domain, { touched }));

  if (runner === 'cypress') {
    files[`${root}/cypress.config.ts`] = `import { rmSync } from 'node:fs';
import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'cypress';

// Every Cypress process gets its own Vite cache dir: concurrent Nx tasks of the same project
// (atoms or shards) would otherwise race on one dependency-optimizer cache. Each process thus
// starts with a cold optimizer, like a fresh CI agent. The dir is removed after the run.
const cacheDir = join(__dirname, '../../../node_modules/.vite', \`ct-${name}-\${process.pid}\`);

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
`;
    files[`${root}/cypress/support/component.ts`] = `import { mount } from 'cypress/react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
`;
    files[`${root}/cypress/support/component-index.html`] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>${name} components</title>
  </head>
  <body>
    <div data-cy-root></div>
  </body>
</html>
`;
  } else {
    files[`${root}/vitest.config.ts`] = `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const ci = !!process.env.CI;

export default defineConfig({
  plugins: [react()],
  test: {
    name: '${name}',
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
`;
    files[`${root}/src/test-setup.ts`] = `import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
`;
  }

  const specs = buildSpecs({ runner, rng, domain, targets, model });
  for (const s of specs) files[`${root}/${s.path}`] = s.content;
  return { root, files, specs };
}
