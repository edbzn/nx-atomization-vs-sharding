import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import type { CreateNodes, CreateNodesContext, TargetConfiguration } from '@nx/devkit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  balanceShards,
  createShardNodesForFile,
  findSpecs,
  planShards,
  type RunnerDefinition,
  type ShardPluginOptions,
} from '../src/core.ts';
import * as cypressCt from '../src/cypress-ct.ts';
import * as playwright from '../src/playwright.ts';
import * as vitest from '../src/vitest.ts';

const kb = (size: number): string => 'x'.repeat(size * 1024);
const root = 'libs/demo';

let workspaceRoot: string;
let context: CreateNodesContext;

beforeEach(() => {
  workspaceRoot = mkdtempSync(join(tmpdir(), 'shard-plugin-'));
  context = { workspaceRoot, nxJsonConfiguration: {} };
});
afterEach(() => rmSync(workspaceRoot, { recursive: true, force: true }));

const write = (files: Record<string, string>): void => {
  for (const [path, content] of Object.entries(files)) {
    const absolute = join(workspaceRoot, path);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, content);
  }
};

/** Runs the entry file's real createNodesV2 against the tmp workspace. */
const runPlugin = async (
  entry: { createNodesV2: CreateNodes<ShardPluginOptions> },
  configFile: string,
  options: ShardPluginOptions,
): Promise<Record<string, TargetConfiguration>> => {
  const [, createNodes] = entry.createNodesV2;
  const results = await createNodes([configFile], options, context);
  expect(results).toHaveLength(1);
  const [file, result] = results[0];
  expect(file).toBe(configFile);
  return result.projects?.[dirname(configFile)]?.targets ?? {};
};

// Fixed rates so fixture expectations don't move when the calibrated defaults do.
const cctOptions = { ciTargetName: 'component-test-ci', delegateTarget: 'component-test', secondsPerKb: 1 };
const e2eOptions = { ciTargetName: 'e2e-ci', delegateTarget: 'e2e', secondsPerKb: 2 };
const testOptions = { ciTargetName: 'test-ci', delegateTarget: 'test', secondsPerKb: 0.25 };

describe('balanceShards', () => {
  it('puts each spec on the lightest shard, heaviest first', () => {
    const specs = [
      { path: 'a', bytes: 5 },
      { path: 'b', bytes: 4 },
      { path: 'c', bytes: 3 },
      { path: 'd', bytes: 3 },
      { path: 'e', bytes: 3 },
    ];
    // a→1, b→2, c→2 (4<5), d→1 (5<7), e→2 (7<8, ties go to the first shard)
    expect(balanceShards(specs, 2)).toEqual([
      ['a', 'd'],
      ['b', 'c', 'e'],
    ]);
  });

  it('keeps shard loads within one spec of each other', () => {
    const specs = Array.from({ length: 40 }, (_, i) => ({
      path: `s${String(i).padStart(2, '0')}`,
      bytes: ((i * 7919) % 97) + 3,
    }));
    const bytesOf = new Map(specs.map((s) => [s.path, s.bytes]));
    const loads = balanceShards(specs, 6).map((paths) =>
      paths.reduce((sum, p) => sum + bytesOf.get(p)!, 0),
    );
    const largest = Math.max(...specs.map((s) => s.bytes));
    expect(Math.max(...loads) - Math.min(...loads)).toBeLessThanOrEqual(largest);
    expect(loads.reduce((a, b) => a + b)).toBe(specs.reduce((a, s) => a + s.bytes, 0));
  });

  it('is deterministic regardless of input order', () => {
    const specs = [
      { path: 'b', bytes: 10 },
      { path: 'a', bytes: 10 },
      { path: 'c', bytes: 10 },
      { path: 'd', bytes: 1 },
    ];
    const expected = balanceShards(specs, 2);
    expect(balanceShards([...specs].reverse(), 2)).toEqual(expected);
    expect(expected).toEqual([['a', 'c'], ['b', 'd']]);
  });
});

