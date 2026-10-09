// Fallback: parse Nx 23's printed end-of-run performance report (formatReport in
// nx/dist/src/tasks-runner/life-cycles/performance-report.js) from a static-output log:
//
//   Run duration:      2.4s
//   Cache:             Skipped (--skip-nx-cache)
//   Critical path:     1.8s (2 tasks)
//   Recoverable time:  550ms (23% of the run)
//
// Durations use the native formatDuration: "<1ms", "999ms", "1.5s", "2m 5s", "62m 5s".
// The printed report does not split recoverable time into parallel vs machines, nor show
// coordinator overhead; the nx-hook.cjs launcher captures those structurally.

export function parseNxDuration(s) {
  s = s.trim();
  if (s === '<1ms') return 0.5;
  let ms = 0;
  let matched = false;
  for (const m of s.matchAll(/(\d+(?:\.\d+)?)\s*(ms|h|m|s)\b/g)) {
    matched = true;
    const v = Number(m[1]);
    ms += m[2] === 'ms' ? v : m[2] === 's' ? v * 1000 : m[2] === 'm' ? v * 60_000 : v * 3_600_000;
  }
  return matched ? ms : null;
}

export function parsePerformanceReport(log) {
  // Strip ANSI + OSC 8 hyperlinks.
  const clean = log.replace(/\x1b\]8;;[^\x07\x1b]*(\x07|\x1b\\)/g, '').replace(/\x1b\[[0-9;]*m/g, '');
  const idx = clean.lastIndexOf('Run duration:');
  if (idx < 0) return null;
  const block = clean.slice(idx).split('\n').slice(0, 40);
  const line = (label) => block.find((l) => l.trim().startsWith(`${label}:`))?.split(`${label}:`)[1]?.trim();
  const run = line('Run duration');
  const cp = line('Critical path');
  const rec = line('Recoverable time');
  const cache = line('Cache');
  const out = {
    source: 'log',
    runDuration: run ? parseNxDuration(run) : null,
    criticalPathDuration: cp ? parseNxDuration(cp.split('(')[0]) : null,
    criticalPathTaskCount: cp ? Number(cp.match(/\((\d+) tasks?\)/)?.[1] ?? NaN) : null,
    recoverable: rec ? parseNxDuration(rec.split('(')[0]) : null,
    recoverablePct: rec ? Number(rec.match(/\((\d+)% of the run\)/)?.[1] ?? 0) : null,
    cache: cache ?? null,
    recommendations: [],
  };
  const recIdx = block.findIndex((l) => /Recommendations?:/.test(l));
  if (recIdx >= 0) {
    const single = block[recIdx].split(/Recommendation:/)[1];
    if (single?.trim()) out.recommendations.push(single.trim());
    else {
      for (const l of block.slice(recIdx + 1)) {
        if (/^\s{4}- /.test(l)) out.recommendations.push(l.trim().slice(2));
        else if (/^\s{6}\S/.test(l) && out.recommendations.length) out.recommendations[out.recommendations.length - 1] += `\n${l.trim()}`;
        else if (l.trim() === '') break;
      }
    }
  }
  return out;
}
