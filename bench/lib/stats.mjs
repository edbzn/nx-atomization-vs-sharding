export const sum = (xs) => xs.reduce((a, b) => a + b, 0);
export const mean = (xs) => (xs.length ? sum(xs) / xs.length : null);

/** Linear-interpolated quantile (q in [0,1]); null for empty input. */
export function quantile(xs, q) {
  const v = xs.filter((x) => x != null && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const pos = (v.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return v[lo] + (v[hi] - v[lo]) * (pos - lo);
}
export const median = (xs) => quantile(xs, 0.5);
export const p95 = (xs) => quantile(xs, 0.95);
// reduce, not Math.min(...xs): spreading hits the argument limit on long runs (size sweep).
export const min = (xs) => (xs.length ? xs.reduce((m, x) => Math.min(m, x), Infinity) : null);
export const max = (xs) => (xs.length ? xs.reduce((m, x) => Math.max(m, x), -Infinity) : null);

export const round = (x, d = 0) => (x == null || !Number.isFinite(x) ? x : Math.round(x * 10 ** d) / 10 ** d);

/** Downsample rows to at most n by bucketing on index and keeping each bucket's max per column (peaks survive). */
export function downsampleMax(rows, n, keyCol = 0) {
  if (rows.length <= n) return rows;
  const step = rows.length / n;
  const out = [];
  for (let i = 0; i < n; i++) {
    const bucket = rows.slice(Math.floor(i * step), Math.floor((i + 1) * step));
    if (!bucket.length) continue;
    const row = bucket[0].map((_, c) => (c === keyCol ? bucket[0][c] : Math.max(...bucket.map((r) => r[c]))));
    out.push(row);
  }
  return out;
}

export function fmtMs(ms) {
  if (ms == null) return '-';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  return `${m}m${String(Math.round(s - m * 60)).padStart(2, '0')}s`;
}