describe('planShards', () => {
  const specs = (count: number, size: number) =>
    Array.from({ length: count }, (_, i) => ({ path: `s${i}.cy.tsx`, bytes: size * 1024 }));

  it('does not shard a project at or below one shard target', () => {
    // 90 KB × 1 s/KB = 90 s → ceil(1) = 1
    const plan = planShards(specs(9, 10), { secondsPerKb: 1 });
    expect(plan).toMatchObject({ shardCount: 1, sharded: false, estimatedSeconds: 90 });
    expect(plan.shards).toHaveLength(1);
    expect(plan.shards[0].paths).toHaveLength(9);
  });

  it('shards just above the target', () => {
    // 100 KB × 1 s/KB = 100 s → 2 shards of 50 s
    const plan = planShards(specs(10, 10), { secondsPerKb: 1 });
    expect(plan.shardCount).toBe(2);
    expect(plan.shards.map((s) => s.estimatedSeconds)).toEqual([50, 50]);
  });

  it('caps at maxShards (default 8)', () => {
    // 2000 KB × 1 s/KB = 2000 s → 23 shards wanted
    expect(planShards(specs(100, 20), { secondsPerKb: 1 }).shardCount).toBe(8);
    expect(planShards(specs(100, 20), { secondsPerKb: 1, maxShards: 3 }).shardCount).toBe(3);
  });

  it('never makes more shards than specs', () => {
    // 3 × 500 KB = 1500 s → 17 wanted, 8 allowed, 3 specs
    const plan = planShards(specs(3, 500), { secondsPerKb: 1 });
    expect(plan.shardCount).toBe(3);
    expect(plan.shards.every((s) => s.paths.length === 1)).toBe(true);
  });

  it('honours targetShardSeconds', () => {
    // 300 s at a 60 s target → 5 shards
    expect(planShards(specs(30, 10), { secondsPerKb: 1, targetShardSeconds: 60 }).shardCount).toBe(5);
  });

  it('handles a project without specs', () => {
    expect(planShards([], { secondsPerKb: 1 })).toEqual({
      totalBytes: 0,
      estimatedSeconds: 0,
      shardCount: 0,
      sharded: false,
      shards: [],
    });
  });
});

describe('findSpecs', () => {
  it('finds suffix matches sorted, skipping dot dirs and node_modules', () => {
    write({
      [`${root}/src/b/z.cy.tsx`]: kb(1),
      [`${root}/src/a.cy.tsx`]: kb(2),
      [`${root}/src/a.cy.ts`]: kb(2),
      [`${root}/.cache/stale.cy.tsx`]: kb(1),
      [`${root}/node_modules/dep/x.cy.tsx`]: kb(1),
    });
    expect(findSpecs(join(workspaceRoot, root), '.cy.tsx')).toEqual([
      { path: 'src/a.cy.tsx', bytes: 2048 },
      { path: 'src/b/z.cy.tsx', bytes: 1024 },
    ]);
  });
});

