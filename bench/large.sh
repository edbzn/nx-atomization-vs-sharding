#!/usr/bin/env bash
# The article's experiments on the large-project workspace (SIZE_DENSITY=large: ~20 specs per
# project, 6 to 60), where sharding lands between one task per project and one per spec:
#   1. granularity dial on 50 projects (default, sharded at 30/15/10/5 s targets, atomized),
#   2. pick the sharded target T (finest within 2% of the fastest),
#   3. per-runner and --parallel 4/16 close-ups with sharding at T,
#   4. size sweep 10..200 projects with sharding at T,
#   5. aggregation, DTE simulation and chart datasets under results/closeup-large.
#
#   bash bench/large.sh
set -euo pipefail
cd "$(dirname "$0")/.."
export SIZE_DENSITY=large
N=50
OUT=results/closeup-large
mkdir -p "$OUT" bench/matrices/large

# 0. workspaces (the size sweep generates missing ones too) and close-up links
node generator/size.mjs --projects "$N" --out workspaces/size-large
mkdir -p workspaces/closeup-large
for v in baseline atomized sharded; do ln -sfn "../size-large/$v-$N" "workspaces/closeup-large/$v"; done
export BENCH_WORKSPACES_DIR="$PWD/workspaces/closeup-large"

matrix() { # name json
  printf '%s\n' "$2" > "bench/matrices/large/$1.json"
  node bench/matrix.mjs "bench/matrices/large/$1.json"
}
common='"cooldownSec": 20, "minMemAvailableGb": 16, "out": "'"$OUT"'/raw", "runArgs": {"interval": 250, "timeout-min": 60}'

# 1. dial: default + atomized, then sharded at each target
matrix dial-ends '{"reps": 1, "workspaces": ["baseline", "atomized"], "configs": [{"scenario": "full", "runner": "all", "parallel": 8}], '"$common"'}'
for t in 30 15 10 5; do
  matrix "dial-$t" '{"reps": 1, "workspaces": ["sharded"], "configs": [{"scenario": "full", "runner": "all", "parallel": 8, "label": "target'"$t"'", "env": {"SHARD_TARGET_SECONDS": "'"$t"'"}}], '"$common"'}'
done

# 2. sharded target: the finest one within 2% of the fastest (same wall time, more tasks to
#    spread over slots and agents)
T=$(node -e '
const fs = require("fs"), p = process.argv[1];
const runs = [];
for (const d of fs.readdirSync(p)) {
  const m = d.match(/_sharded_full_all_p8_r1_target([\d.]+)$/); if (!m) continue;
  const s = JSON.parse(fs.readFileSync(`${p}/${d}/summary.json`, "utf8"));
  if (s.ok) runs.push({ t: Number(m[1]), wall: s.exitAt - s.spawnAt });
}
const fastest = Math.min(...runs.map((r) => r.wall));
console.log(Math.min(...runs.filter((r) => r.wall <= fastest * 1.02).map((r) => r.t)));' "$OUT/raw")
echo "[large] sharded target: ${T}s (finest within 2% of the fastest)"
echo "$T" > "$OUT/shard-target.txt"

# 3. close-ups
matrix runners-ends '{"reps": 1, "workspaces": ["baseline", "atomized"], "scenarios": ["full"], "runners": ["ct", "e2e", "unit"], "parallel": [8], "rotate": true, '"$common"'}'
matrix runners-sharded '{"reps": 1, "workspaces": ["sharded"], "configs": [{"scenario": "full", "runner": "ct", "parallel": 8}, {"scenario": "full", "runner": "e2e", "parallel": 8}, {"scenario": "full", "runner": "unit", "parallel": 8}], "label": "target'"$T"'", "env": {"SHARD_TARGET_SECONDS": "'"$T"'"}, '"$common"'}'
matrix parallel-ends '{"reps": 1, "workspaces": ["baseline", "atomized"], "configs": [{"scenario": "full", "runner": "all", "parallel": 4}, {"scenario": "full", "runner": "all", "parallel": 16}], "rotate": true, '"$common"'}'
matrix parallel-sharded '{"reps": 1, "workspaces": ["sharded"], "configs": [{"scenario": "full", "runner": "all", "parallel": 4}, {"scenario": "full", "runner": "all", "parallel": 16}], "label": "target'"$T"'", "env": {"SHARD_TARGET_SECONDS": "'"$T"'"}, '"$common"'}'

# 4. size sweep
node bench/size-sweep.mjs --sizes 10,25,50,100,200 --parallel 8 --timeout-min 60 --shard-target "$T" \
  --ws-dir workspaces/size-large --out results/size-sweep-large
node bench/size-sweep-report.mjs --out results/size-sweep-large

# 5. aggregate, simulate, datasets
node bench/aggregate.mjs --raw "$OUT/raw" --out "$OUT"
for from in baseline/full/all/p8 atomized/full/all/p8 "sharded/full/all/p8/target$T"; do
  for tax in "" "ct=17"; do
    extra=()
    [ -n "$tax" ] && extra=(--extra-tax "$tax")
    node bench/simulate.mjs --from "$from" --raw "$OUT/raw" --out "$OUT/sim" \
      --agents 1,2,4,8,16 --slots 3 --policy batch,greedy --bootstrap 60 --penalty 3 --no-gantt --quiet "${extra[@]}"
    for x in 4 8; do
      node bench/simulate.mjs --from "$from" --raw "$OUT/raw" --out "$OUT/sim" \
        --agents 4,8,16 --slots 3 --policy batch,greedy --bootstrap 60 --penalty 3 --no-gantt --quiet --replicate "$x" "${extra[@]}"
    done
  done
done
node bench/report-data.mjs --results "$OUT" --default-shard-target 90 --sharded-label "target$T" \
  --size-sweep results/size-sweep-large/report.json
echo "[large] done: $OUT/report (sharded target ${T}s)"
