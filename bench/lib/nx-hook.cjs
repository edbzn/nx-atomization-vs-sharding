#!/usr/bin/env node
// Launcher for the workspace's own Nx that captures Nx's end-of-run performance report
// structurally. Usage (cwd = workspace root): node nx-hook.cjs affected -t ... (same args as nx)
//
// Nx 23 always builds a PerformanceLifeCycle (tasks-runner/run-command.js
// constructLifeCycles) and, in non-TUI runs, prints formatReport(summary) from
// flushPerformanceReport() in runTasksForCommand's `finally`. The printed text only shows
// run duration / critical path / "recoverable time"; the structured summary also splits
// overhead into recoverableByParallel / recoverableByMachines / coordinatorOverhead. We get
// it by wrapping PerformanceLifeCycle.prototype.getSummary (called exactly once by the
// flush) and dumping its result to $BENCH_NX_PERF_OUT.
//
// Why a launcher and not NODE_OPTIONS=--require: NODE_OPTIONS (and execArgv) would be
// inherited by every task process (Cypress, Playwright, Vitest workers). Requiring the
// local nx bin from here keeps the patch in the coordinator process only. The bin's
// "is this the local install" check passes because we load the workspace's own copy.
'use strict';
const path = require('node:path');
const fs = require('node:fs');
const { createRequire } = require('node:module');

const hookLoadedAt = Date.now();
const out = process.env.BENCH_NX_PERF_OUT;
delete process.env.BENCH_NX_PERF_OUT; // don't leak into task env

const wsRequire = createRequire(path.join(process.cwd(), 'package.json'));
const nxBin = wsRequire.resolve('nx/bin/nx.js'); // realpath: <pkg>/dist/bin/nx.js
const nxRoot = path.resolve(path.dirname(nxBin), '..', '..');
const nxVersion = JSON.parse(fs.readFileSync(path.join(nxRoot, 'package.json'), 'utf8')).version;

const dump = { nxVersion, hookLoadedAt, lifeCycleCreatedAt: [], summaryAt: null, summary: null, error: null };
const write = () => {
  if (!out) return;
  try {
    fs.writeFileSync(out, JSON.stringify(dump, null, 1));
  } catch {}
};

try {
  const lcDir = path.join(nxRoot, 'dist', 'src', 'tasks-runner', 'life-cycles');
  const plc = require(path.join(lcDir, 'performance-life-cycle.js'));
  const { PerformanceAnalysis } = require(path.join(lcDir, 'performance-analysis.js'));
  const Orig = plc.PerformanceLifeCycle;

  // Constructed in constructLifeCycles, i.e. after the project graph + task graph are
  // computed and right before the orchestrator starts: a "graph ready" timestamp.
  class Patched extends Orig {
    constructor(...args) {
      super(...args);
      dump.lifeCycleCreatedAt.push(Date.now());
      write();
    }
  }
  plc.PerformanceLifeCycle = Patched;

  const origGetSummary = Orig.prototype.getSummary;
  Orig.prototype.getSummary = function (...args) {
    const summary = origGetSummary.apply(this, args);
    try {
      dump.summaryAt = Date.now();
      dump.summary = summary;
      dump.parallel = this.parallel;
      dump.timings = Object.fromEntries(this.timings);
      dump.statuses = Object.fromEntries(this.statuses);
      dump.batchSiblings = Object.fromEntries(this.batchSiblings);
      // Critical path task ids (the summary only carries the count + top 3).
      const durations = new Map();
      for (const [id, t] of this.timings) {
        if (!t.continuous && t.startTime != null && t.endTime != null) durations.set(id, Math.max(0, t.endTime - t.startTime));
      }
      const pa = new PerformanceAnalysis(this.timings, this.statuses, this.taskGraph, this.batchSiblings, this.parallel, this.options);
      dump.criticalPath = pa.criticalPath(durations);
    } catch (e) {
      dump.error = String(e && e.stack ? e.stack : e);
    }
    write();
    return summary;
  };
} catch (e) {
  dump.error = `hook install failed: ${e && e.stack ? e.stack : e}`;
}
write();

process.argv = [process.argv[0], nxBin, ...process.argv.slice(2)];
require(nxBin);
