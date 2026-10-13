# nx-atomization-vs-sharding

Companion benchmark for [Nx atomization vs sharding: what the CPU is actually doing](https://edbzn.dev/blog/nx-atomization-vs-sharding/).

It compares three ways of turning test projects into Nx tasks, on identical synthetic workspaces (Nx 23.3):

| variant | tasks | how |
|---|---|---|
| `baseline` | one per project | plain `component-test` / `e2e` / `test` targets |
| `atomized` | one per spec file | Nx's native atomizers: `@nx/cypress` (`ciComponentTestingTargetName`), `@nx/playwright` and `@nx/vitest` (`ciTargetName`) |
| `sharded` | one per balanced group of specs | the custom plugin in [`shard-plugin/`](shard-plugin/src) |

Runners: Cypress component tests (React + Vite), Playwright e2e against `vite preview`, Vitest (jsdom + Testing Library).

## Layout

```
generator/      # seeded generator: workspaces/{baseline,atomized,sharded}, the 20..1500-project Vitest-only scale
                # workspaces (scale.mjs) and the 10..2000-project full size-sweep workspaces (size.mjs)
shard-plugin/   # the sharding plugin (Nx createNodes) + its unit tests
bench/          # run.mjs (one measured nx affected run), matrix.mjs (sweeps), aggregate.mjs,
                # simulate.mjs (DTE simulator), scale.mjs (workspace-size sweep, Vitest only),
                # size-sweep.mjs (full workspace at 10..2000 projects), report-data.mjs
results/        # aggregates, simulator output, workspace-size report, chart datasets (results/report),
                # Nx Agents runs (results/agents), REPORT.md
```

`bench/README.md` documents every metric, the sampler and the simulator.

## How a run is measured

1. Check out a scenario tag (`full`: a library every project depends on changed; `partial`: one mid-size project per runner changed) and wipe Nx's workspace data and caches.
2. Run `nx affected -t <targets> --skip-nx-cache --parallel=N` with `NX_PROFILE`, which records every task's start, end and slot.
3. Sample `/proc` every 250 ms and attribute each process to its Nx task through the `NX_TASK_TARGET_*` variables Nx sets: CPU time and proportional set size (PSS) per task, including Cypress and Chromium children.
4. Capture Nx 23's end-of-run performance report (critical path, slot queueing, coordinator time).

## Reproduce

The article's experiment: the same workspace at 12, 50 and 100 projects (Cypress CT and Vitest libraries, apps with their Playwright e2e projects, ~20 specs each), 17 runs per size (default, sharded and atomized, per runner and together, `--parallel` 8 and 16, shard targets 30/10/5 s). About 15 minutes at 12 projects, 40 at 50, 80 at 100.

```bash
bash bench/quick.sh                                 # 12 projects -> results/quick/aggregate.md, chart datasets in results/quick/report
N=50 bash bench/quick.sh                            # -> results/quick-50
N=100 bash bench/quick.sh                           # -> results/quick-100
```

Keep the machine otherwise idle while it runs: compare each run's `cpuSecondsSystem` with `cpuSecondsAttributed` in its `summary.json` to spot runs disturbed by other load, move them out of `raw/` and rerun the script (it resumes).

Playwright runs the way `@nx/playwright` expects: each app has a continuous `serve-static` target, and every e2e task (plain, atom or shard) reuses that one server through the inferred `e2e--wait-for-webserver` gate (`SIZE_E2E_SERVER=shared`). Continuous tasks are left out of the task counts and slot use.

The earlier, longer experiments (larger workspaces, size sweeps, a DTE simulator):

```bash
node generator/generate.mjs                         # writes workspaces/ and installs them (pnpm 12)
node bench/matrix.mjs bench/matrices/main.json      # 72 runs, ~2 h; resumable
node bench/matrix.mjs bench/matrices/parallel.json
node bench/matrix.mjs bench/matrices/shard-target.json
node bench/aggregate.mjs                            # -> results/aggregate.md
node bench/simulate.mjs --from atomized/full/all/p8 --agents 1,2,4,8,16 --slots 3 --policy greedy,batch
node bench/scale.mjs && node bench/scale-report.mjs # workspace-size sweep -> results/scale/report.md
node generator/size.mjs --plan                      # full-workspace size sweep: totals per size
node bench/size-sweep.mjs && node bench/size-sweep-report.mjs   # -> results/size-sweep/report.md; resumable
node bench/report-data.mjs                          # chart datasets -> results/report/
```

Don't run two benchmarks at once: each run kills stray processes carrying its marker, and they would skew each other's timings.

## Notes on Nx 23.3

- Native atomized targets refuse to run without Nx Cloud; the bench sets `NX_SKIP_ATOMIZER_VALIDATION=true`.
- `@nx/cypress` component-test atoms and `@nx/playwright` atoms are `parallelism: false`, so locally they run one at a time. The generated workspaces override it so `--parallel` is the only knob (`--native-parallelism` keeps the stock behaviour).
- `@nx/playwright` atomizes by default; `ciTargetName: ""` turns it off. With a shared `webServer` (`reuseExistingServer: true` and an `nx run` command), it infers a dependency on the continuous serve task, and atoms can run in parallel.
- Nx 23.3 keeps its cache and task history under `~/.nx/<hash>`; the bench pins them inside each workspace (`NX_WORKSPACE_DATA_DIRECTORY`, `NX_CACHE_DIRECTORY`).

## Results

The blog post has the analysis, and [`results/REPORT.md`](results/REPORT.md) has every number behind it. Its data:

- **Quick specs:** [`results/quick`](results/quick/aggregate.md), [`results/quick-50`](results/quick-50/aggregate.md), [`results/quick-100`](results/quick-100/aggregate.md) (`bench/quick.sh`).
- **Slow projects** (`SIZE_SLOW=0.2`: one project in five gets ~15 s specs): [`results/slow`](results/slow/aggregate.md), [`results/slow-50`](results/slow-50/aggregate.md), [`results/slow-100`](results/slow-100/aggregate.md) (`bench/slow.sh`), analysed in [`results/slow-report.md`](results/slow-report.md).
- **Nx Agents:** [`results/agents`](results/agents) (scripts in `bench/agents`).

 Earlier experiments: medians in [`results/aggregate.md`](results/aggregate.md) and the workspace-size sweep in [`results/scale/report.md`](results/scale/report.md). Measured on a Ryzen 9 9950X3D (16 cores, 32 threads), 64 GB, Ubuntu, Node 24.
