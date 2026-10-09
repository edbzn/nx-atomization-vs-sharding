#!/usr/bin/env node
// Run a list of configurations sequentially, interleaving workspaces per repetition.
//
//   node bench/matrix.mjs bench/matrices/pilot.json [--dry-run] [--retry-flagged]
//
// Matrix file:
// {
//   "reps": 3,
//   "workspaces": ["baseline", "atomized", "sharded"],
//   "configs": [{"scenario": "full", "runner": "ct", "parallel": 8}],      // explicit list, and/or
//   "scenarios": ["full"], "runners": ["ct"], "parallel": [8],             // cartesian product
//   "cooldownSec": 20, "minMemAvailableGb": 20, "memWaitTimeoutMin": 30,
//   "rotate": true,             // rotate workspace order each rep (rep1 b,a,s; rep2 a,s,b; ...)
//   "label": null, "out": "results/raw",
//   "env": {"SHARD_TARGET_SECONDS": "30"},   // extra env for run.mjs (also per config; pair it with a label)
//   "runArgs": {"interval": 250, "timeout-min": 90}
// }
// Resumable: a rep whose summary.json already exists (same workspace/scenario/runner/P/label/rep)
// is skipped. --retry-flagged re-runs reps whose summary is flagged (the old run dir is moved
// to <out>/_superseded/, which aggregate/simulate ignore).
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, renameSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { BENCH_DIR, RAW_DIR, REPO_DIR } from './lib/config.mjs';
import { readMeminfo } from './lib/proc.mjs';
import { findSummaries, loadSummary, repKey } from './lib/results.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    'dry-run': { type: 'boolean', default: false },
    'retry-flagged': { type: 'boolean', default: false },
  },
});
if (!positionals[0]) {
  console.error('usage: node bench/matrix.mjs <matrix.json> [--dry-run] [--retry-flagged]');
  process.exit(2);
}
const m = JSON.parse(readFileSync(positionals[0], 'utf8'));
const reps = m.reps ?? 3;
const workspaces = m.workspaces ?? ['baseline', 'atomized', 'sharded'];
const out = resolve(REPO_DIR, m.out ?? RAW_DIR);
const cooldownMs = (m.cooldownSec ?? 20) * 1000;
const minMemGb = m.minMemAvailableGb ?? 0;
const memWaitMs = (m.memWaitTimeoutMin ?? 30) * 60_000;

const configs = [...(m.configs ?? [])];
if (m.scenarios && m.runners && m.parallel) {
  for (const scenario of m.scenarios) for (const runner of m.runners) for (const parallel of m.parallel) configs.push({ scenario, runner, parallel });
}
if (!configs.length) {
  console.error('matrix has no configs');
  process.exit(2);
}

const plan = [];
for (let rep = 1; rep <= reps; rep++) {
  for (const c of configs) {
    const shift = m.rotate === false ? 0 : (rep - 1) % workspaces.length;
    const order = [...workspaces.slice(shift), ...workspaces.slice(0, shift)];
    for (const workspace of order) plan.push({ workspace, ...c, label: c.label ?? m.label ?? null, rep });
  }
}

const existing = new Map();
for (const f of findSummaries(out)) {
  const s = loadSummary(f);
  existing.set(repKey(s.config), s);
}

const todo = [];
for (const p of plan) {
  const s = existing.get(repKey(p));
  if (s && (s.ok || !values['retry-flagged'])) continue;
  todo.push({ ...p, supersede: s?._dir ?? null });
}
console.log(`[matrix] ${plan.length} planned run(s), ${plan.length - todo.length} already done, ${todo.length} to run -> ${out}`);
if (values['dry-run']) {
  for (const p of todo) console.log(`  r${p.rep} ${p.workspace} ${p.scenario} ${p.runner} p${p.parallel}${p.label ? ` [${p.label}]` : ''}${p.supersede ? ' (retry)' : ''}`);
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitForMemory() {
  if (!minMemGb) return;
  const deadline = Date.now() + memWaitMs;
  let warned = false;
  for (;;) {
    const avail = readMeminfo().memAvailable / 2 ** 30;
    if (avail >= minMemGb) return;
    if (Date.now() > deadline) {
      console.warn(`[matrix] MemAvailable ${avail.toFixed(1)}GB still < ${minMemGb}GB after ${m.memWaitTimeoutMin ?? 30} min; running anyway`);
      return;
    }
    if (!warned) console.log(`[matrix] waiting for MemAvailable >= ${minMemGb}GB (now ${avail.toFixed(1)}GB)`);
    warned = true;
    await sleep(5000);
  }
}

let i = 0;
let flagged = 0;
for (const p of todo) {
  if (i > 0) await sleep(cooldownMs);
  await waitForMemory();
  if (p.supersede) {
    const dest = join(out, '_superseded', basename(p.supersede));
    mkdirSync(dirname(dest), { recursive: true });
    renameSync(p.supersede, dest);
  }
  i++;
  console.log(`\n[matrix] ${i}/${todo.length}: r${p.rep} ${p.workspace} ${p.scenario} ${p.runner} p${p.parallel}`);
  const args = [join(BENCH_DIR, 'run.mjs'), '--workspace', p.workspace, '--scenario', p.scenario, '--runner', p.runner, '--parallel', String(p.parallel), '--reps', '1', '--rep-start', String(p.rep), '--out', out];
  if (p.label) args.push('--label', p.label);
  for (const [k, v] of Object.entries({ ...(m.runArgs ?? {}), ...(p.runArgs ?? {}) })) {
    if (v === true) args.push(`--${k}`);
    else if (v !== false && v != null) args.push(`--${k}`, String(v));
  }
  const code = await new Promise((r) => spawn(process.execPath, args, { stdio: 'inherit', env: { ...process.env, ...(m.env ?? {}), ...(p.env ?? {}) } }).on('close', r));
  if (code === 2 || code === null) {
    console.error(`[matrix] run.mjs crashed (exit ${code}); stopping. Re-run the same command to resume.`);
    process.exit(2);
  }
  if (code !== 0) flagged++;
}
console.log(`\n[matrix] done: ${todo.length} run(s), ${flagged} flagged`);
