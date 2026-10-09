/**
 * Spec-size sharding for Nx test targets — a generalized port of the production
 * `cct-shards` plugin (Cypress component tests) to Cypress CT, Playwright and Vitest.
 *
 * Why shards instead of Nx's per-file atomizers: every task pays a fixed startup cost
 * (Vite dev server / transform cache, browser launch) of ~20s for browser runners. One
 * task per spec pays it once per spec; a handful of balanced shards per project pays it
 * a handful of times while still spreading a large project over several agents/slots.
 *
 * - Spec bytes are the duration proxy (CI duration tracked spec bytes at r ≈ 0.9 in
 *   production), converted to seconds with a per-runner `secondsPerKb`.
 * - A project is split into ceil(estimate / targetShardSeconds) shards (90s target: a
 *   60s target added more tasks whose startup outweighed the more even batches), capped
 *   by `maxShards` and by the number of specs.
 * - Specs are assigned longest-processing-time-first (each spec to the lightest shard).
 * - Projects that would get ≤ 1 shard delegate to the runner's plain whole-project target.
 *
 * Runtime imports are limited to node builtins and sibling files (with explicit `.ts`
 * extensions) so Nx can load this with Node's native type stripping, whether the
 * workspace is CommonJS or ESM; `@nx/devkit` is only imported for types.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, sep } from 'node:path';

import type {
  CreateNodesContext,
  CreateNodesResult,
  CreateNodes,
  TargetConfiguration,
  TargetDependencyConfig,
} from '@nx/devkit';

export const DEFAULT_TARGET_SHARD_SECONDS = 90;
export const DEFAULT_MAX_SHARDS = 8;

/** Plugin options, as passed from the `nx.json` plugin entry. */
export interface ShardPluginOptions {
  /** Target the plugin creates, e.g. `component-test-ci`. Shards are `<ciTargetName>--shard-<i>-of-<n>`. */
  ciTargetName: string;
  /** Whole-project target (inferred by the official @nx plugin) that unsharded projects delegate to. */
  delegateTarget: string;
  /** Estimated CI seconds per KB of spec source. Defaults per runner. */
  secondsPerKb?: number;
  /** Desired duration of one shard. Default 90. */
  targetShardSeconds?: number;
  /** Upper bound on shards per project. Default 8. */
  maxShards?: number;
}

export interface Spec {
  /** POSIX path relative to the project root. */
  path: string;
  bytes: number;
}

export interface ShardPlanOptions {
  secondsPerKb: number;
  targetShardSeconds?: number;
  maxShards?: number;
}

export interface Shard {
  /** Spec paths, sorted. */
  paths: string[];
  bytes: number;
  estimatedSeconds: number;
}

export interface ShardPlan {
  totalBytes: number;
  estimatedSeconds: number;
  /** min(ceil(estimate / target), maxShards, specs); ≤ 1 means "not sharded". */
  shardCount: number;
  sharded: boolean;
  /** The balanced shards when `sharded`; otherwise a single group with every spec (empty if no specs). */
  shards: Shard[];
}

/** Everything that differs between runners. */
export interface RunnerDefinition {
  /** Used in metadata.technologies and the error messages. */
  technology: string;
  /** Human label for target descriptions, e.g. "Cypress component tests". */
  label: string;
  /** Glob Nx matches config files with. */
  configGlob: string;
  /** Spec file suffix, e.g. `.cy.tsx`. */
  specSuffix: string;
  /** npm package whose version is a cache input. */
  externalDependency: string;
  defaultSecondsPerKb: number;
  /** Shell command for one shard, run with `cwd: projectRoot`; `paths` are relative to it. */
  command: (paths: string[], shard: ShardContext) => string;
  /** Outputs of one shard (Nx output syntax), if the runner writes any. */
  outputs?: (shard: ShardContext) => string[];
  /** Extra `dependsOn` entries for the shards and for the CI target. */
  extraDependsOn?: (string | TargetDependencyConfig)[];
}

