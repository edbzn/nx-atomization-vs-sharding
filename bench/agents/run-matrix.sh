#!/usr/bin/env bash
# Runs the Nx Agents matrix one run at a time: 3 setups x 12/50/100 projects x 3/5/8 agents.
# Each run's timings land in results/<workspace>-<agents>.json. Re-running skips finished runs.
#   bash run-matrix.sh            # everything
#   SIZES=12 bash run-matrix.sh   # one size
set -uo pipefail
REPO=edbzn/nx-atomization-vs-sharding
OUT=$(dirname "$0")/../../results/agents/results
mkdir -p "$OUT"

for size in ${SIZES:-12 50 100}; do
  for setup in baseline sharded atomized; do
    for agents in ${AGENTS:-3 5 8}; do
      ws=$setup-$size
      file=$OUT/$ws-$agents.json
      [ -s "$file" ] && { echo "skip $ws on $agents agents (done)"; continue; }
      echo "== $ws on $agents agents ($(date +%H:%M))"
      since=$(date -u +%Y-%m-%dT%H:%M:%SZ)
      gh workflow run agents.yml -R "$REPO" --ref "agents/$ws" -f agents="$agents" || { echo "dispatch failed"; continue; }
      id=""
      for _ in $(seq 1 30); do
        sleep 5
        id=$(gh run list -R "$REPO" -w agents.yml -b "agents/$ws" -L 5 --json databaseId,createdAt \
          --jq "[.[] | select(.createdAt >= \"$since\")][0].databaseId // empty")
        [ -n "$id" ] && break
      done
      [ -z "$id" ] && { echo "run not found"; continue; }
      gh run watch "$id" -R "$REPO" --interval 30 > /dev/null 2>&1
      conclusion=$(gh run view "$id" -R "$REPO" --json conclusion --jq .conclusion)
      tmp=$(mktemp -d)
      gh run download "$id" -R "$REPO" -D "$tmp" > /dev/null 2>&1
      if [ -f "$tmp"/*/result.json ]; then
        jq --arg id "$id" --arg c "$conclusion" '. + {githubRunId: $id, conclusion: $c}' "$tmp"/*/result.json > "$file"
        jq -c . "$file"
      else
        echo "no result for run $id ($conclusion)"
      fi
      rm -rf "$tmp"
    done
  done
done