describe('cypress-ct', () => {
  const config = `${root}/cypress.config.ts`;

  it('matches cypress.config.ts', () => {
    expect(cypressCt.createNodesV2[0]).toBe('**/cypress.config.ts');
    expect(cypressCt.createNodes).toBe(cypressCt.createNodesV2);
  });

  it('delegates a small project to its whole-project target', async () => {
    write({ [`${root}/project.json`]: '{}', [config]: '', [`${root}/src/a.cy.tsx`]: kb(10) });
    expect(await runPlugin(cypressCt, config, cctOptions)).toEqual({
      'component-test-ci': {
        executor: 'nx:noop',
        dependsOn: [{ target: 'component-test', params: 'forward' }],
      },
    });
  });

  it('shards a large project, only counting .cy.tsx specs', async () => {
    write({
      [`${root}/project.json`]: '{}',
      [config]: '',
      [`${root}/src/a.cy.tsx`]: kb(100),
      [`${root}/src/b.cy.tsx`]: kb(60),
      [`${root}/src/c.cy.tsx`]: kb(50),
      [`${root}/src/ignored.cy.ts`]: kb(500),
      [`${root}/src/ignored.spec.tsx`]: kb(500),
      [`${root}/.cache/stale.cy.tsx`]: kb(500),
    });
    // 210 KB × 1 s/KB = 210 s → 3 shards
    const targets = await runPlugin(cypressCt, config, cctOptions);
    expect(Object.keys(targets)).toEqual([
      'component-test-ci--shard-1-of-3',
      'component-test-ci--shard-2-of-3',
      'component-test-ci--shard-3-of-3',
      'component-test-ci',
    ]);
    expect(targets['component-test-ci']).toEqual({
      executor: 'nx:noop',
      dependsOn: [
        { target: 'component-test-ci--shard-1-of-3', params: 'forward' },
        { target: 'component-test-ci--shard-2-of-3', params: 'forward' },
        { target: 'component-test-ci--shard-3-of-3', params: 'forward' },
      ],
    });
    expect(targets['component-test-ci--shard-1-of-3']).toEqual({
      command: 'cypress run --component --spec src/a.cy.tsx',
      options: { cwd: root },
      cache: true,
      inputs: ['default', '^production', { externalDependencies: ['cypress'] }],
      outputs: [],
      metadata: {
        technologies: ['cypress'],
        description: 'Runs Cypress component tests shard 1/3 in CI (1 spec, ~100s estimated)',
      },
    });
  });

  it('joins a shard spec list with commas', async () => {
    write({
      [`${root}/project.json`]: '{}',
      [config]: '',
      ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`${root}/src/s${i}.cy.tsx`, kb(50)])),
    });
    // 200 s → 3 shards; LPT over equal sizes: s0,s3 | s1 | s2
    const targets = await runPlugin(cypressCt, config, cctOptions);
    expect(targets['component-test-ci--shard-1-of-3'].command).toBe(
      'cypress run --component --spec src/s0.cy.tsx,src/s3.cy.tsx',
    );
  });

  it('honours the secondsPerKb / targetShardSeconds / maxShards options', async () => {
    write({
      [`${root}/project.json`]: '{}',
      [config]: '',
      ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`${root}/src/s${i}.cy.tsx`, kb(10)])),
    });
    // 100 KB × 10 s/KB = 1000 s at 100 s/shard → 10, capped at 4
    const targets = await runPlugin(cypressCt, config, {
      ...cctOptions,
      secondsPerKb: 10,
      targetShardSeconds: 100,
      maxShards: 4,
    });
    expect(Object.keys(targets)).toContain('component-test-ci--shard-4-of-4');
  });

  it('ignores a config without a project.json next to it', async () => {
    write({ [config]: '', [`${root}/src/a.cy.tsx`]: kb(500) });
    const [, createNodes] = cypressCt.createNodesV2;
    expect(await createNodes([config], cctOptions, context)).toEqual([[config, { projects: {} }]]);
  });

  it('requires ciTargetName and delegateTarget', async () => {
    const [, createNodes] = cypressCt.createNodesV2;
    await expect(createNodes([config], { ciTargetName: 'x' } as ShardPluginOptions, context)).rejects.toThrow(
      /"ciTargetName" and "delegateTarget" options are required/,
    );
  });
});

