#!/usr/bin/env bash
# Close-up experiments on the 100-project size-sweep workspaces (workspaces/size/*-100):
# per-runner comparison and --parallel 4/16 with sharding at a 15 s target (only the biggest
# projects split), plus sharded runs at 90/30/1.5 s targets for the granularity dial (1.5 s:
# ~2 specs per shard, ~260 tasks, halfway between one task per project and one per spec).
# Then aggregation, the DTE simulation and the chart datasets, all under results/closeup.
#
#   bash bench/closeup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p workspaces/closeup
for v in baseline atomized sharded; do ln -sfn "../size/$v-100" "workspaces/closeup/$v"; done
export BENCH_WORKSPACES_DIR="$PWD/workspaces/closeup"

for m in main parallel target fine; do
  node bench/matrix.mjs "bench/matrices/closeup-$m.json"
done

node bench/aggregate.mjs --raw results/closeup/raw --out results/closeup

for w in baseline atomized sharded; do
  from="$w/full/all/p8"
  for tax in "" "ct=17"; do
    extra=()
    [ -n "$tax" ] && extra=(--extra-tax "$tax")
    node bench/simulate.mjs --from "$from" --raw results/closeup/raw --out results/closeup/sim \
      --agents 1,2,4,8,16 --slots 3 --policy batch,greedy --bootstrap 60 --penalty 3 --no-gantt --quiet "${extra[@]}"
    for x in 4 8; do
      node bench/simulate.mjs --from "$from" --raw results/closeup/raw --out results/closeup/sim \
        --agents 4,8,16 --slots 3 --policy batch,greedy --bootstrap 60 --penalty 3 --no-gantt --quiet --replicate "$x" "${extra[@]}"
    done
  done
done

node bench/report-data.mjs --results results/closeup --default-shard-target 15
echo "[closeup] done: results/closeup/report"
