# bench/: measurement tooling

These scripts measure `nx affected` runs locally for the three workspaces (`baseline`,
`atomized`, `sharded`), aggregate the results into tables and chart data, and replay the
measured task durations through a model of distributed execution (DTE). They are plain Node
ESM with no dependencies. They need Node ≥ 22 and Linux, because they read `/proc`.

```
bench/
  run.mjs          one measured run (x reps)
  matrix.mjs       a list of configurations, interleaved, resumable
  aggregate.mjs    results/raw/**/summary.json -> results/aggregate.{json,md} + results/charts/*.json
  simulate.mjs     DTE simulator (agents x slots), plus --validate
  matrices/        pilot.json, smoke.json
  lib/
    nx-hook.cjs    launcher for the workspace's own nx that captures the performance report structurally
    sampler.mjs    /proc process-tree sampler (runs as its own process)
    summary.mjs    artifacts -> summary.json
    sim.mjs        the simulator model (pure)
    proc.mjs config.mjs stats.mjs results.mjs perf-report.mjs
  test/            node:test suites + fake nx (test/fake/)
```

## Quick start

```sh
# one configuration, 3 reps
node bench/run.mjs --workspace atomized --scenario full --runner ct --parallel 8 --reps 3

# a whole matrix (resumable: re-run the same command after an interruption)
node bench/matrix.mjs bench/matrices/pilot.json --dry-run
node bench/matrix.mjs bench/matrices/pilot.json

node bench/aggregate.mjs
node bench/simulate.mjs --validate
node bench/simulate.mjs --from atomized/full/ct/p8 --agents 1,2,4,8,16 --slots 3 --policy batch,greedy --mem-cap 32
```

## run.mjs

```
node bench/run.mjs --workspace <baseline|atomized|sharded|path> --scenario <full|partial|tag>
     --runner <ct|e2e|unit|all> --parallel N [--reps R] [--rep-start 1] [--out results/raw] [--label x]
     [--interval 250] [--pss-budget 0.15] [--launcher hook|pnpm] [--task-history cold|keep]
     [--timeout-min 90] [--targets a,b] [--kind baseline] [--no-clean] [--keep-full-graph] [--verbose] [--dry-run]
```

The runner picks the target names: baseline uses `component-test`, `e2e` and `test`; atomized
and sharded use `component-test-ci`, `e2e-ci` and `test-ci`. `all` selects all three.
`--targets` overrides this, and `--kind` sets which mapping a workspace at an arbitrary path uses.

Each rep does the following:

1. **Preflight.** Kill any process still carrying a `BENCH_RUN_ID` env var, left over from a
   crashed run. Do not run two benchmarks at the same time.
2. **Checkout.** `git checkout --detach <scenario-tag>`. Uncommitted tracked changes are
   recorded as `flags.gitDirty`.
3. **Clean.** Remove everything that would make reps unequal:
   - Nx data: `.nx/workspace-data/*` (project graph and file-map caches, and the workspace DB that holds task
     history) and `.nx/cache`. Graph computation is therefore cold and is part of the
     measurement (`timing.preTaskMs`).
   - `node_modules/.vite*` one level inside every `node_modules` directory in the workspace.
     Cypress CT uses per-process vite cacheDirs at `node_modules/.vite/ct-*`, and Vitest uses `.vitest`.
   - Output directories anywhere outside `node_modules`/`.git`: `dist`, `out-tsc`, `coverage`,
     `test-output`, `test-results`, `playwright-report`, `blob-report`, and
     `cypress/{screenshots,videos,downloads}`.
   - Nothing else. The OS page cache stays warm: every rep after the first reads sources and
     `node_modules` from RAM. Browser binaries under `~/.cache` are untouched.
4. **Task graph.** Run `nx affected -t <targets> --base=base --head=HEAD --graph=<dir>/task-graph.raw.json`.
   In Nx 23.3 `--graph=<file>.json` takes the same task-level `affected` selection as the
   real run (`computeAffectedTasks`), writes `{graph, tasks, taskPlans}` and exits without
   running any task (`command-line/graph/graph.js`, `generateGraph` then `process.exit(0)`).
   This step is timed as `graphExportMs` and is not part of the measured run. The raw file is
   reduced to `task-graph.json`, which holds `{tasks: <TaskGraph>, executors: {taskId: executor}}`.
   `--keep-full-graph` keeps the raw file. Afterwards the Nx data is cleaned again, so the
   measured run still starts cold.
5. **Idle baseline.** Read machine-wide CPU busy over 1 s and record it as
   `resources.idleSysCoresBefore`. If it is high, something else was running on the machine.
6. **The measured run.** The sampler is started first, then:
   `node bench/lib/nx-hook.cjs affected -t <targets> --base=base --head=HEAD --parallel=N --skip-nx-cache --outputStyle=static`
   runs with `CI=true NX_TUI=false NX_DAEMON=false NX_NO_CLOUD=true FORCE_COLOR=0`, plus:
   - `NX_PROFILE=<dir>/profile.json`, passed relative to the workspace because Nx does
     `join(cwd, NX_PROFILE)`;
   - `BENCH_RUN_ID=<uuid>`, the marker every descendant inherits;
   - `NX_WORKSPACE_DATA_DIRECTORY` and `NX_CACHE_DIRECTORY` pinned to `<ws>/.nx/...` (see the
     caveats). Any `NX_*` variables inherited from your shell are stripped.

   stdout and stderr are teed to `nx.log`.
