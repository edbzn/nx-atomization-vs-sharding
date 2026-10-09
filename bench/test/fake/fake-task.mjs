#!/usr/bin/env node
// A fake test-runner process: allocates and touches `mb` MB, burns `cpu` (0..1 of a core)
// for `ms`, optionally spawns `children` helper processes (same env, like Cypress spawning
// Electron) and an `orphan` that double-forks and outlives the task.
//   node fake-task.mjs <ms> <mb> <cpu> [children] [orphan 0|1] [fail 0|1]
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const [ms = 1000, mb = 50, cpu = 1, children = 0, orphan = 0, fail = 0] = process.argv.slice(2).map(Number);
const self = fileURLToPath(import.meta.url);

const buf = Buffer.alloc(mb * 1024 * 1024);
for (let i = 0; i < buf.length; i += 4096) buf[i] = 1; // touch every page -> RSS/PSS

const kids = [];
for (let i = 0; i < children; i++) {
  kids.push(spawn(process.execPath, [self, String(ms), String(Math.round(mb / 2)), String(cpu), '0', '0', '0'], { stdio: 'inherit' }));
}
if (orphan) {
  // double fork: an intermediate detached process starts a long sleeper and exits at once,
  // so the sleeper is reparented to init/subreaper and is NOT a descendant of nx any more.
  spawn(process.execPath, ['-e', `require('child_process').spawn(process.execPath, ['-e', 'setTimeout(()=>{}, 120000)'], {detached: true, stdio: 'ignore'}).unref()`], { detached: true, stdio: 'ignore' }).unref();
}

const end = Date.now() + ms;
let x = 0;
while (Date.now() < end) {
  // duty cycle of 10ms slices
  const sliceEnd = Math.min(end, Date.now() + 10 * cpu);
  while (Date.now() < sliceEnd) x++;
  const idle = 10 * (1 - cpu);
  if (idle > 0) await new Promise((r) => setTimeout(r, idle));
}
await Promise.all(kids.map((k) => new Promise((r) => (k.exitCode != null ? r() : k.on('exit', r)))));
console.log(`fake task done (${x > 0 ? 'busy' : 'idle'}) ${buf[0]}`);
process.exit(fail ? 1 : 0);
