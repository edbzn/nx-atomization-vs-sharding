#!/usr/bin/env node
// Process-tree sampler. Runs as its own process (forked by run.mjs) so its CPU cost is
// measured cleanly and its synchronous /proc reads never block log piping.
//
// Protocol (IPC): parent sends {type:'start', rootPid, marker, intervalMs, pssBudget, out}
// once nx is spawned, then {type:'stop'}; the sampler does a final tick, writes `out`
// (gzipped JSON) and replies {type:'done', stats} before exiting.
//
// What a tick does:
//  1. list /proc; read /proc/<pid>/stat for every pid that is ours or new (known foreign
//     pids are skipped and only re-validated every ~10s, so the steady-state cost is the
//     tree size, not the machine's process count);
//  2. a new pid is ours if its ppid is ours, or (for double-forked processes reparented to
//     init / a subreaper) if /proc/<pid>/environ contains BENCH_RUN_ID=<marker>;
//  3. attribution: NX_TASK_TARGET_PROJECT/TARGET/CONFIGURATION in the process's own environ
//     (Nx sets them on every task process; children inherit them), else the parent's
//     attribution, else "(nx)" (the Nx coordinator, plugin workers, pnpm);
//  4. PSS from /proc/<pid>/smaps_rollup is expensive for Chromium/Electron processes
//     (~5-7ms each: the kernel walks their huge VMAs), so it is refreshed round-robin
//     under a per-tick time budget; between refreshes a process's PSS is estimated as
//     RSS x (its last PSS/RSS ratio). New processes are refreshed first.
import { gzipSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  CLK_TCK,
  envGet,
  listPids,
  readCpuTimes,
  readEnvironRaw,
  readLoadavg,
  readMeminfo,
  readPss,
  readStat,
} from './proc.mjs';

const MB = 1024 * 1024;
const NX_ATTR = '(nx)';
const REVALIDATE_MS = 10_000;