7. **After exit.** Stop the sampler (it takes one final tick), then SIGTERM and later SIGKILL
   every process whose `/proc/<pid>/environ` holds this run's marker. Those processes are
   listed in `leftovers`. New browser or runner processes without the marker that are
   parented by init or `systemd --user` are reported as `suspectOrphans`. They are not
   killed, because we can't prove they belong to the run.
8. **Summary.** Write `summary.json` and print one line per rep, for example:
   `OK  atomized full ct p8 r1 | wall 3m12s (pre 4.1s, tasks 3m05s) | tasks 245 | util 87% | PSS 18.2GB | CPU 21.3c | sampler 9.1%core`

The exit code is 0 when every rep was clean, 1 when at least one rep was flagged (failed
tasks, non-zero exit, timeout, missing profile, or tasks that never ran), and 2 on a crash.

### Output: `<out>/<UTCstamp>_<workspace>_<scenario>_<runner>_p<N>_r<i>[_<label>]/`

| file | content |
|---|---|
| `summary.json` | everything below, plus `taskList` |
| `profile.json` | Nx's own `NX_PROFILE` Chrome trace (open in `chrome://tracing` or Perfetto) |
| `task-graph.json` | `{source, targets, tasks: TaskGraph, executors}` |
| `nx-perf.json` | the hook's dump: Nx performance summary, PerformanceLifeCycle timings and statuses, critical path, timestamps |
| `samples.json.gz` | sampler time series, per-task series, per-process records, sampler overhead |
| `nx.log` | full Nx output (static style) |

## Nx 23.3.0 internals this relies on

These were verified in `nx/dist` 23.3.0 and against a real Nx 23.3.0 run (`test/real-nx.test.mjs`).

- **`NX_PROFILE`** (`tasks-runner/life-cycles/task-profiling-life-cycle.js`). The file is a
  JSON array in Chrome trace format, written at `endCommand`:
  - one metadata event per slot, when that slot is first used:
    `{name:'thread_name', ph:'M', pid, tid:<groupId>, ts:0, args:{name:'Group #<groupId+1>'}}`;
  - one complete event per finished task:
    `{name:<taskId>, cat:'project,target,configuration', ph:'X', ts:<start µs epoch>, dur:<µs>, pid:<nx pid>, tid:<groupId>, args:{target:{project,target,configuration?}, status}}`.

  `groupId` is the slot: `TaskOrchestrator.closeGroup()` hands out the lowest free index in
  `0..parallel-1`. Start and end are `task.startTime`/`endTime`. `startTime` is set in
  `preRunSteps`, just before the task is spawned. `status` is one of `success`, `failure`,
  `local-cache`, `local-cache-kept-existing` or `remote-cache`. Skipped tasks (a dependency
  failed) never reach `endTasks`, so they are missing from the profile. The summary lists
  them under `tasks.notRun`.
- **Task graph JSON** (`graph.js` `createJsonOutput`) has the shape
  `{graph: ProjectGraph, tasks: {roots, tasks: {id: Task}, dependencies: {id: [ids]}, continuousDependencies}, taskPlans}`.
  A `Task` is `{id, target:{project,target,configuration?}, projectRoot, overrides, outputs, cache, parallelism, continuous}`.
  The executor is not on the task, so it is read from `graph.nodes[project].data.targets[target].executor`.
  Atomizer and shard parent targets are `nx:noop`, and the summary uses that to flag them as `isNoop`.
- **Task env** (`tasks-runner/task-env.js`). Every task process gets `NX_TASK_TARGET_PROJECT`,
  `NX_TASK_TARGET_TARGET`, `NX_TASK_TARGET_CONFIGURATION` and `NX_TASK_HASH`, and children
  inherit them. Task id = `project:target[:configuration]`.
