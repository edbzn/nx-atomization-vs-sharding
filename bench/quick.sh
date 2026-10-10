#!/usr/bin/env bash
# The article's experiment, sized to run in about 15 minutes on one machine:
# 12 projects (5 Cypress CT, 5 Vitest, 1 app + 1 Playwright), ~20 specs per project, and the
# Playwright setup Nx intends: one continuous serve-static server per app shared by every e2e
# task (SIZE_E2E_SERVER=shared). One run per configuration:
#   - default, sharded (10 s target) and atomized, all runners, --parallel=8
#   - the shard-target dial: sharded at 30 and 5 s
#   - each runner on its own (Cypress CT, Playwright, Vitest), three setups, --parallel=8
#   - all runners at --parallel=16
# Results: results/quick/raw -> aggregate + chart datasets in results/quick/report.
#
#   bash bench/quick.sh            # 12 projects -> results/quick
#   N=50 bash bench/quick.sh       # 50 projects -> results/quick-50 (about 40 min; 100: about 80 min)
set -euo pipefail
cd "$(dirname "$0")/.."
export SIZE_DENSITY=large SIZE_E2E_SERVER=shared
N=${N:-12}
T=10
SUF=$([ "$N" = 12 ] || echo "-$N")
OUT=results/quick$SUF
MAT=bench/matrices/quick$SUF
mkdir -p "$OUT" "$MAT"

node generator/size.mjs --projects "$N" --out workspaces/size-quick --shard-target "$T"
LINKS=workspaces/closeup-quick$SUF
mkdir -p "$LINKS"
for v in baseline atomized sharded; do ln -sfn "../size-quick/$v-$N" "$LINKS/$v"; done
export BENCH_WORKSPACES_DIR="$PWD/$LINKS"

matrix() { # name json
  printf '%s\n' "$2" > "$MAT/$1.json"
  node bench/matrix.mjs "$MAT/$1.json"
}
common='"rotate": true, "cooldownSec": 5, "minMemAvailableGb": 12, "out": "'"$OUT"'/raw", "runArgs": {"interval": 250, "timeout-min": 30}'
sharded() { echo '"label": "target'"$1"'", "env": {"SHARD_TARGET_SECONDS": "'"$1"'"}'; }

cfg() { echo '{"scenario": "full", "runner": "'"$1"'", "parallel": '"$2"'}'; }
matrix ends '{"reps": 1, "workspaces": ["baseline", "atomized"], "configs": ['"$(cfg all 8), $(cfg ct 8), $(cfg e2e 8), $(cfg unit 8), $(cfg all 16)"'], '"$common"'}'
matrix sharded '{"reps": 1, "workspaces": ["sharded"], "scenarios": ["full"], "runners": ["all", "ct", "e2e", "unit"], "parallel": [8], '"$(sharded $T)"', '"$common"'}'
matrix sharded-16 '{"reps": 1, "workspaces": ["sharded"], "configs": [{"scenario": "full", "runner": "all", "parallel": 16}], '"$(sharded $T)"', '"$common"'}'
for t in 30 5; do
  matrix "dial-$t" '{"reps": 1, "workspaces": ["sharded"], "configs": [{"scenario": "full", "runner": "all", "parallel": 8}], '"$(sharded $t)"', '"$common"'}'
done

mkdir -p "$OUT/sim"
node bench/aggregate.mjs --raw "$OUT/raw" --out "$OUT"
node bench/report-data.mjs --results "$OUT" --default-shard-target 90 --sharded-label "target$T" --size-sweep /dev/null || true
echo "[quick] done: $OUT/report"
