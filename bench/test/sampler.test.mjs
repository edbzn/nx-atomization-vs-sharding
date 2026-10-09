// Deterministic checks of the sampler's tree walk, marker detection and attribution.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createSampler } from '../lib/sampler.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const node = (code, env) => spawn(process.execPath, ['-e', code], { env: { ...process.env, ...env }, stdio: 'ignore' });

test('tree walk, env attribution, marker for non-descendants, foreign ignored', async () => {
  const marker = `m-${process.pid}-${Date.now()}`;
  // root ("nx"): spawns a task child with NX_TASK_TARGET_* (80MB) which spawns a grandchild (no task env of its own)
  const root = node(
    `const cp=require('child_process');
     const t=cp.spawn(process.execPath,['-e',"const cp=require('child_process');cp.spawn(process.execPath,['-e','const b=Buffer.alloc(30e6,1);setTimeout(()=>{},4000)'],{stdio:'ignore'});const a=Buffer.alloc(80e6,1);setTimeout(()=>{},4000)"],{stdio:'ignore',env:{...process.env,NX_TASK_TARGET_PROJECT:'p',NX_TASK_TARGET_TARGET:'t'}});
     setTimeout(()=>{},4000)`,
    { BENCH_RUN_ID: marker },
  );
  // not a descendant of root, but carries the marker (like a reparented double-fork)
  const stray = node('const a=Buffer.alloc(40e6,1);setTimeout(()=>{},4000)', { BENCH_RUN_ID: marker, NX_TASK_TARGET_PROJECT: 'q', NX_TASK_TARGET_TARGET: 'u', NX_TASK_TARGET_CONFIGURATION: 'ci' });
  // foreign: no marker, not a descendant
  const foreign = node('const a=Buffer.alloc(50e6,1);setTimeout(()=>{},4000)', {});
  try {
    await sleep(800);
    const s = createSampler({ rootPid: root.pid, marker, intervalMs: 250 });
    s.tick();
    await sleep(250);
    s.tick();
    const r = s.result();
    assert.ok(r.perTask['p:t'], 'task p:t attributed');
    assert.equal(r.perTask['p:t'].procs, 2, 'task process + grandchild inherit the attribution');
    assert.ok(r.perTask['p:t'].peakPssMb > 100 && r.perTask['p:t'].peakPssMb < 200, `p:t PSS ${r.perTask['p:t'].peakPssMb}`);
    assert.ok(r.perTask['q:u:ci'], 'marker-only process found, configuration in id');
    assert.ok(r.perTask['q:u:ci'].peakPssMb > 35);
    assert.equal(r.processes.find((p) => p.pid === stray.pid).reparented, true);
    assert.equal(r.perTask['(nx)'].procs, 1, 'root without task env -> (nx)');
    assert.ok(!r.processes.some((p) => p.pid === foreign.pid), 'foreign process ignored');
    assert.equal(r.samples.length, 2);
    assert.ok(r.samples[1][1] > 150, 'total PSS');
  } finally {
    for (const p of [root, stray, foreign]) p.kill('SIGKILL');
  }
});