export function createSampler({ rootPid, marker, intervalMs = 250, pssBudget = 0.15, now = Date.now }) {
  const known = new Map(); // pid -> entry
  const exited = []; // finished process entries
  const samples = [];
  const taskSeries = new Map(); // attr -> [[tickIdx, pssMB, rssMB, cores, nprocs]]
  const tasks = new Map(); // attr -> aggregate
  const tickDurations = [];
  const startedAt = now();
  const cpuAtStart = process.cpuUsage(); // exclude the sampler's own boot from its overhead
  const revalidateTicks = Math.max(1, Math.round(REVALIDATE_MS / intervalMs));
  const markerToken = marker ? `BENCH_RUN_ID=${marker}` : null;
  let tick = 0;
  let lastTickAt = null;
  let lastCpu = null;
  let pssReads = 0;
  let pssReadMs = 0;
  let estimatedCount = 0;
  let measuredCount = 0;
  const ratioByComm = new Map(); // comm -> last pss/rss ratio, for never-measured processes

  function taskAgg(attr) {
    let t = tasks.get(attr);
    if (!t) {
      t = {
        attr,
        firstSeen: null,
        lastSeen: null,
        peakPss: 0,
        peakRss: 0,
        peakProcs: 0,
        pids: new Set(),
      };
      tasks.set(attr, t);
    }
    return t;
  }

  function attrFromEnv(raw) {
    const project = envGet(raw, 'NX_TASK_TARGET_PROJECT');
    if (!project) return null;
    const target = envGet(raw, 'NX_TASK_TARGET_TARGET');
    const config = envGet(raw, 'NX_TASK_TARGET_CONFIGURATION');
    return config ? `${project}:${target}:${config}` : `${project}:${target}`;
  }

  function doTick() {
    const t0 = process.hrtime.bigint();
    const ts = now();
    const dt = lastTickAt == null ? intervalMs / 1000 : Math.max(0.001, (ts - lastTickAt) / 1000);
    const pids = listPids();
    const present = new Set(pids);
    const fresh = [];

    for (const pid of pids) {
      let e = known.get(pid);
      if (e && !e.ours && tick - e.checkedTick < revalidateTicks) continue;
      const st = readStat(pid);
      if (!st) continue;
      if (e && e.starttime !== st.starttime) {
        if (e.ours) retire(e);
        known.delete(pid);
        e = undefined;
      }
      if (!e) fresh.push(st);
      else if (e.ours) e.st = st;
      else e.checkedTick = tick;
    }

    // Parents start before children: resolve in starttime order so a child sees its parent.
    fresh.sort((a, b) => a.starttime - b.starttime || a.pid - b.pid);
    for (const st of fresh) {
      const parent = known.get(st.ppid);
      let ours = st.pid === rootPid || (parent?.ours ?? false);
      let raw = null;
      if (!ours && markerToken) {
        raw = readEnvironRaw(st.pid);
        ours = raw != null && raw.includes(markerToken);
      }
      if (!ours) {
        known.set(st.pid, { pid: st.pid, ours: false, starttime: st.starttime, checkedTick: tick });
        continue;
      }
      raw ??= readEnvironRaw(st.pid);
      const own = raw ? attrFromEnv(raw) : null;
      const attr = own ?? (parent?.ours ? parent.attr : NX_ATTR);
      known.set(st.pid, {
        pid: st.pid,
        ours: true,
        starttime: st.starttime,
        comm: st.comm,
        attr,
        reparented: !(parent?.ours) && st.pid !== rootPid,
        st,
        prevCpu: 0,
        cpu: 0,
        pss: null,
        pssAt: -1,
        ratio: null,
        peakRss: 0,
        peakPss: 0,
        firstSeen: ts - startedAt,
        lastSeen: ts - startedAt,
      });
    }

    // Retire exited processes.
    for (const [pid, e] of known) {
      if (!present.has(pid)) {
        if (e.ours) retire(e);
        known.delete(pid);
      }
    }

    // PSS refresh: new processes first, then least-recently refreshed, under a time budget.
    const ours = [];
    for (const e of known.values()) if (e.ours && e.st) ours.push(e);
    ours.sort((a, b) => a.pssAt - b.pssAt);
    const budgetNs = BigInt(Math.round(intervalMs * pssBudget * 1e6));
    const pssStart = process.hrtime.bigint();
    for (const e of ours) {
      if (process.hrtime.bigint() - pssStart > budgetNs && e.pssAt >= 0) break;
      const pss = readPss(e.pid);
      pssReads++;
      if (pss == null) continue;
      e.pss = pss;
      e.pssAt = tick;
      e.ratio = e.st.rssBytes > 0 ? pss / e.st.rssBytes : 1;
      ratioByComm.set(e.comm, e.ratio);
    }
    pssReadMs += Number(process.hrtime.bigint() - pssStart) / 1e6;

    // Aggregate.
    let totPss = 0;
    let totRss = 0;
    let totCpu = 0;
    let n = 0;
    let estimated = 0;
    const per = new Map();
    for (const e of ours) {
      const st = e.st;
      const cpu = st.utime + st.stime;
      const dCpu = Math.max(0, cpu - e.prevCpu) / CLK_TCK;
      e.prevCpu = cpu;
      e.cpu = cpu;
      let pss;
      if (e.pssAt === tick) pss = e.pss;
      else {
        const ratio = e.ratio ?? ratioByComm.get(e.comm) ?? 1;
        pss = st.rssBytes * ratio;
        estimated++;
      }
      e.peakRss = Math.max(e.peakRss, st.rssBytes);
      e.peakPss = Math.max(e.peakPss, pss);
      e.lastSeen = ts - startedAt;
      totPss += pss;
      totRss += st.rssBytes;
      totCpu += dCpu / dt;
      n++;
      let p = per.get(e.attr);
      if (!p) per.set(e.attr, (p = { pss: 0, rss: 0, cpu: 0, n: 0 }));
      p.pss += pss;
      p.rss += st.rssBytes;
      p.cpu += dCpu / dt;
      p.n++;
      taskAgg(e.attr).pids.add(`${e.pid}:${e.starttime}`);
    }
    estimatedCount += estimated;
    measuredCount += n - estimated;
    for (const [attr, p] of per) {
      const t = taskAgg(attr);
      t.firstSeen ??= ts - startedAt;
      t.lastSeen = ts - startedAt;
      t.peakPss = Math.max(t.peakPss, p.pss);
      t.peakRss = Math.max(t.peakRss, p.rss);
      t.peakProcs = Math.max(t.peakProcs, p.n);
      let s = taskSeries.get(attr);
      if (!s) taskSeries.set(attr, (s = []));
      s.push([tick, r1(p.pss / MB), r1(p.rss / MB), r2(p.cpu), p.n]);
    }

    // System-wide.
    // timestamp the /proc/stat read itself: a slow tick would otherwise skew the rate
    const cpuT = readCpuTimes();
    cpuT.at = now();
    const sysCores = lastCpu ? (cpuT.busy - lastCpu.busy) / CLK_TCK / Math.max(0.001, (cpuT.at - lastCpu.at) / 1000) : 0;
    lastCpu = cpuT;
    const mem = readMeminfo();
    const load = readLoadavg();
    samples.push([
      ts - startedAt,
      r1(totPss / MB),
      r1(totRss / MB),
      r2(totCpu),
      n,
      r2(sysCores),
      Math.round(mem.memAvailable / MB),
      load.load1,
      n ? r2(estimated / n) : 0,
    ]);

    lastTickAt = ts;
    tick++;
    tickDurations.push(Number(process.hrtime.bigint() - t0) / 1e6);
  }

  function retire(e) {
    exited.push(e);
  }

  function result() {
    const procs = [...exited, ...[...known.values()].filter((e) => e.ours)];
    const cpuByAttr = new Map();
    for (const e of procs) cpuByAttr.set(e.attr, (cpuByAttr.get(e.attr) ?? 0) + e.cpu / CLK_TCK);
    const perTask = {};
    for (const [attr, t] of tasks) {
      perTask[attr] = {
        firstSeenMs: t.firstSeen,
        lastSeenMs: t.lastSeen,
        peakPssMb: r1(t.peakPss / MB),
        peakRssMb: r1(t.peakRss / MB),
        peakProcs: t.peakProcs,
        procs: t.pids.size,
        cpuSeconds: r2(cpuByAttr.get(attr) ?? 0),
      };
    }
    const sorted = [...tickDurations].sort((a, b) => a - b);
    const self = process.cpuUsage(cpuAtStart);
    const elapsed = (now() - startedAt) / 1000;
    return {
      version: 1,
      startedAt,
      rootPid,
      marker,
      intervalMs,
      pssBudget,
      clkTck: CLK_TCK,
      columns: ['tMs', 'pssMb', 'rssMb', 'cores', 'procs', 'sysCores', 'memAvailMb', 'load1', 'pssEstimatedFraction'],
      samples,
      taskColumns: ['tick', 'pssMb', 'rssMb', 'cores', 'procs'],
      taskSeries: Object.fromEntries(taskSeries),
      perTask,
      processes: procs.map((e) => ({
        pid: e.pid,
        comm: e.comm,
        attr: e.attr,
        reparented: e.reparented,
        cpuSeconds: r2(e.cpu / CLK_TCK),
        peakRssMb: r1(e.peakRss / MB),
        peakPssMb: r1(e.peakPss / MB),
        firstSeenMs: e.firstSeen,
        lastSeenMs: e.lastSeen,
      })),
      overhead: {
        ticks: tick,
        elapsedSeconds: r2(elapsed),
        cpuSeconds: r2((self.user + self.system) / 1e6),
        cores: r3((self.user + self.system) / 1e6 / Math.max(elapsed, 0.001)),
        tickMsMean: r2(sorted.reduce((a, b) => a + b, 0) / Math.max(1, sorted.length)),
        tickMsP95: r2(sorted[Math.floor(sorted.length * 0.95)] ?? 0),
        tickMsMax: r2(sorted[sorted.length - 1] ?? 0),
        pssReads,
        pssReadMsTotal: r1(pssReadMs),
        pssEstimatedFraction: r3(estimatedCount / Math.max(1, estimatedCount + measuredCount)),
      },
    };
  }

  return { tick: doTick, result, startedAt };
}

