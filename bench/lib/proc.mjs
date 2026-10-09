// Low-level /proc helpers (Linux only). Everything is synchronous and allocation-light:
// the sampler calls these every tick.
import { readFileSync, readdirSync, readlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

export const PAGE_SIZE = (() => {
  try {
    return Number(execFileSync('getconf', ['PAGESIZE'], { encoding: 'utf8' }).trim()) || 4096;
  } catch {
    return 4096;
  }
})();

export const CLK_TCK = (() => {
  try {
    return Number(execFileSync('getconf', ['CLK_TCK'], { encoding: 'utf8' }).trim()) || 100;
  } catch {
    return 100;
  }
})();

/** Numeric entries of /proc. */
export function listPids() {
  const out = [];
  for (const name of readdirSync('/proc')) {
    const c = name.charCodeAt(0);
    if (c >= 48 && c <= 57) out.push(Number(name));
  }
  return out;
}

/**
 * Parse /proc/<pid>/stat. `comm` may contain spaces and parentheses, so split after the
 * LAST ')'. Field numbers below follow proc(5) (1-based): 4 ppid, 14 utime, 15 stime,
 * 22 starttime, 24 rss (pages).
 */
export function readStat(pid) {
  let s;
  try {
    s = readFileSync(`/proc/${pid}/stat`, 'latin1');
  } catch {
    return null;
  }
  const open = s.indexOf('(');
  const close = s.lastIndexOf(')');
  const comm = s.slice(open + 1, close);
  const f = s.slice(close + 2).split(' ');
  // f[0] = field 3 (state)
  return {
    pid,
    comm,
    state: f[0],
    ppid: Number(f[1]),
    pgrp: Number(f[2]),
    utime: Number(f[11]),
    stime: Number(f[12]),
    starttime: Number(f[19]),
    rssBytes: Number(f[21]) * PAGE_SIZE,
  };
}

/** PSS (bytes) from /proc/<pid>/smaps_rollup, or null if unreadable/gone. */
export function readPss(pid) {
  let s;
  try {
    s = readFileSync(`/proc/${pid}/smaps_rollup`, 'latin1');
  } catch {
    return null;
  }
  const i = s.indexOf('\nPss:');
  if (i < 0) return null;
  const j = s.indexOf('kB', i);
  return Number(s.slice(i + 5, j).trim()) * 1024;
}

/** Raw environ string (NUL separated), or null when unreadable (other user / gone). */
export function readEnvironRaw(pid) {
  try {
    return readFileSync(`/proc/${pid}/environ`, 'latin1');
  } catch {
    return null;
  }
}

/** Value of `key` in a raw environ string, or undefined. */
export function envGet(raw, key) {
  const needle = `${key}=`;
  let i = raw.startsWith(needle) ? 0 : raw.indexOf(`\0${needle}`);
  if (i < 0) return undefined;
  if (i > 0) i += 1;
  const start = i + needle.length;
  const end = raw.indexOf('\0', start);
  return raw.slice(start, end < 0 ? raw.length : end);
}

export function readCmdline(pid) {
  try {
    return readFileSync(`/proc/${pid}/cmdline`, 'latin1').split('\0').filter(Boolean).join(' ');
  } catch {
    return '';
  }
}

export function readExe(pid) {
  try {
    return readlinkSync(`/proc/${pid}/exe`);
  } catch {
    return '';
  }
}

/** {memTotal, memAvailable, swapUsed} in bytes. */
export function readMeminfo() {
  const s = readFileSync('/proc/meminfo', 'latin1');
  const get = (k) => {
    const i = s.indexOf(`${k}:`);
    if (i < 0) return 0;
    return Number(s.slice(i + k.length + 1, s.indexOf('kB', i)).trim()) * 1024;
  };
  return {
    memTotal: get('MemTotal'),
    memAvailable: get('MemAvailable'),
    swapUsed: get('SwapTotal') - get('SwapFree'),
  };
}

export function readLoadavg() {
  const [l1, l5, l15] = readFileSync('/proc/loadavg', 'latin1').split(' ').map(Number);
  return { load1: l1, load5: l5, load15: l15 };
}

/** Aggregate CPU jiffies from /proc/stat: {busy, total}. busy excludes idle + iowait. */
export function readCpuTimes() {
  const s = readFileSync('/proc/stat', 'latin1');
  const line = s.slice(0, s.indexOf('\n'));
  const v = line.split(/\s+/).slice(1).map(Number);
  // user nice system idle iowait irq softirq steal guest guest_nice
  const idle = v[3] + (v[4] || 0);
  // guest time is already included in user/nice
  const total = v.slice(0, 8).reduce((a, b) => a + b, 0);
  return { busy: total - idle, total };
}

/** Pids whose environ has `KEY=value` (or any value of KEY when value is null). Skips `excludePids`. */
export function findPidsWithEnv(key, value, excludePids = new Set()) {
  const out = [];
  for (const pid of listPids()) {
    if (excludePids.has(pid)) continue;
    const raw = readEnvironRaw(pid);
    if (raw == null) continue;
    if (value == null ? envGet(raw, key) !== undefined : envGet(raw, key) === value) out.push(pid);
  }
  return out;
}

export function pidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === 'EPERM';
  }
}

