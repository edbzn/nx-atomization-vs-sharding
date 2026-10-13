#!/usr/bin/env bash
# Builds one branch per generated workspace (agents/<setup>-<size>) with the Nx Agents CI on top
# of the workspace's own `full` history. Usage: prepare.sh <nxCloudId or "">
set -euo pipefail
SRC=~/work/nx-atomization-vs-sharding/workspaces/size-quick
OUT=${OUT:-$(dirname "$0")/ws}
HERE=$(dirname "$0")
CLOUD_ID=${1:-}
mkdir -p "$OUT"

for setup in baseline sharded atomized; do
  for size in 12 50 100; do
    name=$setup-$size
    dir=$OUT/$name
    rm -rf "$dir"
    git clone --quiet --no-local "$SRC/$name" "$dir"
    git -C "$dir" checkout --quiet -b "agents/$name" full
    if [ "$setup" = baseline ]; then targets=component-test,e2e,test; else targets=component-test-ci,e2e-ci,test-ci; fi
    python3 "$HERE/patch.py" "$dir" "$targets" "$CLOUD_ID"
    mkdir -p "$dir/.nx/workflows" "$dir/.github/workflows"
    cp "$HERE/agents.yaml" "$dir/.nx/workflows/agents.yaml"
    sed -e "s/__TARGETS__/$targets/g" -e "s/__NAME__/$name/g" "$HERE/workflow.yml" > "$dir/.github/workflows/agents.yml"
    git -C "$dir" add -A
    git -C "$dir" -c user.name=bench -c user.email=bench@example.com commit --quiet -m "ci: run on Nx Agents ($name)"
    echo "$name: $(git -C "$dir" rev-parse --short HEAD) targets=$targets"
  done
done
