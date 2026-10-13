#!/usr/bin/env bash
# Like prepare.sh, for the slow-projects workspaces at 100 projects: branches agents/<setup>-slow-100.
set -euo pipefail
SRC=~/work/nx-atomization-vs-sharding/workspaces/size-slow
OUT=${OUT:-$(dirname "$0")/ws}
HERE=$(dirname "$0")
for setup in baseline sharded atomized; do
  name=$setup-slow-100
  dir=$OUT/$name
  rm -rf "$dir"
  git clone --quiet --no-local "$SRC/$setup-100" "$dir"
  git -C "$dir" checkout --quiet -b "agents/$name" full
  if [ "$setup" = baseline ]; then targets=component-test,e2e,test; else targets=component-test-ci,e2e-ci,test-ci; fi
  python3 "$HERE/patch.py" "$dir" "$targets" ""
  if [ "$setup" = sharded ]; then
    # CI has no SHARD_TARGET_SECONDS: pin the 10 s target the local runs used.
    python3 - "$dir/nx.json" <<'PY'
import json, sys
p = sys.argv[1]; nx = json.load(open(p))
for pl in nx["plugins"]:
    if isinstance(pl, dict) and "shard-plugin" in pl["plugin"]:
        pl["options"]["targetShardSeconds"] = 10
json.dump(nx, open(p, "w"), indent=2); open(p, "a").write("\n")
PY
  fi
  mkdir -p "$dir/.nx/workflows" "$dir/.github/workflows"
  cp "$HERE/agents.yaml" "$dir/.nx/workflows/agents.yaml"
  sed -e "s/__TARGETS__/$targets/g" -e "s/__NAME__/$name/g" "$HERE/workflow.yml" > "$dir/.github/workflows/agents.yml"
  git -C "$dir" add -A
  git -C "$dir" -c user.name=bench -c user.email=bench@example.com commit --quiet -m "ci: run on Nx Agents ($name)"
  echo "$name: $(git -C "$dir" rev-parse --short HEAD) targets=$targets"
done
