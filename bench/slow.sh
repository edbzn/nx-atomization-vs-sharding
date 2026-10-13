#!/usr/bin/env bash
# The quick experiment with slow projects: SIZE_SLOW=0.2 gives a fifth of each runner's projects
# (at least one each) slow specs, 15 s median for Cypress and Playwright (5 to 60 s) and 3 s for
# Vitest (1 to 8 s), so a few projects dominate the run. Every other project is identical to
# bench/quick.sh's. One run per configuration:
#   - default, sharded (10 s target) and atomized, all runners, --parallel=8
#   - each runner on its own (Cypress CT, Playwright, Vitest), three setups, --parallel=8
# Results: results/slow$SUF/raw -> aggregate + chart datasets in results/slow$SUF/report.
#
#   bash bench/slow.sh             # 12 projects -> results/slow
#   N=50 bash bench/slow.sh        # 50 projects -> results/slow-50
set -euo pipefail
cd "$(dirname "$0")/.."
export SIZE_DENSITY=large SIZE_E2E_SERVER=shared SIZE_SLOW=${SIZE_SLOW:-0.2}
N=${N:-12}
T=10
SUF=$([ "$N" = 12 ] || echo "-$N")
OUT=results/slow$SUF
MAT=bench/matrices/slow$SUF
mkdir -p "$OUT" "$MAT"

node generator/size.mjs --projects "$N" --out workspaces/size-slow --shard-target "$T" | tee "$OUT/plan.txt"
LINKS=workspaces/closeup-slow$SUF
mkdir -p "$LINKS"
for v in baseline atomized sharded; do ln -sfn "../size-slow/$v-$N" "$LINKS/$v"; done
export BENCH_WORKSPACES_DIR="$PWD/$LINKS"

matrix() { # name json
  printf '%s\n' "$2" > "$MAT/$1.json"
  node bench/matrix.mjs "$MAT/$1.json"
}
common='"rotate": true, "cooldownSec": 5, "minMemAvailableGb": 12, "out": "'"$OUT"'/raw", "runArgs": {"interval": 250, "timeout-min": 60}'
sharded() { echo '"label": "target'"$1"'", "env": {"SHARD_TARGET_SECONDS": "'"$1"'"}'; }

cfg() { echo '{"scenario": "full", "runner": "'"$1"'", "parallel": '"$2"'}'; }
matrix ends '{"reps": 1, "workspaces": ["baseline", "atomized"], "configs": ['"$(cfg all 8), $(cfg ct 8), $(cfg e2e 8), $(cfg unit 8)"'], '"$common"'}'
matrix sharded '{"reps": 1, "workspaces": ["sharded"], "scenarios": ["full"], "runners": ["all", "ct", "e2e", "unit"], "parallel": [8], '"$(sharded $T)"', '"$common"'}'

mkdir -p "$OUT/sim"
node bench/aggregate.mjs --raw "$OUT/raw" --out "$OUT"
node bench/report-data.mjs --results "$OUT" --default-shard-target 90 --sharded-label "target$T" --size-sweep /dev/null || true
echo "[slow] done: $OUT/report"
