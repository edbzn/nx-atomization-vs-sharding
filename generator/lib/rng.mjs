// Deterministic PRNG helpers (mulberry32). Never use Math.random in the generator.

export function createRng(seed) {
  let a = hashSeed(seed);
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng = {
    next,
    /** integer in [min, max] */
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    float: (min, max) => min + next() * (max - min),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    bool: (p = 0.5) => next() < p,
    shuffle: (arr) => {
      const out = arr.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
    /** standard normal via Box-Muller */
    normal: () => {
      const u = Math.max(next(), 1e-12);
      const v = next();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    /** derive an independent child stream */
    fork: (label) => createRng(`${seed}/${label}`),
  };
  return rng;
}

function hashSeed(seed) {
  const s = String(seed);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Sample `count` spec runtime targets (seconds) from a clamped log-normal,
 * then rescale so the mean lands on `mean`. Deterministic for a given rng.
 */
export function sampleTargets(rng, count, { mean, min, max, sigma }) {
  const raw = Array.from({ length: count }, () => Math.exp(sigma * rng.normal()));
  let vals = raw;
  // iterate rescale + clamp a few times so the clamped mean converges on `mean`
  let scale = mean / (raw.reduce((s, v) => s + v, 0) / count);
  for (let i = 0; i < 20; i++) {
    vals = raw.map((v) => Math.min(max, Math.max(min, v * scale)));
    const m = vals.reduce((s, v) => s + v, 0) / count;
    scale *= mean / m;
  }
  return vals.map((v) => Math.round(v * 100) / 100);
}