- **Performance report** (`performance-life-cycle.js`, `performance-analysis.js`,
  `performance-report.js`). A `PerformanceLifeCycle` is added on every run (`run-command.js`
  `constructLifeCycles`). In non-TUI runs `flushPerformanceReport()` prints
  `formatReport(summary)` in the `finally` of `runTasksForCommand`, on success and on
  failure. No env flag is needed. The printed text only shows *Run duration*, *Cache*,
  *Critical path* (duration and task count) and *Recoverable time*, plus recommendations.
  The structured summary has more:
  `{runDuration, criticalPathDuration, criticalPathTaskCount, criticalPathTop[], failedTasks[], overhead, recoverableByParallel, recoverableByMachines, coordinatorOverhead, parallel, cores, cacheHits, cacheableCount, ...}`.
  Here `overhead = runDuration − criticalPath`, and it is split into slot-queued time
  (recoverable by a higher `--parallel` or by more machines) and coordinator time (hashing,
  scheduling). `runDuration` is the task window plus pre-dispatch hashing.

  **How we capture it.** `lib/nx-hook.cjs` resolves the workspace's own `nx/bin/nx.js`. Nx's
  "local install" check passes because it is the same file. Before requiring that bin, the
  hook wraps `PerformanceLifeCycle.prototype.getSummary`, which the flush calls exactly once,
  and dumps the result to `nx-perf.json`. The dump also includes the lifecycle's per-task
  timings and statuses and the full critical-path task list, computed with Nx's own
  `PerformanceAnalysis.criticalPath`. The hook also swaps the exported class for a subclass
  that timestamps its construction. That moment is right after the project and task graphs
  are built and right before the orchestrator starts, which gives `timing.graphMs`.

  A launcher is used instead of `NODE_OPTIONS=--require` because `NODE_OPTIONS` would leak
  into every Cypress, Playwright and Vitest process. With `--launcher pnpm` (plain
  `pnpm exec nx`), or when the hook fails, the printed report is parsed from `nx.log` instead
  (`lib/perf-report.mjs`, `nxPerformance.source: 'log'`). That route has no parallel /
  machines / coordinator split.
- **Data location and task history** (`utils/cache-directory.js`, `utils/db-connection.js`,
  `tasks-runner/tasks-schedule.js`). See the caveats below.

## Metrics (summary.json)

All times are in ms. Task `start` and `end` are relative to the spawn of the nx process.

| field | definition |
|---|---|
| `timing.wallMs` | spawn of the nx process to its exit |
| `timing.preTaskMs` | spawn to the first task start: node boot, nx load, project graph, affected, task graph, first hashes |
| `timing.nxBootMs`, `graphMs`, `dispatchMs` | hook launcher only: spawn → hook start; hook start → PerformanceLifeCycle created (nx module load + graphs); that moment → first task start |
| `timing.taskPhaseMs` | first task start → last task end |
| `timing.postTaskMs` | last task end → exit |
| `tasks.count` / `realCount` / `noopCount` / `atomCount` | tasks in the profile, those that are not `nx:noop`, the noop parents, and real tasks whose target is `<ci>--<x>` |
| `tasks.sumDurationMs` | Σ task durations (`sumRealDurationMs` excludes noops) |
| `tasks.meanMs` / `medianMs` / `p95Ms` | over real tasks |
| `slotUtilisation` | Σ durations / (taskPhaseMs × N) |
| `taskList[]` | `{id, project, target, kind (ct/e2e/unit/build/other), isAtom, isNoop, executor, start, end, duration, slot, status, cacheStatus (hit/miss), peakPssMb, peakRssMb, cpuSeconds, procs}` |
| `resources.peakPssMb` / `peakRssMb` | peak, over sampler ticks, of the summed PSS or RSS of the whole Nx process tree |
| `resources.avgCores` / `peakCores` / `avgCoresTaskPhase` | CPU cores busy, attributed to the tree, from per-process utime+stime deltas |
| `resources.cpuSecondsAttributed` | Σ over the tree's processes of last-seen utime+stime |
| `resources.avgSysCores` / `cpuSecondsSystem` | machine-wide, from `/proc/stat`. Exact, but includes background load |
| `resources.minMemAvailableMb`, `maxLoad1`, `idleSysCoresBefore` | system health during the run |
| `resources.nxCoordinator` | processes without task env: the nx process, plugin workers, pnpm |
| `nxPerformance` | Nx's structured performance summary (see above) plus `criticalPath[]` |
| `sampler` | `cores` = the sampler's own CPU (user+sys) / elapsed; tick duration mean/p95/max; PSS reads; fraction of PSS values that were estimated |
| `flags` / `ok` | `ok` = no failed task, exit 0, not timed out, profile present, nothing missing from the run. Leftovers, suspect orphans and git-dirty are flagged but don't make a run not-ok |

### The sampler (`lib/sampler.mjs`)

The sampler is a separate process, so its CPU is measured cleanly and its synchronous
`/proc` reads never block log piping. Every `--interval` ms (default 250) it does the following:

- Lists `/proc` and reads `/proc/<pid>/stat` of every process that is ours or new. A process
  already known to be foreign is skipped, and its starttime is re-checked every 10 s.
- Treats a new pid as ours if its ppid is ours. A process reparented to init or a subreaper
  (double fork) is caught through `BENCH_RUN_ID=<uuid>` in `/proc/<pid>/environ`. `environ`
  is read once per new process.
- Attributes each process from its own `NX_TASK_TARGET_*` env, else from its parent's
  attribution, else to `(nx)`.
- Reads PSS from `/proc/<pid>/smaps_rollup`. RSS double-counts shared Chromium/Electron
  memory, so both PSS and RSS are kept. `smaps_rollup` is expensive for Chromium-family
  processes: 5–7 ms each on this machine, because the kernel walks their huge VMAs. So PSS is
  refreshed round-robin under a per-tick time budget (`--pss-budget`, default 15 % of the
  interval), with new processes first. Between refreshes a process's PSS is estimated as
  `RSS × (its last PSS/RSS)`. `pssEstimatedFraction` reports how often that happened.