/**
 * SIGTERM the given pids, wait up to `graceMs`, then SIGKILL survivors. Zombies count as
 * dead. Returns [{pid, comm, cmdline, killedWith}].
 */
export async function killPids(pids, graceMs = 3000) {
  const info = pids.map((pid) => {
    const st = readStat(pid);
    return { pid, comm: st?.comm ?? '?', cmdline: readCmdline(pid).slice(0, 300), killedWith: 'SIGTERM' };
  });
  for (const { pid } of info) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {}
  }
  const alive = (pid) => {
    const st = readStat(pid);
    return st != null && st.state !== 'Z' && st.state !== 'X';
  };
  const deadline = Date.now() + graceMs;
  while (Date.now() < deadline && info.some((p) => alive(p.pid))) {
    await new Promise((r) => setTimeout(r, 100));
  }
  for (const p of info) {
    if (alive(p.pid)) {
      p.killedWith = 'SIGKILL';
      try {
        process.kill(p.pid, 'SIGKILL');
      } catch {}
    }
  }
  return info;
}

/** Processes whose comm/exe looks like a test runner/browser — used to spot orphans without our marker. */
export const SUSPECT_RE = /cypress|chrome|chromium|electron|headless_shell|playwright|vite|vitest|firefox|webkit/i;

export function listSuspects() {
  const out = new Map();
  for (const pid of listPids()) {
    const st = readStat(pid);
    if (!st) continue;
    if (SUSPECT_RE.test(st.comm) || SUSPECT_RE.test(readExe(pid))) {
      // orphan-like: parented by init or a subreaper (systemd --user), not e.g. the user's own Chrome
      const parent = st.ppid === 1 ? null : readStat(st.ppid);
      const orphanLike = st.ppid === 1 || parent?.comm === 'systemd' || parent?.comm === 'init';
      out.set(pid, { pid, comm: st.comm, starttime: st.starttime, ppid: st.ppid, orphanLike });
    }
  }
  return out;
}

export function hostInfo() {
  let cpuModel = '';
  try {
    const s = readFileSync('/proc/cpuinfo', 'latin1');
    const m = s.match(/model name\s*:\s*(.*)/);
    cpuModel = m ? m[1].trim() : '';
  } catch {}
  let kernel = '';
  try {
    kernel = readFileSync('/proc/sys/kernel/osrelease', 'latin1').trim();
  } catch {}
  const mem = readMeminfo();
  return { cpuModel, kernel, memTotalGb: +(mem.memTotal / 2 ** 30).toFixed(1) };
}