export interface ShardContext {
  /** 1-based. */
  index: number;
  count: number;
  targetName: string;
}

const byBytesDescThenPath = (a: Spec, b: Spec): number =>
  b.bytes - a.bytes || (a.path < b.path ? -1 : a.path > b.path ? 1 : 0);

const lpt = (specs: Spec[], shardCount: number): { bytes: number; paths: string[] }[] => {
  if (shardCount < 1) return [];
  const shards = Array.from({ length: shardCount }, () => ({ bytes: 0, paths: [] as string[] }));
  for (const spec of [...specs].sort(byBytesDescThenPath)) {
    // First lightest shard wins ties, so the assignment is deterministic.
    const lightest = shards.reduce((min, shard) => (shard.bytes < min.bytes ? shard : min));
    lightest.bytes += spec.bytes;
    lightest.paths.push(spec.path);
  }
  for (const shard of shards) shard.paths.sort();
  return shards;
};

/** Longest-processing-time-first: each spec, heaviest first, goes to the currently lightest shard. */
export const balanceShards = (specs: Spec[], shardCount: number): string[][] =>
  lpt(specs, shardCount).map((shard) => shard.paths);

/** Pure shard planning: how many shards a project gets and which specs go where. */
export const planShards = (specs: Spec[], options: ShardPlanOptions): ShardPlan => {
  const {
    secondsPerKb,
    targetShardSeconds = DEFAULT_TARGET_SHARD_SECONDS,
    maxShards = DEFAULT_MAX_SHARDS,
  } = options;
  const toSeconds = (bytes: number): number => (bytes / 1024) * secondsPerKb;
  const totalBytes = specs.reduce((sum, spec) => sum + spec.bytes, 0);
  const estimatedSeconds = toSeconds(totalBytes);
  const shardCount = Math.min(
    Math.ceil(estimatedSeconds / targetShardSeconds),
    maxShards,
    specs.length,
  );
  const sharded = shardCount > 1;
  const groups = sharded ? lpt(specs, shardCount) : specs.length ? lpt(specs, 1) : [];
  return {
    totalBytes,
    estimatedSeconds,
    shardCount,
    sharded,
    shards: groups.map(({ bytes, paths }) => ({ paths, bytes, estimatedSeconds: toSeconds(bytes) })),
  };
};

/**
 * Spec files under `dir` ending with `suffix`, sorted by path. Like the runners' default
 * globs, dot dirs/files and node_modules are skipped.
 */
export const findSpecs = (dir: string, suffix: string, root: string = dir): Spec[] =>
  readdirSync(dir)
    .sort()
    .flatMap((entry) => {
      if (entry.startsWith('.') || entry === 'node_modules') return [];
      const path = join(dir, entry);
      const stats = statSync(path);
      if (stats.isDirectory()) return findSpecs(path, suffix, root);
      return stats.isFile() && entry.endsWith(suffix)
        ? [{ path: relative(root, path).split(sep).join('/'), bytes: stats.size }]
        : [];
    });