- Records the system-wide numbers: `/proc/stat`, `MemAvailable` and `loadavg`.

Measured overhead:

| scenario | sampler CPU | other numbers |
|---|---|---|
| Fake run, 32 parallel tasks, 160 processes, 32 cores saturated | 0.083 cores (8 % of one core, 0.26 % of the machine) | 81 % of PSS values estimated; `/proc/stat` total within 10 % of attributed CPU |
| Observing a live 50-process Chrome tree (6.3 GB PSS), budget 0.15 | 0.18 cores | PSS total within 1 % of exact |
| Same Chrome tree, exact PSS every tick (budget 1) | 0.55 cores | baseline for comparison |

Every summary reports its own overhead.

## matrix.mjs

```
node bench/matrix.mjs bench/matrices/pilot.json [--dry-run] [--retry-flagged]
```

The matrix file (all keys optional except configs):

```json
{ "reps": 3, "workspaces": ["baseline","atomized","sharded"],
  "configs": [{"scenario":"full","runner":"ct","parallel":8}],
  "scenarios": ["partial","full"], "runners": ["ct","e2e","unit"], "parallel": [8],
  "rotate": true, "cooldownSec": 20, "minMemAvailableGb": 18, "memWaitTimeoutMin": 20,
  "label": null, "out": "results/raw", "runArgs": {"interval": 250, "timeout-min": 90} }
```

- `configs` lists configurations explicitly; `scenarios × runners × parallel` adds their
  cartesian product.
- Ordering is: for each rep, for each config, all workspaces. With `rotate`, the workspace
  order rotates each rep (rep 1 b,a,s; rep 2 a,s,b; ...), so drift and thermal state are
  spread over the variants.
- There is a `cooldownSec` pause between runs. Before each run the matrix waits for
  `MemAvailable ≥ minMemAvailableGb`, up to `memWaitTimeoutMin`, then runs anyway with a warning.
- Each run is a separate `run.mjs` process.
- Resuming: a rep whose `summary.json` exists (same workspace/scenario/runner/P/label/rep) is
  skipped. `--retry-flagged` re-runs flagged reps and moves the old directory to
  `<out>/_superseded/`. Directories starting with `_` are ignored by aggregate and simulate.

## aggregate.mjs

```
node bench/aggregate.mjs [--raw results/raw] [--out results] [--include-flagged] [--timeline-points 600]
```

Runs are grouped by `workspace/scenario/runner/pN[/label]`. Statistics use the group's `ok`
reps. Flagged reps are used only if a group has no clean rep, or with `--include-flagged`,
and are always counted in `failures`.

- Per group: wall median/min/max, pre-task, task phase, critical path, task count, Σ task
  time, task mean/median/p95 (pooled over reps), slot utilisation, peak PSS/RSS, average
  CPU, Nx overhead split, sampler overhead and startup tax.
