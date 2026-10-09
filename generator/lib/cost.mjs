// Linear runtime cost model: seconds = sum(coefficient[feature] * count[feature]).
// Coefficients live in generator/calibration.json and are fitted from measured runs by
// generator/calibrate.mjs (non-negative least squares over per-spec durations).

export function estimate(model, cost) {
  let s = 0;
  for (const [k, v] of Object.entries(cost)) s += (model[k] ?? 0) * v;
  return s;
}