/** POSIX single-quoting, only when needed (generated spec paths normally never need it). */
export const quoteArg = (arg: string): string =>
  /^[\w@%+=:,./-]+$/.test(arg) ? arg : `'${arg.replace(/'/g, `'\\''`)}'`;

export const shardTargetName = (ciTargetName: string, index: number, count: number): string =>
  `${ciTargetName}--shard-${index}-of-${count}`;

const resolveOptions = (runner: RunnerDefinition, options: ShardPluginOptions | undefined) => {
  const { ciTargetName, delegateTarget } = options ?? ({} as Partial<ShardPluginOptions>);
  if (!ciTargetName || !delegateTarget) {
    throw new Error(
      `shard-plugin (${runner.technology}): the "ciTargetName" and "delegateTarget" options are required`,
    );
  }
  const resolved = {
    ciTargetName,
    delegateTarget,
    secondsPerKb: options?.secondsPerKb ?? runner.defaultSecondsPerKb,
    // Benchmark knob: sweep the shard target without editing nx.json (which would make
    // every project affected). Graph computation is cold per run, so no stale plan.
    targetShardSeconds:
      Number(process.env.SHARD_TARGET_SECONDS) ||
      (options?.targetShardSeconds ?? DEFAULT_TARGET_SHARD_SECONDS),
    maxShards: options?.maxShards ?? DEFAULT_MAX_SHARDS,
  };
  for (const key of ['secondsPerKb', 'targetShardSeconds', 'maxShards'] as const) {
    if (!(resolved[key] > 0)) {
      throw new Error(`shard-plugin (${runner.technology}): "${key}" must be a positive number`);
    }
  }
  return resolved;
};

/** The CI target (and its shards) for one project, given its specs. */
export const createShardTargets = (
  projectRoot: string,
  specs: Spec[],
  runner: RunnerDefinition,
  options: ShardPluginOptions,
): Record<string, TargetConfiguration> => {
  const resolved = resolveOptions(runner, options);
  const { ciTargetName, delegateTarget } = resolved;
  const plan = planShards(specs, resolved);
  const extraDependsOn = runner.extraDependsOn ?? [];
  const targets: Record<string, TargetConfiguration> = {};

  if (!plan.sharded) {
    targets[ciTargetName] = {
      executor: 'nx:noop',
      dependsOn: [{ target: delegateTarget, params: 'forward' }, ...extraDependsOn],
    };
    return targets;
  }

  const shardNames = plan.shards.map((shard, i) => {
    const context: ShardContext = {
      index: i + 1,
      count: plan.shardCount,
      targetName: shardTargetName(ciTargetName, i + 1, plan.shardCount),
    };
    const outputs = runner.outputs?.(context) ?? [];
    targets[context.targetName] = {
      command: runner.command(shard.paths, context),
      options: { cwd: projectRoot },
      cache: true,
      inputs: ['default', '^production', { externalDependencies: [runner.externalDependency] }],
      outputs,
      ...(extraDependsOn.length ? { dependsOn: [...extraDependsOn] } : {}),
      metadata: {
        technologies: [runner.technology],
        description: `Runs ${runner.label} shard ${context.index}/${context.count} in CI (${shard.paths.length} spec${shard.paths.length === 1 ? '' : 's'}, ~${Math.round(shard.estimatedSeconds)}s estimated)`,
      },
    };
    return context.targetName;
  });

  targets[ciTargetName] = {
    executor: 'nx:noop',
    dependsOn: [
      ...shardNames.map((target) => ({ target, params: 'forward' as const })),
      ...extraDependsOn,
    ],
  };
  return targets;
};

/** createNodes handler for one config file. */
export const createShardNodesForFile = (
  configFile: string,
  runner: RunnerDefinition,
  options: ShardPluginOptions,
  context: Pick<CreateNodesContext, 'workspaceRoot'>,
): CreateNodesResult => {
  const configPath = isAbsolute(configFile) ? configFile : join(context.workspaceRoot, configFile);
  const absoluteRoot = dirname(configPath);
  if (!existsSync(join(absoluteRoot, 'project.json'))) return { projects: {} };

  const projectRoot = relative(context.workspaceRoot, absoluteRoot).split(sep).join('/') || '.';
  const specs = findSpecs(absoluteRoot, runner.specSuffix);
  const targets = createShardTargets(projectRoot, specs, runner, options);
  return { projects: { [projectRoot]: { root: projectRoot, targets } } };
};

/** Builds the `createNodesV2` tuple for a runner (createNodesFromFiles, inlined and simplified). */
export const createShardNodes = (runner: RunnerDefinition): CreateNodes<ShardPluginOptions> => [
  runner.configGlob,
  async (configFiles, options, context) => {
    // Validate once so a bad nx.json entry fails loudly rather than per file.
    resolveOptions(runner, options);
    return configFiles.map(
      (file) =>
        [file, createShardNodesForFile(file, runner, options as ShardPluginOptions, context)] as const,
    );
  },
];