const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const r3 = (x) => Math.round(x * 1000) / 1000;

// --- child-process entry point ---
if (process.send && process.argv[1] === fileURLToPath(import.meta.url)) {
  let sampler = null;
  let out = null;
  let timer = null;
  let interval = 250;
  let stopping = false;
  let next = 0;
  const loop = () => {
    if (stopping) return;
    try {
      sampler.tick();
    } catch (e) {
      process.stderr.write(`sampler tick error: ${e.stack}\n`);
    }
    next += interval;
    timer = setTimeout(loop, Math.max(0, next - Date.now()));
  };
  const finish = () => {
    stopping = true;
    clearTimeout(timer);
    let stats = null;
    if (sampler) {
      try {
        sampler.tick();
      } catch {}
      const res = sampler.result();
      writeFileSync(out, gzipSync(JSON.stringify(res)));
      stats = res.overhead;
    }
    process.send({ type: 'done', stats }, () => process.exit(0));
  };
  process.on('message', (m) => {
    if (m.type === 'start') {
      interval = m.intervalMs ?? 250;
      out = m.out;
      sampler = createSampler({ rootPid: m.rootPid, marker: m.marker, intervalMs: interval, pssBudget: m.pssBudget ?? 0.15 });
      next = Date.now();
      loop();
    } else if (m.type === 'stop') finish();
  });
  process.on('disconnect', () => {
    if (!stopping) finish();
  });
  process.send({ type: 'ready' });
}