- **Startup tax**, per runner kind and project: (Σ unit durations in the variant − the
  baseline's whole-project task duration) / (units − 1). Durations are medians over reps.
  A unit is a non-noop task of that runner kind for the project: an atom, a shard, or the
  whole-project target an unsharded project delegates to. Tax is computed only for projects
  with ≥ 2 units. The group reports the median and IQR across projects, and the per-project
  rows are in `aggregate.json`.
- `results/aggregate.md` is the markdown table, and `results/aggregate.json` has everything.
- `results/charts/*.json` is chart-ready. Each entry carries `key, workspace, scenario, runner, parallel, label`:

| file | content |
|---|---|
| `wall-time.json` | median/min/max/all reps, pre-task, task phase, critical path |
| `task-durations.json` | pooled real-task durations, overall and `byKind`, for histograms and box plots |
| `memory.json` | peak PSS/RSS, plus the distribution of per-task peak PSS |
| `timelines.json` | representative run (closest to the median wall time): `[tS, pssGb, rssGb, cores, procs, sysCores]`, downsampled by bucket max so peaks survive, plus first and last task markers |
| `gantt.json` | representative run: `{slots, tasks:[{id, project, kind, isAtom, isNoop, slot, start, end, status, peakPssMb}]}` |
| `startup-tax.json` | per variant/kind, with per-project rows |

## simulate.mjs: DTE simulator

We can't run real Nx Cloud DTE, so measured task durations and peak PSS are replayed through
a model of K agents × P slots each.

```
node bench/simulate.mjs --from <summary.json | run dir | workspace/scenario/runner/pN[/label]>
     [--agents 1,2,4,8,16] [--slots 3] [--policy batch,greedy] [--order longest-first,critical-path,graph-order]
     [--mem-cap 32 (GB/agent, 0 = none)] [--bootstrap 60 (s)] [--penalty 3 (s)] [--noop instant|slot]
     [--raw results/raw] [--out results/sim] [--no-gantt]
node bench/simulate.mjs --validate
```

`--from` with an aggregate key uses, per task id, the median duration and median peak PSS
over that configuration's clean reps. Dependencies come from `task-graph.json`.

The model:

- Agents boot for B seconds and start pulling work at t = B.
- A task is ready when all its dependencies have finished.
- A task with a dependency that ran on another agent pays the penalty once: the
  remote-cache restore of that dependency's outputs.
- A per-agent memory cap holds a task back until the running tasks' peak PSS plus its own
  fits. Other ready tasks may backfill while it waits. A task that is bigger than the cap on
  its own runs alone on an empty agent, with a warning.
- Noop parents complete instantly when their dependencies are done (`--noop slot` makes them
  take a slot instead).
- Policies:
  - `greedy`: a free slot pulls the next ready task, and the least-loaded agent gets it.
  - `batch`: an idle agent pulls up to P ready tasks and pulls again only once the whole
    batch has finished, like an agent that pulls work in batches.
- Orderings: `longest-first` (historical duration), `critical-path` (longest remaining path
  including the task), `graph-order` (stable topological order), and `observed` (start time
  in the measured run, used for validation).
- Outputs: makespan including bootstrap, slot utilisation, per-agent busy % and peak memory,
  cross-agent penalties paid, agent-minutes = K × makespan (the cost proxy),
  agent-minutes if idle agents were released at their last task, and a Gantt per agent
  (`{agent, slot, id, start, end, penalty}`). Results are printed as a table and written to
  `results/sim/<key>.json`.

`--validate` replays every raw run with K = 1, P = its `--parallel`, greedy, B = 0, no
penalty, and noops in slots. It compares the makespan with the run's measured
`taskPhaseMs`, for the `observed`, `graph-order` and `longest-first` orderings, and writes
`results/sim/validate.json`. With `observed` ordering the error measures how much wall time
is *not* in task durations: coordinator gaps between one task ending and the next starting
(hashing, scheduling). It is about 0.05–0.1 % on the fake runs. The `graph-order` and
`longest-first` errors show how much local ordering alone would change the makespan.

## Caveats

- **Durations include contention.** A task's duration was measured at that run's
  `--parallel` on this machine: CPU, memory bandwidth and disk shared with N−1 other tasks.
  Simulate from runs whose parallel ≈ P. The simulator warns when they differ a lot. A
  32-thread desktop running 3 slots per agent is not a cloud agent either.
- **Nx data location.** Nx 23.3 keeps the cache and the workspace DB in a per-user shared
  directory, `~/.nx/<sha(repo identity)>/{cache,databases}`, whenever it can create it. The
  repo identity is the git remote or the first-commit SHA. The per-rep cleanup would miss
  that directory. `run.mjs` therefore sets `NX_WORKSPACE_DATA_DIRECTORY` and
  `NX_CACHE_DIRECTORY` to the workspace's `.nx/...`, which turns sharing off (any of these
  env vars ⇒ `share: 'none'`).
- **Task history changes local scheduling.** `TasksSchedule.sortScheduledTasks` orders
  equally ranked tasks longest-first using durations from the workspace DB, and runs tasks
  without history first. `--task-history cold` (the default) deletes the DB every rep. No
  history matches a fresh CI agent without Nx Cloud, and the ordering becomes effectively
  graph order. `--task-history keep` keeps the `*.db` files (graph caches are still removed).
  With `keep`, rep 1 differs from later reps, so do a warm-up rep if you use it.
- **Page cache stays warm** between reps. Only the first rep after a reboot reads from disk.
- **Per-task CPU is a slight undercount.** A process's CPU after its last sample is lost: up
  to one interval of CPU per process lifetime. Processes that live shorter than an interval
  are missed. Their time is not recovered from the parent's `cutime`, which would
  double-count. This matters most for many short tasks, i.e. it under-states atomized CPU.
  `cpuSecondsSystem` (exact, machine-wide) bounds the error: it was within 10 % on a
  saturated fake run, including ~0.5 cores of background load.
- **PSS between refreshes is estimated** from RSS × that process's last PSS/RSS ratio. Peaks
  that rise and fall between two PSS refreshes of the same process are smoothed. RSS is
  sampled exactly every tick.
- **The `(nx)` bucket** holds every process of the tree without task env: the nx
  coordinator, plugin workers (graph phase), and the hook or pnpm launcher.
- **`suspectOrphans` is a heuristic**: browser- or runner-named processes that appeared
  during the run, have no marker, and are parented by init or `systemd --user`.
- **One benchmark at a time.** The preflight kills stray `BENCH_RUN_ID` processes. For the
  same reason the tests must run with `--test-concurrency=1`.
- **The machine must be quiet.** Check `resources.idleSysCoresBefore`, `avgSysCores` vs
  `avgCores`, and `minMemAvailableMb`.

## Tests

```sh
node --test --test-concurrency=1 'bench/test/*.test.mjs'
# + real Nx integration (no browsers; tasks are `node -e`):
BENCH_TEST_NX_PKG=/path/to/node_modules/nx node --test --test-concurrency=1 'bench/test/*.test.mjs'
```

- `sim.test.mjs`: hand-computed scheduling cases (LPT, batch vs greedy, dependencies,
  critical-path ordering, bootstrap, cross-agent penalty, memory cap and oversized tasks,
  noop parents, observed-order replay).
- `sampler.test.mjs`: deterministic tree walk, env attribution including configuration,
  marker detection for non-descendants, foreign processes ignored.
