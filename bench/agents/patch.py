"""Connects a generated workspace to Nx Cloud and makes every run a cache miss.
Usage: patch.py <workspace dir> <targets> <nxCloudId or "">"""
import json
import sys

ws, targets, cloud_id = sys.argv[1], sys.argv[2], sys.argv[3]

p = f"{ws}/nx.json"
nx = json.load(open(p))
nx.pop("neverConnectToCloud", None)
if cloud_id:
    nx["nxCloudId"] = cloud_id
# A per-run id in every task's inputs: no run can reuse another run's cached results, local or
# remote. NX_-prefixed variables are forwarded to Nx Agents automatically.
shared = nx["namedInputs"]["sharedGlobals"]
if {"env": "NX_BENCH_RUN_ID"} not in shared:
    shared.append({"env": "NX_BENCH_RUN_ID"})
json.dump(nx, open(p, "w"), indent=2)
open(p, "a").write("\n")

# A no-op task the workflow runs first: it finishes once agents are up, so the measured
# test run doesn't include agent boot.
p = f"{ws}/libs/shared-ui/project.json"
project = json.load(open(p))
project.setdefault("targets", {})["agents-ready"] = {"command": "echo agent ready", "cache": False}
json.dump(project, open(p, "w"), indent=2)
open(p, "a").write("\n")