describe('playwright', () => {
  const e2eRoot = 'apps/shop-e2e';
  const config = `${e2eRoot}/playwright.config.ts`;

  it('matches playwright.config.ts', () => {
    expect(playwright.createNodesV2[0]).toBe('**/playwright.config.ts');
  });

  it('delegates a small project, still depending on ^build', async () => {
    write({ [`${e2eRoot}/project.json`]: '{}', [config]: '', [`${e2eRoot}/src/a.spec.ts`]: kb(5) });
    expect(await runPlugin(playwright, config, e2eOptions)).toEqual({
      'e2e-ci': {
        executor: 'nx:noop',
        dependsOn: [{ target: 'e2e', params: 'forward' }, '^build'],
      },
    });
  });

  it('shards only .spec.ts files, with ^build on shards and the CI target', async () => {
    write({
      [`${e2eRoot}/project.json`]: '{}',
      [config]: '',
      [`${e2eRoot}/src/a.spec.ts`]: kb(80),
      [`${e2eRoot}/src/b.spec.ts`]: kb(60),
      [`${e2eRoot}/src/c.spec.ts`]: kb(40),
      [`${e2eRoot}/src/ignored.spec.tsx`]: kb(500),
      [`${e2eRoot}/src/ignored.cy.tsx`]: kb(500),
    });
    // 180 KB × 2 s/KB = 360 s → 4 wanted, 3 specs
    const targets = await runPlugin(playwright, config, e2eOptions);
    expect(targets['e2e-ci'].dependsOn).toEqual([
      { target: 'e2e-ci--shard-1-of-3', params: 'forward' },
      { target: 'e2e-ci--shard-2-of-3', params: 'forward' },
      { target: 'e2e-ci--shard-3-of-3', params: 'forward' },
      '^build',
    ]);
    expect(targets['e2e-ci--shard-2-of-3']).toEqual({
      command: 'playwright test src/b.spec.ts --output=test-results/shard-2-of-3',
      options: { cwd: e2eRoot },
      cache: true,
      inputs: ['default', '^production', { externalDependencies: ['@playwright/test'] }],
      outputs: ['{projectRoot}/test-results/shard-2-of-3'],
      dependsOn: ['^build'],
      metadata: {
        technologies: ['playwright'],
        description: 'Runs Playwright tests shard 2/3 in CI (1 spec, ~120s estimated)',
      },
    });
  });
});

describe('vitest', () => {
  it('matches vitest.config.ts and vitest.config.mts', () => {
    expect(vitest.createNodesV2[0]).toBe('**/vitest.config.{ts,mts}');
  });

  it.each(['vitest.config.ts', 'vitest.config.mts'])('shards only .spec.tsx files (%s)', async (name) => {
    const config = `${root}/${name}`;
    write({
      [`${root}/project.json`]: '{}',
      [config]: '',
      ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`${root}/src/s${i}.spec.tsx`, kb(200)])),
      [`${root}/src/ignored.spec.ts`]: kb(5000),
      [`${root}/src/ignored.cy.tsx`]: kb(5000),
    });
    // 1000 KB × 0.25 s/KB = 250 s → 3 shards: s0,s3 | s1,s4 | s2
    const targets = await runPlugin(vitest, config, testOptions);
    expect(
      Object.entries(targets)
        .filter(([name]) => name.includes('--shard-'))
        .map(([name, target]) => [name, target.command]),
    ).toEqual([
      ['test-ci--shard-1-of-3', 'vitest run src/s0.spec.tsx src/s3.spec.tsx'],
      ['test-ci--shard-2-of-3', 'vitest run src/s1.spec.tsx src/s4.spec.tsx'],
      ['test-ci--shard-3-of-3', 'vitest run src/s2.spec.tsx'],
    ]);
    expect(targets['test-ci--shard-1-of-3']).toMatchObject({
      options: { cwd: root },
      inputs: ['default', '^production', { externalDependencies: ['vitest'] }],
    });
    expect(targets['test-ci--shard-1-of-3'].dependsOn).toBeUndefined();
  });

  it('delegates a small project to test', async () => {
    write({ [`${root}/project.json`]: '{}', [`${root}/vitest.config.ts`]: '', [`${root}/src/a.spec.tsx`]: kb(10) });
    expect(await runPlugin(vitest, `${root}/vitest.config.ts`, testOptions)).toEqual({
      'test-ci': { executor: 'nx:noop', dependsOn: [{ target: 'test', params: 'forward' }] },
    });
  });
});

describe('createShardNodesForFile', () => {
  it('accepts absolute config paths', () => {
    write({ [`${root}/project.json`]: '{}', [`${root}/cypress.config.ts`]: '' });
    const runner: RunnerDefinition = cypressCt.cypressCtRunner;
    const result = createShardNodesForFile(join(workspaceRoot, root, 'cypress.config.ts'), runner, cctOptions, context);
    expect(Object.keys(result.projects ?? {})).toEqual([root]);
  });
});