- `run.test.mjs` (set `BENCH_TEST_KEEP=1` to keep its temp dirs): end-to-end on fake workspaces driven by `test/fake/fake-nx.mjs`. The fake
  Nx writes Nx's real profile and graph formats, spawns `sh -c node ...` tasks that allocate
  memory, burn CPU, spawn children and double-fork an orphan, and prints the report in
  `formatReport` layout. The test checks cleanup, summary contents, slots, per-task PSS and
  CPU attribution, orphan kill, failure flagging, the matrix plan and resume, aggregate
  (including startup tax and charts), `simulate --validate` (|error| < 3 %) and a simulate sweep.
- `real-nx.test.mjs`: the hook launcher, `affected --graph`, `NX_PROFILE`, noop detection and
  attribution against a real Nx install.

`BENCH_NX_CMD="node bench/test/fake/fake-nx.mjs"` replaces the nx launcher; relative paths
are resolved from the caller's cwd. `BENCH_WORKSPACES_DIR` replaces `<repo>/workspaces`.

## Scaling experiment

Question: does Nx's native atomization (one task per spec file) add Nx-side overhead that grows
with workspace size, independent of test runtime? Candidates: graph creation (the atomizer
enumerates specs and creates one target per spec), per-task hashing (each atom hashes the
project's inputs plus `^production` of its whole dependency closure), and per-task scheduling.
The real monorepo behind this question has 1,328 projects, 4,440 targets and ~28k files.

```
generator/scale.mjs            Vitest-only workspaces with N libs (workspaces/scale/<variant>-<N>/)
generator/scale/templates.mjs  their file templates
generator/scale/pnpm-lock.yaml the one lockfile every size and variant installs from
bench/scale.mjs                the harness (phases below), resumable
bench/scale-report.mjs         results/scale/raw/** -> results/scale/report.{md,json}
```

### Quick start

```sh
node generator/scale.mjs --plan                       # totals for 20,100,500,1500; writes nothing
node bench/scale.mjs --dry-run                        # plan + estimated duration (uses any results so far)
node bench/scale.mjs                                  # sizes 20,100,500,1500; generates missing workspaces
node bench/scale-report.mjs                           # results/scale/report.md + report.json

# one size / subset; re-running the same command resumes
node bench/scale.mjs --sizes 500 --variants baseline,atomized --phases hash,run
```

`results/scale-validation-n20/` holds the N=20 validation run: all phases and variants, on
2 pinned, niced CPUs while another benchmark was running. Its run-phase numbers are
oversubscribed. `node bench/scale.mjs --dry-run --out results/scale-validation-n20`
extrapolates the sweep duration from it. The real sweep writes to `results/scale/`, which
starts empty.

`bench/scale.mjs` options: `--sizes 20,100,500,1500`, `--variants baseline,atomized,sharded`,
`--phases graph-cold,taskgraph,hash,run`, `--reps 2` (graph-cold, taskgraph, hash),
`--run-reps 1`, `--parallel 16`, `--out results/scale`, `--ws-dir workspaces/scale`,
`--timeout-min 120`, `--interval 200` (process-tree poll, ms), `--cooldown 2` (s between
commands), `--retry-failed`, `--est-cores N` (cores the estimate assumes, default
min(parallel, cpus)), `--dry-run`.

The harness sets no CPU affinity or priority. Wrap it if needed, e.g.
`nice -n 19 taskset -c 30,31 node bench/scale.mjs ...` (affinity is inherited by Nx and Vitest).
Don't run it next to another benchmark you care about.

### Generated workspaces

`node generator/scale.mjs --projects N [--variant baseline|atomized|sharded|all] [--out workspaces/scale] [--force] [--no-install] [--shard-spec-seconds 5]`

- N libs `libs/l<layer>/<noun>-<i>` (project name `l<layer>-<noun>-<i>`) with `project.json`,
  `tsconfig.json`, `vitest.config.ts` and `src/{index,lib/core,lib/<module>}.ts`: pure
  integer-mixing functions. Specs `src/lib/<module>.<topic>.spec.tsx` run in the **node**
  environment. They are plain TS; the `.tsx` suffix is there because the shard plugin's Vitest
  runner only collects `*.spec.tsx`.
- Specs per project are long-tailed and stratified: exactly 60% of projects have 2-5 specs,
  30% have 6-15 and 10% have 20-40 (mean ≈ 8.2). Each spec folds an integer for 3·10⁶ to
  1.2·10⁸ rounds (log-normal, median 2·10⁷, ~1.1 ns per round), so a spec takes 5-130 ms. It
  checks range, label format and a short reference fold whose value the generator computed.
- Dependencies form a layered DAG with 10 layers (lib i is in layer ⌊10·i/N⌋). Each lib above
  layer 0 imports 1-3 libs from lower layers (60% from the layer directly below) through TS
  path aliases in `tsconfig.base.json` (`@scale/<name>` → `src/index.ts`,
  `@scale/<name>/core` → `src/lib/core.ts`). Nx infers project dependencies from these real
  imports. Modules import a dependency's `/core` entry, so Vitest loads only the direct
  dependencies' `core.ts` at runtime. Nx still hashes the full transitive `^production`
  closure.
- Vitest config: `environment: 'node'`, and in CI `maxWorkers: 1`, `fileParallelism: false`
  and `cache: false`, the same fairness rule as the main workspaces. A regex `resolve.alias`
  mirrors the path aliases.
- `nx.json`: `neverConnectToCloud`, a `production` named input (excludes specs,
  `vitest.config.ts` and `tsconfig.json`), `targetDefaults.test.cache: true`. Plugins:
  - baseline: `@nx/vitest` (`testTargetName: test`, `testMode: run`);
  - atomized: the same plus `ciTargetName: "test-ci"`;
  - sharded: the baseline plugin plus `./tools/shard-plugin/src/vitest.ts`
    `{ciTargetName: "test-ci", delegateTarget: "test", secondsPerKb}`.

  Source trees are byte-identical across variants for a given N.
- **`secondsPerKb` deviation.** Our specs run in milliseconds. With the plugin's default
  (0.095 s/KB, calibrated on the React specs) no project would reach the 90 s shard target,
  and `sharded` would just be `baseline` plus one noop parent per project. The generator
  therefore passes `secondsPerKb` = 5 s per spec ÷ the mean spec size (4.262 s/KB, fixed for
  every N, derived at N=1500). The 20-40-spec projects then get 2-3 shards, like the Cypress
  CT projects in the main benchmark. `--shard-spec-seconds 0` uses the plugin default.
- Install: no libs are pnpm workspace packages, so the root `package.json` is the only
  importer and one lockfile serves every size. It was resolved once from
  `generator/pnpm-lock.yaml`, so transitive versions match the main workspaces. Optional peers
  kept from that lock, such as jsdom, are installed but never loaded. Every workspace then runs
  `pnpm install --frozen-lockfile --prefer-offline` from the store, with hardlinks, in about
  0.2 s. After install the generator checks that nx, @nx/vitest, @nx/js, vitest, vite and
  typescript resolve under the workspace's own `node_modules`, and runs `pnpm exec nx --version`.
  The result is `Local: v23.3.0`, `Global: Not found`, so nothing leaks from
  a `node_modules` in a parent directory (e.g. `$HOME/node_modules`).
- Each workspace gets `git init` and one commit. `generator/scale.mjs` writes
  `<out>/plan-<N>.json` with the expected totals. An existing workspace is skipped unless
  `--force` is passed.

Totals (`--plan`; shards from the plugin's own `planShards`):

| N | specs | files | baseline targets / tasks | atomized targets / tasks | sharded targets / tasks |
|---|---|---|---|---|---|
| 20 | 154 | 315 | 20 / 20 | 194 / 174 | 44 / 42 |
| 100 | 812 | 1,597 | 100 / 100 | 1,012 / 912 | 222 / 212 |
| 500 | 4,158 | 8,090 | 500 / 500 | 5,158 / 4,658 | 1,110 / 1,060 |
| 1500 | 12,359 | 24,089 | 1,500 / 1,500 | 15,359 / 13,859 | 3,333 / 3,183 |

Tasks are what `run-many -t test` (baseline) or `-t test-ci` (atomized, sharded) runs.
Atomized runs every atom plus one noop `test-ci` parent per project. Sharded runs the shards,
the delegated `test` of each unsharded project, and the noop parents.

### Phases

Within a size, variants are interleaved, and their order rotates every rep. Every command runs
as `/usr/bin/time -f '%e %M %U %S' node <nx> ...` with `nxEnv()`. While it runs, the harness
polls the process tree through `/proc/<pid>/task/*/children`. Direct children of nx whose
cmdline runs `plugin-worker` are counted as plugin workers, together with their own children
(esbuild, for example). Everything else is counted as task processes. Results go to
`results/scale/raw/n<N>/<variant>/<phase>-r<i>.json`.

| phase | clean first | command | what it measures |
|---|---|---|---|
| `stats` (once, untimed) | workspace-data | `nx graph --file=…` | projects, targets, atom and shard targets, project deps (checked against the plan) |
| `graph-cold` | `.nx/workspace-data` | `nx show projects --json` with `NX_PERF_LOGGING=true` | boot + plugin workers + cold project graph; Nx's step timings parsed into `nxPerf` |
| `taskgraph` | `.nx/workspace-data` | `nx run-many -t <t> --graph=<f>.json` | the brief's task-graph export: no task runs (checked), task count from the file. **Caveat below.** |
| `hash` | `.nx` | `nx run-many -t <t> --parallel=P --skip-nx-cache` through a `node -e` launcher that exits when Nx constructs its `PerformanceLifeCycle` | boot + project graph + task graph + upfront hashing of every task, on the real run path. Nx's perf_hooks measures (`createProjectGraphAsync`, `build-project-configs`, `createDependencies`, `hashMultipleTasks`) are read from the in-process timeline |
| `run` | `.nx`, `node_modules/.vite*` | `nx run-many -t <t> --parallel=P --skip-nx-cache --outputStyle=static` through `lib/nx-hook.cjs`, with `NX_PROFILE` | one uncached execution: wall, tasks, Σ task durations, pre-task, per-slot gaps, Nx's structured performance summary |

The `run` phase checks that no task failed, that there were no cache hits, and that the
profile's task count matches the `taskgraph` count. Any violation is an error. The profile and
the log are kept gzipped.

Metrics per result: `wallMs` (spawn to exit), plus `time.{wallS, maxRssMb, cpuS}` from
`/usr/bin/time`. `%M` is the largest RSS of any single process the run reaped, not the nx
process. `mem.nxPeakRssMb` is the coordinator's own peak RSS (VmHWM).
`mem.workersPeakRssMbSum/Max` covers plugin workers and their children.
`mem.coordTreePeakRssMb` is the peak of nx plus workers sampled together, and
`mem.treePeakRssMb` includes the task processes. The run phase adds `tasks.*`:

- `preTaskMs`: spawn to the first task start.
- `hook.graphReadyMs`: graphs and upfront hashes done.
- `taskPhaseMs` and `postTaskMs`.
- `sumDurMs`.
- `idealMakespanMs` = Σdur / P.
- `overheadMs` = wall − Σdur / P. This includes boot, graph, hashing and scheduling, plus the
  tail when there are fewer ready tasks than slots.
- `gapMedianMs` / `gapMeanMs`: idle time between consecutive tasks on one slot. The median is
  Nx's per-task scheduling and spawn latency. The mean also includes waits for dependencies,
  such as a noop parent waiting for its last atom.
- `hook.coordinatorOverhead` and the other fields of Nx's own summary.

`scale-report.mjs` reports medians over the ok reps (`--include-failed` adds failed ones):

- the workspace shape per size × variant;
- per phase: wall by size × variant;
- the ratios atomized/baseline and sharded/baseline;
- **A−B per extra target or task**: the marginal Nx cost of one more atom at that size;
- Nx step timings, nx and worker peak RSS, and the run metrics;
- the growth in ms of wall per added project between consecutive sizes.

### Nx 23.3.0 behaviour that matters here

- **`@nx/vitest` resolves every project's Vite config during graph creation.**
  `buildVitestTargets` calls Vite's `resolveConfig` (an esbuild bundle of `vitest.config.ts`)
  for every project, in every variant. With `ciTargetName` set it resolves the config a
  second time (`serve` mode, `mode: 'test'`), then globs the specs through the workspace
  context. Since `include` is a plain glob, `createVitest` is not used. Atomization therefore
  roughly doubles the per-project Vite work, and adds one target per spec, independent of
  the spec count. Results are cached in `.nx/workspace-data/vitest-<hash>.hash`. Every phase
  here wipes that file, so every run is cold.
- **`run-many --graph=<file>.json` builds the project graph twice.** It builds it once for the
  run, then `generateGraph` rebuilds it (file map warm, plugins respawned, `createNodes` run
  again) before writing the JSON. The run never hashes. The `taskgraph` phase therefore
  overstates graph cost and doesn't measure hashing. `hash` is the faithful
  "everything before the first task" measurement. `taskgraph` is kept because the brief asked
  for it, and its `nxPerf.firstPass` holds the first pass alone.
- **Upfront hashing.** `invokeTasksRunner` calls
  `hashTasksThatDoNotDependOnOutputsOfOtherTasks` before it constructs the lifecycles, so all
  atoms, shards and `test` tasks are hashed before the first task starts. The atomized
  `test-ci` parents depend on their atoms, and `@nx/vitest`'s inputs include
  `dependentTasksOutputFiles`, so the parents are hashed at run time. This is why
  `hashedUpfront` is the task count minus N for atomized.
- **Plugin isolation** is on by default. Nx spawns one worker process per plugin: `@nx/vitest`,
  the shard plugin through `@swc-node/register`, and nx's built-in js, package-json and
  project-json plugins. `run-many --graph` spawns them twice.
- `nx show projects`, `nx graph` and `run-many` all honour `NX_WORKSPACE_DATA_DIRECTORY`, so
  wiping `.nx/workspace-data` makes them cold.

### Caveats

- The specs are tiny, so a task's duration is mostly Vitest startup: ~0.3 s CPU per process
  in the node environment. Run-phase deltas between variants are therefore mostly *runtime*
  per extra process, which is the real cost of atomization but not Nx-side. The Nx-side parts
  are `graph-cold`, `hash`, the run's `graphReadyMs`, and the median slot gap.
- Estimates (`--dry-run`) fit a line through the two largest sizes measured so far. With a
  single size, they scale the N-dependent Nx steps (project configs, dependencies, hashing)
  linearly, and the run phase by CPU seconds per task over `--est-cores`. Superlinear
  behaviour at large N is exactly what this experiment tests, so treat the first estimate as
  a lower bound. Re-run `--dry-run` after N=100 and N=500 for a better one.
- Under a restricted CPU set (`taskset`), `--parallel 16` oversubscribes the CPUs: task
  durations inflate and `overheadMs` is meaningless. Use run-phase numbers only from runs with
  ≥ P free cores. Each result records `cpus`.
