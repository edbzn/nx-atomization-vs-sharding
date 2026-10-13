# Nx atomization vs sharding: consolidated benchmark report

All experiments, re-derived from the raw data on 2026-10-12. Every number below was computed from the files listed in the [data index](#11-data-index). Section 10 explains how.

## 1. Executive summary

**The rule.** A run takes `work ÷ parallelism + idle tail`.
- *Work* is the sum of task durations.
- The *idle tail* is the time when fewer tasks are running than the parallelism allows, mostly at the end of the run.
- Splitting a project into more tasks shrinks the tail, but every extra task pays one runner startup. So splitting helps only while the tail it removes is larger than the startup work it adds, divided by the parallelism.

**What wins where** (all runners together, `--parallel=8` locally; wall time in s, fastest in bold):

| Experiment | 12 projects: default / sharded / atomized | 50 projects | 100 projects |
|---|---|---|---|
| Quick specs, local | 102.0 / **53.6** / 86.9 | **196.3** / 198.5 / 323.8 | **351.2** / 353.3 / 594.3 |
| Slow projects, local | 507.2 / **171.4** / 211.3 | 1241.0 / **489.9** / 650.6 | 1414.0 / **966.4** / 1170.3 |
| Nx Agents, quick specs, 8 agents (test time) | 170.1 / **67.1** / 95.1 | 249.8 / **170.0** / 274.8 | 290.3 / **286.7** / 558.8 |

At 50 and 100 projects with quick specs, default and sharded are within 1.1% of each other, which is within noise.

**Key findings**

1. **Sharding is the fastest setup, or within 1% of the fastest, in all 9 local all-runner configurations** (6 at P=8, 3 at P=16), and fastest in 8 of 9 Nx Agents configurations. The exception is 12 projects on 5 agents, where atomization was 7.5% faster, which is within the ±10% agent noise.
2. **Atomization pays a fixed startup per spec:** about 2.5–2.9 s for Cypress CT, 0.64–0.89 s for Playwright and 0.21–0.30 s for Vitest at P=8. At P=16 this grows to 4.35–4.62 s for Cypress CT. Atomization roughly doubles the CPU time (×1.95–2.14 against default on all runners, quick specs).
3. **Once the tail is gone, the gap between atomization and sharding is just that startup ÷ 8.** At 50 and 100 projects, the extra work of atomized over sharded, divided by 8, matches the measured wall gap within 4% (quick: 128.9 vs 125.3 s and 239.9 vs 241.0 s; slow: 154.5 vs 160.7 s and 203.0 vs 203.9 s).
4. **Slow projects change who loses, not who wins.** With quick specs, atomization is 65–69% *slower* than default at 50 and 100 projects. With slow projects it is 17–58% *faster* than default, because default's tail explodes (one 1203 s task in a 1241 s run). It still trails sharding by 21–33%.
5. **On Nx Agents the atomization penalty is as large or larger.** At 50 and 100 projects atomized test time is 62–95% above sharded (locally +63% and +68%), and atomization used the most agent-minutes: 450 of the matrix's 1086, against 301 for sharded and 336 for default.
6. **Break-even.** Atomization would beat sharding only above P ≈ 18 / 33 / 58 (slow, 12 / 50 / 100 projects) and P ≈ 34 / 113 / 208 (quick). This is a lower bound: the split setups' work grew 23–40% from P=8 to P=16.
7. **The user's hypothesis** ("atomization shines when some tests take much longer") **is only partly supported.** Slow projects do make splitting essential, and they make atomization beat default. But at 8-way parallelism, and on 3–8 agents, a capped sharding plugin still wins. Atomization's structural edge needs parallelism well above `maxShards` and slow work concentrated in one or two projects.

## 2. Common setup

| Item | Value |
|---|---|
| Machine | Ryzen 9 9950X3D, 16 cores / 32 threads, 64 GB (59.4 GB visible), Ubuntu, kernel 7.0, Node 24.18.1, Nx 23.3.0 |
| Command | `nx affected -t <targets> --base=base --head=HEAD --parallel=8 --skip-nx-cache --outputStyle=static`; scenario `full` (a library every project depends on changed); Nx data and caches wiped before each run; task history cold |
| Timing | `NX_PROFILE` (each task's start, end and lane) + a `/proc` sampler every 250 ms (CPU, PSS/RSS per task) |
| default | One task per project: `component-test`, `e2e`, `test` |
| sharded | `shard-plugin/`: estimates runtime from spec bytes (seconds per KB per runner), makes `ceil(estimate / target)` shards (target 10 s unless stated), fills them heaviest spec first, capped at `maxShards = 8` and at the spec count. A project with 1 shard delegates to its whole-project target |
| atomized | Nx atomizers, one task per spec file (`component-test-ci`, `e2e-ci`, `test-ci`). Cypress CT atoms forced to `parallelism: true` (`nx.json` `targetDefaults["component-test-ci--*/**"]`) |
| Runners | Cypress component tests (React + Vite); Playwright e2e against one shared `serve-static` server per app (`SIZE_E2E_SERVER=shared`, through `e2e--wait-for-webserver`); Vitest (jsdom) |
| Workspaces | `generator/size.mjs`, `SIZE_DENSITY=large` (about 20 specs per project) |

**Workspace shapes** (from `plan.txt` and the `quick*.log` plan lines; spec seconds are the generator's estimate):

| Projects | CT / Vitest / apps + e2e | Specs | Quick spec work (CT + Vitest + PW) | Slow spec work |
|--:|---|--:|--:|--:|
| 12 | 5 / 5 / 1 + 1 | 229 | ~115 + 27 + 11 = 153 s | ~560 + 177 + 187 = 924 s |
| 50 | 20 / 20 / 5 + 5 | 887 | ~427 + 87 + 109 = 623 s | ~2339 + 294 + 307 = 2940 s |
| 100 | 40 / 40 / 10 + 10 | 1674 | ~758 + 184 + 176 = 1118 s | ~4569 + 474 + 655 = 5698 s |

**Definitions used in every table**
- **Tasks**: real tasks. Atomizer and shard parents (`nx:noop`) and the continuous `serve-static` server are excluded. App `build` and `e2e--wait-for-webserver` gates are included.
- **Work**: Σ real task durations (task-seconds).
- **Idle tail**: `wall − work ÷ P`. It includes Nx pre-task time (0.6–1.5 s).
- **Startup per task**: for a project with n ≥ 2 units, `(Σ unit durations − default whole-project duration) ÷ (n − 1)`. Wait-for-webserver gates are excluded. The table gives the median across projects.

## 3. Experiment 1: quick specs, local (`bench/quick.sh`)

**Setup.** Spec time median 0.95 s for Cypress and Playwright (0.5–2 s) and 0.22 s for Vitest (0.1–0.5 s). There is one run per configuration: three setups × (all runners, each runner alone) at P=8, plus all runners at P=16, plus sharded with 30 s and 5 s targets. That makes 17 runs per size, 51 valid runs in `raw/`.

### 3.1 Wall time (s; `--parallel=8`)

| Projects | Runner | default | sharded | atomized | sharded vs default | atomized vs default | atomized vs sharded | Fastest |
|--:|---|--:|--:|--:|--:|--:|--:|---|
| 12 | all | 102.0 | **53.6** | 86.9 | −47% | −15% | +62% | sharded |
| 12 | Cypress CT | 95.8 | **47.1** | 69.6 | −51% | −27% | +48% | sharded |
| 12 | Playwright | 14.5 | 8.7 | **5.8** | −40% | −60% | −33% | atomized |
| 12 | Vitest | 27.9 | 18.4 | **13.2** | −34% | −53% | −28% | atomized |
| 50 | all | **196.3** | 198.5 | 323.8 | +1% | +65% | +63% | default (sharded within 5%) |
| 50 | Cypress CT | **147.7** | 149.4 | 257.1 | +1% | +74% | +72% | default (sharded within 5%) |
| 50 | Playwright | 53.7 | **20.9** | 28.5 | −61% | −47% | +36% | sharded |
| 50 | Vitest | 44.4 | **36.3** | 42.1 | −18% | −5% | +16% | sharded |
| 100 | all | **351.2** | 353.3 | 594.3 | +1% | +69% | +68% | default (sharded within 5%) |
| 100 | Cypress CT | 280.3 | **257.9** | 460.5 | −8% | +64% | +79% | sharded |
| 100 | Playwright | 40.8 | **32.9** | 44.6 | −19% | +9% | +36% | sharded |
| 100 | Vitest | **71.9** | 73.1 | 87.3 | +2% | +21% | +19% | default (sharded within 5%) |

**All runners at P=16, and the shard-target dial at P=8** (wall s; real task count in brackets):

| Projects | default P=16 | sharded P=16 | atomized P=16 | sharded, 30 s target | sharded, 10 s target | sharded, 5 s target |
|--:|--:|--:|--:|--:|--:|--:|
| 12 | 97.2 | **39.3** | 59.4 | 64.1 (16) | **53.6** (29) | 57.2 (43) |
| 50 | 168.1 | **130.9** | 228.4 | **189.6** (68) | 198.5 (119) | 210.2 (176) |
| 100 | 267.3 | **234.2** | 417.3 | **332.7** (127) | 353.3 (216) | 381.5 (337) |

- At P=16, sharding wins at every size. Atomization beats default only at 12 projects.
- At 50 and 100 projects, the 30 s shard target is the best of the three. Fewer, bigger shards pay fewer startups.

### 3.2 Tasks

| Projects | Runner | default | sharded | atomized |
|--:|---|--:|--:|--:|
| 12 | all | 13 | 29 | 231 |
| 12 | Cypress CT / Playwright / Vitest | 5 / 3 / 5 | 19 / 4 / 6 | 109 / 12 / 110 |
| 50 | all | 55 | 119 | 897 |
| 50 | Cypress CT / Playwright / Vitest | 20 / 15 / 20 | 71 / 26 / 22 | 408 / 121 / 368 |
| 100 | all | 110 | 216 | 1694 |
| 100 | Cypress CT / Playwright / Vitest | 40 / 30 / 40 | 127 / 45 / 44 | 733 / 198 / 763 |

### 3.3 Work and idle tail

All runners, P=8:

| Projects | Setup | Wall (s) | Tasks | Work (task-s) | Work ÷ 8 | Idle tail | Tail % of wall | Fewer than 8 running at the end | Longest task (s) |
|--:|---|--:|--:|--:|--:|--:|--:|---|--:|
| 12 | default | 102.0 | 13 | 340.9 | 42.6 | 59.4 | 58% | 75.8 s (from 26.2 s) | 94.8 |
| 12 | sharded | 53.6 | 29 | 393.1 | 49.1 | 4.5 | 8% | 7.3 s (from 46.0 s) | 20.1 |
| 12 | atomized | 86.9 | 231 | 673.3 | 84.2 | 2.8 | 3% | 2.7 s (from 83.9 s) | 7.2 |
| 50 | default | 196.3 | 55 | 1391.6 | 174.0 | 22.4 | 11% | 38.3 s (from 157.7 s) | 147.4 |
| 50 | sharded | 198.5 | 119 | 1536.3 | 192.0 | 6.4 | 3% | 10.6 s (from 187.5 s) | 22.8 |
| 50 | atomized | 323.8 | 897 | 2567.7 | 321.0 | 2.9 | 1% | 1.1 s (from 322.4 s) | 7.2 |
| 100 | default | 351.2 | 110 | 2533.7 | 316.7 | 34.5 | 10% | 51.8 s (from 299.4 s) | 129.5 |
| 100 | sharded | 353.3 | 216 | 2784.0 | 348.0 | 5.3 | 2% | 6.4 s (from 346.6 s) | 22.7 |
| 100 | atomized | 594.3 | 1694 | 4703.1 | 587.9 | 6.4 | 1% | 2.7 s (from 591.2 s) | 7.6 |

Per runner, P=8 (`work ÷ 8 + idle tail`, s):

| Projects | Runner | default | sharded | atomized |
|--:|---|---|---|---|
| 12 | Cypress CT | 30.9 + 64.9 | 37.3 + 9.8 | 67.3 + 2.3 |
| 12 | Playwright | 1.7 + 12.8 | 1.8 + 7.0 | 2.5 + 3.3 |
| 12 | Vitest | 8.2 + 19.7 | 8.7 + 9.7 | 12.1 + 1.1 |
| 50 | Cypress CT | 124.9 + 22.7 | 142.1 + 7.4 | 253.8 + 3.3 |
| 50 | Playwright | 15.7 + 38.0 | 17.0 + 3.9 | 25.3 + 3.2 |
| 50 | Vitest | 29.8 + 14.6 | 29.7 + 6.5 | 40.7 + 1.5 |
| 100 | Cypress CT | 225.9 + 54.3 | 252.5 + 5.4 | 456.6 + 3.8 |
| 100 | Playwright | 26.5 + 14.3 | 27.8 + 5.1 | 41.3 + 3.2 |
| 100 | Vitest | 63.6 + 8.3 | 63.9 + 9.2 | 84.9 + 2.4 |

All runners, P=16:

| Projects | Setup | Wall (s) | Work (task-s) | Work ÷ 16 | Idle tail | Longest task (s) | CPU s |
|--:|---|--:|--:|--:|--:|--:|--:|
| 12 | default | 97.2 | 346.6 | 21.7 | 75.5 | 96.5 | 373 |
| 12 | sharded | 39.3 | 482.2 | 30.1 | 9.1 | 22.7 | 597 |
| 12 | atomized | 59.4 | 907.0 | 56.7 | 2.7 | 8.8 | 1103 |
| 50 | default | 168.1 | 1681.9 | 105.1 | 63.0 | 159.2 | 2070 |
| 50 | sharded | 130.9 | 1982.5 | 123.9 | 7.0 | 30.1 | 2541 |
| 50 | atomized | 228.4 | 3599.6 | 225.0 | 3.4 | 10.2 | 4343 |
| 100 | default | 267.3 | 3169.1 | 198.1 | 69.2 | 138.5 | 4034 |
| 100 | sharded | 234.2 | 3649.0 | 228.1 | 6.2 | 32.1 | 4700 |
| 100 | atomized | 417.3 | 6588.3 | 411.8 | 5.5 | 11.3 | 7923 |

What the decomposition shows:
- **Default's problem is the tail; atomization's problem is the work.**
  - At 12 projects, default's tail is 58% of the wall.
  - At 50 and 100 projects there is enough work for default's tail to fall to 10–11%. Sharding then has nothing left to recover: its smaller tail (−16.0 s at 50, −29.2 s at 100) is offset by its extra work ÷ 8 (+18.1 s, +31.3 s).
- **Atomization's tail is always the smallest (1–3%), but its work is 1.85–1.98× default's.**
- **More parallelism inflates every setup's work.** From P=8 to P=16, work grew 21–25% for default at 50–100 projects, 23–31% for sharded and 35–40% for atomized. Task durations include CPU and memory contention.
- **The split setups run e2e last.** With cold task history, Nx starts the app builds late, at 39–280 s in the atomized runs and 17–166 s in the sharded runs, against 1–2 s for default. So the e2e work ends the run.

### 3.4 CPU time (s, attributed to the Nx process tree; P=8)

| Projects | Runner | default / sharded / atomized | atomized ÷ default | sharded ÷ default | Avg cores busy default / sharded / atomized |
|--:|---|---|--:|--:|---|
| 12 | all | 370 / 449 / 789 | 2.14 | 1.22 | 3.61 / 8.32 / 9.05 |
| 12 | Cypress CT | 262 / 348 / 650 | 2.48 | 1.33 | 2.73 / 7.33 / 9.29 |
| 12 | Playwright | 8 / 9 / 18 | 2.11 | 1.13 | 0.56 / 1.04 / 2.81 |
| 12 | Vitest | 69 / 74 / 107 | 1.55 | 1.07 | 2.45 / 3.93 / 7.93 |
| 50 | all | 1525 / 1712 / 2980 | 1.95 | 1.12 | 7.75 / 8.61 / 9.19 |
| 50 | Cypress CT | 1129 / 1314 / 2409 | 2.13 | 1.16 | 7.63 / 8.77 / 9.36 |
| 50 | Playwright | 75 / 94 / 188 | 2.51 | 1.26 | 1.39 / 4.42 / 6.54 |
| 50 | Vitest | 258 / 258 / 367 | 1.42 | 1.00 | 5.76 / 7.02 / 8.63 |
| 100 | all | 2787 / 3122 / 5434 | 1.95 | 1.12 | 7.93 / 8.82 / 9.14 |
| 100 | Cypress CT | 2104 / 2359 / 4364 | 2.07 | 1.12 | 7.5 / 9.13 / 9.47 |
| 100 | Playwright | 140 / 155 / 313 | 2.24 | 1.11 | 3.39 / 4.67 / 6.94 |
| 100 | Vitest | 546 / 551 / 759 | 1.39 | 1.01 | 7.56 / 7.5 / 8.65 |

Machine-wide CPU (`cpuSecondsSystem`, which includes background load) for all runners: 457 / 523 / 1018 s at 12 projects, 1816 / 2030 / 3757 s at 50, and 3136 / 3600 / 6852 s at 100.

### 3.5 Startup per task (s; P=8)

| Projects | Runs | atomized vs default: CT / Playwright / Vitest | atomized − sharded, per extra task: CT / Playwright / Vitest |
|--:|---|---|---|
| 12 | runner-only | 2.81 / 0.69 / 0.30 | 2.67 / 0.71 / 0.26 |
| 12 | all runners | 2.89 / 0.64 / 0.22 | 2.83 / 0.65 / 0.19 |
| 50 | runner-only | 2.62 / 0.72 / 0.24 | 2.65 / 0.70 / 0.25 |
| 50 | all runners | 2.66 / 0.70 / 0.21 | 2.65 / 0.71 / 0.21 |
| 100 | runner-only | 2.63 / 0.70 / 0.23 | 2.70 / 0.71 / 0.23 |
| 100 | all runners | 2.73 / 0.66 / 0.23 | 2.72 / 0.66 / 0.23 |

- **The first column** is the median over projects. The interquartile ranges are narrow: for CT none is wider than 0.15 s (for example 2.59–2.74 s).
- **The second column** is `(atomized work − sharded work) ÷ (atomized tasks − sharded tasks)` for that runner.
- **The two methods agree within 0.2 s.**
- **At P=16 (all runners) the atomized startup rises** to CT 4.62 / 4.41 / 4.35 s, Playwright 1.16 / 0.87 / 0.81 s and Vitest 0.48 / 0.25 / 0.31 s at 12 / 50 / 100 projects.
- **The sharded-vs-default startup is not reliable.** Few projects have n ≥ 2 shards, and the division by (n − 1) amplifies noise. Section 4.5 shows it can come out negative.

## 4. Experiment 2: slow projects, local (`bench/slow.sh`, `SIZE_SLOW=0.2`)

**Setup.**
- **Slow projects.** A fifth of each runner's projects (at least one) get slow specs: Cypress and Playwright median 15 s (5–60 s), Vitest median 3 s (1–8 s). Every other project is identical to the quick workspace.
- **How many.** With the generator's rounding rule (`round(0.2 × count)`, at least 1), that gives 3 slow projects at 12 (1 CT / 1 Vitest / 1 Playwright), 9 at 50 (4 / 4 / 1) and 18 at 100 (8 / 8 / 2).
- **Runs.** One run per configuration, at P=8 only: three setups × (all runners, each runner alone). That makes 12 valid runs per size in `raw/`; excluded runs are listed in section 9.

### 4.1 Wall time (s; `--parallel=8`)

| Projects | Runner | default | sharded | atomized | sharded vs default | atomized vs default | atomized vs sharded | Fastest |
|--:|---|--:|--:|--:|--:|--:|--:|---|
| 12 | all | 507.2 | **171.4** | 211.3 | −66% | −58% | +23% | sharded |
| 12 | Cypress CT | 506.1 | **107.3** | 124.8 | −79% | −75% | +16% | sharded |
| 12 | Playwright | 209.8 | **56.2** | 58.5 | −73% | −72% | +4% | sharded (atomized within 5%) |
| 12 | Vitest | 166.0 | 43.2 | **32.7** | −74% | −80% | −24% | atomized |
| 50 | all | 1241.0 | **489.9** | 650.6 | −61% | −48% | +33% | sharded |
| 50 | Cypress CT | 1195.0 | **399.4** | 489.7 | −67% | −59% | +23% | sharded |
| 50 | Playwright | 224.1 | **55.2** | 72.2 | −75% | −68% | +31% | sharded |
| 50 | Vitest | 96.7 | **64.1** | 68.7 | −34% | −29% | +7% | sharded |
| 100 | all | 1414.0 | **966.4** | 1170.3 | −32% | −17% | +21% | sharded |
| 100 | Cypress CT | 1310.0 | **762.6** | 953.3 | −42% | −27% | +25% | sharded |
| 100 | Playwright | 421.1 | **95.7** | 109.5 | −77% | −74% | +14% | sharded |
| 100 | Vitest | 131.2 | **110.0** | 130.7 | −16% | 0% | +19% | sharded |

These match `results/slow-report.md` to the 0.1 s.

### 4.2 Tasks

| Projects | Runner | default | sharded | atomized |
|--:|---|--:|--:|--:|
| 12 | all | 13 | 44 | 231 |
| 12 | Cypress CT / Playwright / Vitest | 5 / 3 / 5 | 22 / 10 / 12 | 109 / 12 / 110 |
| 50 | all | 55 | 163 | 897 |
| 50 | Cypress CT / Playwright / Vitest | 20 / 15 / 20 | 84 / 32 / 47 | 408 / 121 / 368 |
| 100 | all | 110 | 285 | 1694 |
| 100 | Cypress CT / Playwright / Vitest | 40 / 30 / 40 | 152 / 55 / 78 | 733 / 198 / 763 |

### 4.3 Work and idle tail

All runners, P=8:

| Projects | Setup | Wall (s) | Tasks | Work (task-s) | Work ÷ 8 | Idle tail | Tail % of wall | Fewer than 8 running at the end | Longest task (s) |
|--:|---|--:|--:|--:|--:|--:|--:|---|--:|
| 12 | default | 507.2 | 13 | 1126.2 | 140.8 | 366.4 | 72% | 481.7 s (from 25.4 s) | 506.5 |
| 12 | sharded | 171.4 | 44 | 1192.7 | 149.1 | 22.3 | 13% | 37.9 s (from 133.2 s) | 81.6 |
| 12 | atomized | 211.3 | 231 | 1435.0 | 179.4 | 31.9 | 15% | 47.4 s (from 163.5 s) | 53.7 |
| 50 | default | 1241.0 | 55 | 3844.4 | 480.5 | 760.5 | 61% | 985.8 s (from 255.2 s) | 1203.1 |
| 50 | sharded | 489.9 | 163 | 3872.0 | 484.0 | 5.9 | 1% | 8.1 s (from 481.4 s) | 159.1 |
| 50 | atomized | 650.6 | 897 | 5108.0 | 638.5 | 12.1 | 2% | 12.1 s (from 638.1 s) | 66.2 |
| 100 | default | 1414.0 | 110 | 7168.2 | 896.0 | 517.9 | 37% | 755.1 s (from 658.8 s) | 1050.7 |
| 100 | sharded | 966.4 | 285 | 7681.2 | 960.1 | 6.3 | 1% | 7.5 s (from 958.6 s) | 162.4 |
| 100 | atomized | 1170.3 | 1694 | 9305.2 | 1163.1 | 7.1 | 1% | 3.9 s (from 1166.0 s) | 59.8 |

Per runner, P=8 (`work ÷ 8 + idle tail`, s):

| Projects | Runner | default | sharded | atomized |
|--:|---|---|---|---|
| 12 | Cypress CT | 86.0 + 420.1 | 96.9 + 10.4 | 122.5 + 2.3 |
| 12 | Playwright | 26.1 + 183.7 | 27.8 + 28.4 | 27.0 + 31.5 |
| 12 | Vitest | 25.4 + 140.6 | 29.5 + 13.7 | 31.6 + 1.1 |
| 50 | Cypress CT | 369.5 + 825.5 | 393.7 + 5.7 | 487.0 + 2.7 |
| 50 | Playwright | 41.8 + 182.3 | 43.6 + 11.6 | 51.1 + 21.1 |
| 50 | Vitest | 54.4 + 42.3 | 56.2 + 7.9 | 65.9 + 2.7 |
| 100 | Cypress CT | 721.9 + 588.1 | 749.6 + 12.9 | 940.8 + 12.6 |
| 100 | Playwright | 87.3 + 333.9 | 89.4 + 6.3 | 106.1 + 3.4 |
| 100 | Vitest | 102.7 + 28.6 | 100.7 + 9.3 | 128.1 + 2.6 |

**The biggest projects, all-runner runs** (task seconds):

| Projects | Project | default task (start) | sharded: shards / Σ / biggest (ends at, of wall) | Project share of sharded work | atomized: atoms / Σ / biggest |
|--:|---|---|---|--:|---|
| 12 | ct-invoice-0002 | 506.5 (0.6) | 8 / 525.0 / 81.6 (105.9 of 171.4) | 44% | 29 / 571.1 / 44.0 |
| 12 | academy-0000-e2e | 210.5 (12.4) | 8 / 216.5 / 53.8 (171.0 of 171.4) | 18% | 10 / 217.6 / 53.7 |
| 12 | unit-asset-0003 | 177.9 (0.6) | 8 / 189.3 / 28.6 (42.3 of 171.4) | 16% | 49 / 194.4 / 8.5 |
| 50 | ct-booking-0012 | 1203.1 (37.8) | 8 / 1205.6 / 159.1 (281.9 of 489.9) | 31% | 60 / 1365.5 / 66.2 |
| 50 | ct-invoice-0039 | 570.0 (31.3) | 8 / 575.4 / 85.7 (126.5 of 489.9) | 15% | 33 / 653.0 / 45.9 |
| 100 | ct-product-0026 | 1050.7 (363.3) | 8 / 1100.5 / 162.4 (797.7 of 966.4) | 14% | 56 / 1200.7 / 49.1 |
| 100 | ct-booking-0012 | 702.3 (49.6) | 8 / 731.3 / 112.5 (231.8 of 966.4) | 10% | 35 / 774.0 / 50.1 |

What the decomposition shows:
- **Default collapses on its tail:** 72% / 61% / 37% of the wall at 12 / 50 / 100 projects. At 100 projects it is helped by the biggest project being a smaller share of the work. It is hurt by Nx starting that 1051 s project only at 363 s.
- **Both split setups remove the tail from 50 projects up** (1–2% of the wall). Wall then follows work ÷ 8, and atomized work is 20% / 32% / 21% above sharded.
- **The 8-shard cap limited every slow project to 8 shards, but never set the wall.** The biggest shard ended at 106 s of 171 s, 282 s of 490 s and 798 s of 966 s. With P=8 = `maxShards`, a project's biggest shard is about its work ÷ 8, which cannot exceed the whole run's work ÷ 8.
- **At 12 projects both splits end on Playwright.** Nx started the app build late (83 s sharded, 110 s atomized). The last 54 s spec of `academy-0000-e2e` then ran alone at the end, and neither setup can split it further.
- **The only atomized win (Vitest at 12 projects, −24%) is a packing effect.** Vitest work ÷ 8 is about 30 s. Sharding leaves a 29.5 s shard and a 13.7 s tail, while atomization leaves a 1.1 s tail.

### 4.4 CPU time (s, attributed; P=8)

| Projects | Runner | default / sharded / atomized | atomized ÷ default | sharded ÷ default | Avg cores busy default / sharded / atomized |
|--:|---|---|--:|--:|---|
| 12 | all | 741 / 855 / 1166 | 1.57 | 1.15 | 1.46 / 4.98 / 5.51 |
| 12 | Cypress CT | 456 / 636 / 885 | 1.94 | 1.39 | 0.9 / 5.9 / 7.07 |
| 12 | Playwright | 103 / 129 / 113 | 1.10 | 1.26 | 0.49 / 2.29 / 1.92 |
| 12 | Vitest | 149 / 191 / 208 | 1.39 | 1.28 | 0.9 / 4.38 / 6.3 |
| 50 | all | 2907 / 2839 / 4688 | 1.61 | 0.98 | 2.34 / 5.79 / 7.2 |
| 50 | Cypress CT | 2135 / 2512 / 3245 | 1.52 | 1.18 | 1.79 / 6.28 / 6.62 |
| 50 | Playwright | 177 / 203 / 290 | 1.64 | 1.15 | 0.79 / 3.67 / 4 |
| 50 | Vitest | 372 / 388 / 482 | 1.30 | 1.04 | 3.84 / 6.02 / 6.99 |
| 100 | all | 5000 / 6109 / 7914 | 1.58 | 1.22 | 3.54 / 6.32 / 6.76 |
| 100 | Cypress CT | 4297 / 4526 / 6457 | 1.50 | 1.05 | 3.28 / 5.93 / 6.77 |
| 100 | Playwright | 397 / 433 / 648 | 1.63 | 1.09 | 0.94 / 4.51 / 5.89 |
| 100 | Vitest | 755 / 731 / 1018 | 1.35 | 0.97 | 5.74 / 6.62 / 7.77 |

- Atomization's CPU overhead is a smaller share here (×1.57–1.61 against default on all runners, against ×1.95–2.14 with quick specs) because the slow specs add real work.
- Machine-wide CPU for all runners: 1217 / 1041 / 1459 s at 12 projects, 5183 / 3269 / 6436 s at 50, and 6239 / 8259 / 10111 s at 100. Default's machine-wide total is inflated by background load over its long wall.

### 4.5 Startup per task (s; P=8)

| Projects | Runs | atomized vs default: CT / Playwright / Vitest | atomized − sharded, per extra task: CT / Playwright / Vitest |
|--:|---|---|---|
| 12 | runner-only | 2.76 / 0.80 / 0.28 | 2.35 / n/a (2 extra tasks) / 0.17 |
| 12 | all runners | 2.73 / 0.79 / 0.21 | 2.58 / 0.57 / 0.17 |
| 50 | runner-only | 2.55 / 0.70 / 0.23 | 2.30 / 0.67 / 0.24 |
| 50 | all runners | 2.87 / 0.75 / 0.24 | 3.20 / 0.98 / 0.35 |
| 100 | runner-only | 2.48 / 0.79 / 0.27 | 2.63 / 0.93 / 0.32 |
| 100 | all runners | 2.60 / 0.89 / 0.21 | 2.38 / 0.89 / 0.16 |

- **Atomization's startup per task is the same as with quick specs.** It does not depend on spec duration.
- **The "per extra task" estimate is noisier here.** It divides a difference of large work totals, so ±5% noise in thousands of task-seconds moves it by tenths of a second.
  - Example: slow-50 all-runners CT gives 3.20 s; runner-only gives 2.30 s.
  - At 12 projects, Playwright has only 2 extra atoms, and the runner-only value (−3.36 s) is meaningless.
- **Sharded vs default is unusable as a startup estimate on slow projects.** It ranges from −1.30 to +5.20 s (for example, Vitest at 50 projects, all runners: −1.30 s). Long shards vary by more than one startup.

**Atomization's extra startup explains the whole gap to sharding** (all runners, P=8; extra work predicted as Σ over runners of extra tasks × median atomized startup):

| Experiment | Projects | Extra tasks × startup (CT + PW + Vitest) | Predicted extra work (s) | Measured extra work (s) | Predicted gap = ÷ 8 (s) | Measured wall gap (s) |
|---|--:|---|--:|--:|--:|--:|
| quick | 12 | 90×2.89 + 8×0.64 + 104×0.22 | 287 | 280 | 35.9 | 33.3 |
| quick | 50 | 337×2.66 + 95×0.70 + 346×0.21 | 1035 | 1031 | 129.4 | 125.3 |
| quick | 100 | 606×2.73 + 153×0.66 + 719×0.23 | 1921 | 1919 | 240.1 | 241.0 |
| slow | 12 | 87×2.73 + 2×0.79 + 98×0.21 | 260 | 242 | 32.5 | 39.9 |
| slow | 50 | 324×2.87 + 89×0.75 + 321×0.24 | 1072 | 1236 | 134.0 | 160.7 |
| slow | 100 | 581×2.60 + 143×0.89 + 685×0.21 | 1787 | 1624 | 223.4 | 203.9 |

The prediction is within 1% for quick specs at 50 and 100 projects, and within 7–15% with slow specs.

## 5. Experiment 3: real Nx Agents (CI)

**Setup.**
- **Workspaces.** The *quick* workspaces (`workspaces/size-quick/*-{12,50,100}`), not the slow ones. Each was pushed to a branch `agents/<setup>-<size>` with a GitHub Actions workflow.
- **Distribution.** `nx-cloud start-ci-run --distribute-on="<N> linux-large-bench"` on 3, 5 or 8 agents. Each agent is `docker_linux_amd64/large`, 4 vCPU and about 16 GB, with one shared Xvfb display. Nx Cloud decides how many tasks each agent runs at once; there is no `--parallel`.
- **Cache.** A per-run `NX_BENCH_RUN_ID` in `sharedGlobals` makes every run a cache miss. Sharded workspaces set `targetShardSeconds: 10` in `nx.json`.
- **Timing.**
  - *Boot* runs from job start until the first agent has run a no-op task (`shared-ui:agents-ready`).
  - *Test time* runs from there to the end of `nx run-many`.
  - Agent-minutes are `agents × (boot + test) ÷ 60`, as in `agents-data.py`.
- **Runs.** One run per configuration, 27 valid runs on 2026-10-11.

### 5.1 Test time (s)

| Projects | Setup | 3 agents | 5 agents | 8 agents | Speedup 3 → 8 agents | Agent-minutes 3 / 5 / 8 | Local P=8 wall (quick) |
|--:|---|--:|--:|--:|--:|---|--:|
| 12 | default | 158.7 | 182.8 | 170.1 | 0.93× | 14.8 / 26.8 / 32.0 | 102.0 |
| 12 | sharded | **113.4** | 114.4 | **67.1** | 1.69× | 12.6 / 15.5 / 27.7 | 53.6 |
| 12 | atomized | 164.3 | **105.8** | 95.1 | 1.73× | 15.1 / 20.2 / 31.2 | 86.9 |
| 50 | default | 440.7 | 252.2 | 249.8 | 1.76× | 28.9 / 32.6 / 52.1 | 196.3 |
| 50 | sharded | **363.4** | **240.2** | **170.0** | 2.14× | 25.1 / 31.3 / 41.2 | 198.5 |
| 50 | atomized | 650.2 | 450.9 | 274.8 | 2.37× | 39.6 / 49.0 / 54.4 | 323.8 |
| 100 | default | 837.9 | 486.1 | 290.3 | 2.89× | 48.8 / 51.7 / 48.0 | 351.2 |
| 100 | sharded | **709.6** | **426.0** | **286.7** | 2.47× | 42.5 / 47.4 / 57.6 | 353.3 |
| 100 | atomized | 1336.3 | 799.1 | 558.8 | 2.39× | 73.7 / 72.6 / 93.9 | 594.3 |

| Projects | Agents | Fastest | atomized vs sharded | atomized vs default | sharded vs default |
|--:|--:|---|--:|--:|--:|
| 12 | 3 | sharded | +44.9% | +3.5% | −28.6% |
| 12 | 5 | atomized (sharded +8.1%, within noise) | −7.5% | −42.1% | −37.4% |
| 12 | 8 | sharded | +41.8% | −44.1% | −60.6% |
| 50 | 3 | sharded | +78.9% | +47.5% | −17.5% |
| 50 | 5 | sharded (default +5.0%, within noise) | +87.7% | +78.8% | −4.7% |
| 50 | 8 | sharded | +61.6% | +10.0% | −31.9% |
| 100 | 3 | sharded | +88.3% | +59.5% | −15.3% |
| 100 | 5 | sharded | +87.6% | +64.4% | −12.4% |
| 100 | 8 | sharded (default +1.2%, within noise) | +94.9% | +92.5% | −1.2% |

### 5.2 Boot, cost and scaling

- **Boot does not depend on the setup, and it is bimodal.** 4 runs booted in 69.7–71.8 s; the other 23 took 133.3–145.6 s (median of all 27: 138.2 s). Boot is excluded from test time but included in agent-minutes.
- **Agent-minutes over the 27 runs total 1086:** default 336, sharded 301, atomized 450.
- **Going from 3 to 8 agents (2.67× capacity) changes test time by 0.93× to 2.89×.** Default at 12 projects does not scale at all: 12 tasks, bound by its longest project.
- **Per-task startup cannot be measured from this data.** Only run-level timings were recorded, with no per-task durations.

### 5.3 Local vs Nx Agents

| Projects | Setup | Local P=8 wall (one 16-core machine) | 8 agents test time (32 vCPU) | 8 agents vs local |
|--:|---|--:|--:|--:|
| 12 | default / sharded / atomized | 102.0 / 53.6 / 86.9 | 170.1 / 67.1 / 95.1 | +67% / +25% / +9% |
| 50 | default / sharded / atomized | 196.3 / 198.5 / 323.8 | 249.8 / 170.0 / 274.8 | +27% / −14% / −15% |
| 100 | default / sharded / atomized | 351.2 / 353.3 / 594.3 | 290.3 / 286.7 / 558.8 | −17% / −19% / −6% |

- **Same ranking at 50 and 100 projects:** sharded ≤ default < atomized, both locally and on agents.
- **The atomized penalty against sharding is as large or larger on agents** (+62% to +95% at 50–100 projects) than locally (+63%, +68%). It is about the same on 8 agents at 50 projects, and larger everywhere else.
- **At 12 projects, atomization and default trade places.** Locally, atomization beats default (−15%). On agents it ties default at 3 agents (+3.5%) and beats it at 5 and 8 agents (−42%, −44%).
- **Eight 4-vCPU agents are only 6–19% faster than this one desktop at P=8 at 100 projects**, before adding about 138 s of boot.

### 5.4 Slow projects on Nx Agents (added 2026-10-13)

The slow-projects workspace at 100 projects, on 8 agents only (to limit Nx Cloud credits), one run per setup. Branches `agents/<setup>-slow-100`, built by `bench/agents/prepare-slow.sh`; results in `results/agents/results/*-slow-100-8.json`.

| Setup | Boot (s) | Test time (s) | Whole run (s) | Agent-minutes |
|---|--:|--:|--:|--:|
| default | 145.2 | 1296.2 | 1441.4 | 192.2 |
| sharded | 142.0 | **650.8** | 792.8 | 105.7 |
| atomized | 140.9 | 1001.5 | 1142.5 | 152.3 |

Same order as locally at `--parallel=8` (sharded 966 s, atomized 1,170 s, default 1,414 s): sharding fastest, atomization second, the default last.

## 6. Earlier studies (brief)

These come from the generated reports, which their scripts build from raw runs. The 1500-project walls were re-checked against `scale/raw/n1500/*/run-r1.json`.

| Study | Setup | Result |
|---|---|---|
| Workspace-size scaling (`results/scale/report.md`) | Vitest-only, 20–1500 projects, P=16, 1 run per point | At 1500 projects: default 126.2 s, sharded 142.3 s, atomized 3723.3 s (62 min, 13,859 tasks). The Nx coordinator becomes the bottleneck: mean gap between consecutive tasks in a lane 229 ms (default 1.2 ms). Pre-task cost is about 0.5 ms per extra atom (graph + hashing): 10.4 s vs 3.4 s ready-to-run at 1500 projects |
| Size sweep (`results/size-sweep/report.md`) | Full workspace, small density (about 5 specs per project), 10–500 projects, P=8, 1 run per point | atomized ÷ default: 0.89× at 10 projects, rising to 1.37× at 100 and 1.62× at 500. sharded ÷ default 0.83–1.02×. Nx coordinator overhead appears for atomized from 250 projects (18.0 s; 1m25s at 500) |
| Close-up (`results/closeup/aggregate.md`) | 100 projects, small density, P = 4 / 8 / 16, 1 run each | default 3m05s / 1m50s / 1m18s; sharded 3m03s / 1m41s / 1m10s; atomized 4m36s / 2m33s / 1m46s. Atomized CT startup 2.2 s / 2.7 s / 4.2 s: it grows with P |
| Repeated matrix (`results/aggregate.md`, `results/raw`) | Older 18-project workspace, 2–3 reps | Used here only for noise estimates (section 9.1) |

## 7. Cross-experiment comparison

| Comparison (all runners, P=8) | Quick 12 / 50 / 100 | Slow 12 / 50 / 100 |
|---|---|---|
| atomized vs default | −15% / +65% / +69% | −58% / −48% / −17% |
| atomized vs sharded | +62% / +63% / +68% | +23% / +33% / +21% |
| sharded vs default | −47% / +1% / +1% | −66% / −61% / −32% |
| Default idle tail, % of wall | 58% / 11% / 10% | 72% / 61% / 37% |
| Extra work, atomized over sharded | +71% / +67% / +69% | +20% / +32% / +21% |

- **Slow projects flip atomized vs default.** Atomization goes from losing (+65–69% at 50 and 100 projects) to winning (−17% to −58%). The reason is that default's tail grows from 10–11% to 37–61% of the wall, not that atomization got better.
- **Slow projects shrink, but do not close, the gap to sharding.** The extra startup work is about the same in absolute terms (1031 vs 1236 task-s at 50 projects; 1919 vs 1624 at 100). It is a smaller share of a larger total.
- **Local vs agents:** same winner (sharded) and the same loser at 50 and 100 projects (atomized). On agents, atomization's penalty is as large or larger. It never clearly wins: its one win is within noise.

## 8. Verdict and guidance

### 8.1 The hypothesis: "atomization shines when some tests take much longer"

| Claim | Verdict | Evidence |
|---|---|---|
| Slow tests make splitting essential | **Supported** | Default is 1.5–3.0× slower than sharded with slow projects (1414 / 966 at 100 projects; 507 / 171 at 12) |
| Atomization beats default when some tests are slow | **Supported** | −58% / −48% / −17% (slow), against +65% / +69% at 50 / 100 projects with quick specs |
| Atomization beats sharding when some tests are slow | **Not supported at P=8, nor on 3–8 agents (quick workspaces)** | +21–33% slower than sharded locally, on every runner except Vitest at 12 projects (−24%, a packing effect) |

### 8.2 Break-even parallelism (estimate)

**Model.** `wall ≈ max(work ÷ P, longest task)`, using the work and longest task measured at P=8. Atomization beats sharding once `atomized work ÷ P` falls below sharding's longest task (its biggest shard), i.e. for `P > atomized work ÷ sharded longest task`.

| Experiment | Projects | Sharded: work / longest | Atomized: work / longest | Atomized beats sharded from P > | Atomized beats default from P > | Model ÷ measured wall at P=8 (sharded / atomized) |
|---|--:|---|---|--:|--:|---|
| quick | 12 | 393.1 / 20.1 | 673.3 / 7.2 | 33.5 | 7.1 | −8% / −3% |
| quick | 50 | 1536.3 / 22.8 | 2567.7 / 7.2 | 112.6 | 17.4 | −3% / −1% |
| quick | 100 | 2784.0 / 22.7 | 4703.1 / 7.6 | 207.2 | 36.3 | −2% / −1% |
| slow | 12 | 1192.7 / 81.6 | 1435.0 / 53.7 | 17.6 | 2.8 | −13% / −15% |
| slow | 50 | 3872.0 / 159.1 | 5108.0 / 66.2 | 32.1 | 4.2 | −1% / −2% |
| slow | 100 | 7681.2 / 162.4 | 9305.2 / 59.8 | 57.3 | 8.9 | −1% / −1% |

- **These break-even points are lower bounds.** The model holds work fixed. Checked against the quick P=16 runs, it under-predicts the wall by 26–37% for the split setups, because their work grew 23–40% from P=8 to P=16 on this machine.
- **Separate agents avoid that local contention, but the agent runs did not show atomization getting closer.** At 50 and 100 projects its gap to sharding was the same or larger on 8 agents than locally.
- **The cap starts to cost sharding when one project holds more than `maxShards ÷ P` of the work.** The slow runs reach the sharded floor (`work ÷ longest`) at P ≈ 15 / 24 / 47. Raising `maxShards` with P moves that floor down without paying per-spec startup on the fast projects.

### 8.3 When to use each setup

| Setup | Use when | Evidence |
|---|---|---|
| **default** | Many projects of similar size, and no single project is longer than about `total work ÷ P`. Lowest CPU and fewest tasks | Ties sharded at 50–100 quick projects (+1%) with 10–11% tail |
| **sharded** (start here) | Any project is long compared with `work ÷ P`, or the runner has expensive startup (Cypress, about 2.7 s). Choose a target of at least about 10× the startup; set `maxShards` ≥ the parallelism you will have (agents × tasks per agent) | Fastest or within 1% in all 9 local all-runner configurations and fastest in 8 of 9 agent configurations. The 30 s target beat the 10 s target at 50–100 quick projects |
| **atomized** | Cheap-startup runners (Vitest, about 0.2 s; Playwright with a shared server, about 0.7 s) where parallelism is idle: small task counts or short runs. Or parallelism far above `maxShards`, with slow work concentrated in one or two projects | Wins only Playwright and Vitest at 12 quick projects and Vitest at 12 slow projects. Loses everywhere with Cypress CT |

## 9. Caveats and data quality

### 9.1 One run per configuration: noise estimates

| Source | What repeats | Spread |
|---|---|---|
| `results/raw` (older matrix, 44 groups with 2–3 reps) | Same configuration, same machine | Range ÷ mean: median 0.8%, p90 4.2%. All-runner P=8 groups: 3.6% (default), 8.1% (sharded), 8.9% (atomized). One outlier: atomized Vitest P=8, 41% (40.9 / 41.4 / 60.5 s) |
| `results/quick-validate` vs `results/quick` (12 projects, Playwright) | Same workspace and configuration | default 14.6 vs 14.5 s (0.9%), sharded 8.73 vs 8.71 s (0.2%), atomized 6.03 vs 5.76 s (4.6%) |
| `size-sweep-large` vs `quick-50` (same density, but per-task e2e servers) | Near-repeat | default +3.4%, sharded −1.6%, atomized +0.9% |
| Runner-only vs all-runner runs, same setup | Per-runner work | CT within −5% to +4%. Vitest up to −14% (it shares the machine with CT in the all-runner run) |
| Nx Agents: default-12 at 3 / 5 / 8 agents + the 3 invalid sharded-12 runs (no shards, so the same one-task-per-project work) | Equivalent work | 158.7–213.5 s, mean 179.4 s, CV 10.4% |

**Rule of thumb.** Treat local differences under about 5% (all-runner runs under about 9%) and agent differences under about 15% as noise. That covers the 1% default/sharded ties, Playwright at 12 slow projects (+4%), and the agents' 12 projects / 5 agents result (−7.5%).

### 9.2 Excluded runs (not in `raw/`)

| Run | Why excluded | Wall, and its valid re-run |
|---|---|---|
| `quick-100/contaminated/…125637Z_baseline_full_all_p8_r1` | Background load: other cores 4.16; min MemAvailable 5.9 GB | 376.6 s vs 351.2 s (+7.2%) |
| `quick-100/contaminated/…132738Z_baseline_full_unit_p8_r1` | Other cores 2.89 | 72.8 s vs 71.9 s (+1.3%) |
| `quick-100/contaminated/…132858Z_atomized_full_unit_p8_r1` | Idle-before 12.12 cores; other 4.92 | 94.1 s vs 87.3 s (+7.8%) |
| `quick-100/contaminated/…133041Z_baseline_full_all_p16_r1` | Other cores 3.28; min MemAvailable 2.9 GB | 280.5 s vs 267.3 s (+4.9%) |
| `quick-100/flaky/…130302Z_atomized_full_all_p8_r1` | 1 task failed, 1 not run ("Timed out waiting for the browser to connect") | 612.1 s vs 594.3 s |
| `slow/aborted/…063101Z_baseline_full_all_p8_r1` | Aborted first attempt; no `summary.json` | re-run 507.2 s |
| `slow-50/flaky/…082815Z_sharded_full_ct_p8_r1_target10` | 1 failed, 1 not run (browser connect timeout) | 379.0 s vs 399.4 s (re-run 5 h later) |
| `slow-100/flaky/…083652Z_baseline_full_all_p8_r1` | 20 failed tasks (browser connect timeouts) | 1067.5 s vs 1414.0 s |
| `slow-100/flaky/…085447Z_atomized_full_all_p8_r1` | Aborted with `ERR_INSUFFICIENT_RESOURCES`; no `summary.json` | re-run 1170.3 s |
| Agents `results-invalid/sharded-12-{3,5,8}.json` | The plugin used its 90 s default target and made no shards: `sharded12-5.log` has 0 distinct `…-ci--<x>` sub-task ids, against 28 in the re-run `sharded12-5b.log`. The current workspaces set `targetShardSeconds: 10` | 213.5 / 177.6 / 173.4 s vs re-runs 113.4 / 114.4 / 67.1 s |

### 9.3 Background CPU in valid runs

"Other" cores = `(cpuSecondsSystem − cpuSecondsAttributed) ÷ wall`. It includes the sampler (about 0.15 cores) and short-lived processes the sampler misses, so it rises with task count.

| Set | default: min / median / max | sharded | atomized |
|---|---|---|---|
| quick, P=8 | 0.56 / 0.99 / 1.92 | 0.71 / 1.35 / 1.95 | 1.20 / 2.40 / 2.68 |
| quick, P=16 | 0.80 / 1.38 / 1.56 | 2.04 / 2.58 / 2.91 | 4.12 / 4.92 / 4.94 |
| slow, P=8 | 0.56 / 0.91 / 2.40 | 0.88 / 1.45 / 3.88 | 1.33 / 1.88 / 3.40 |

Valid runs above their variant's normal level, and what that means for the conclusions:

| Run | Signal | Effect |
|---|---|---|
| slow-12 sharded CT | other 2.73; min MemAvailable 5.7 GB (lowest of all valid runs) | Penalises the winner; the conclusion holds |
| slow-12 sharded Playwright | other 3.88 (highest); idle-before 1.52 | That comparison is a tie anyway |
| slow-12 atomized all | idle-before 2.28 | Atomized still loses by 23% |
| slow-50 default all | idle-before 1.92, other 1.83, min MemAvailable 6.7 GB | None: default loses by 2.5× |
| slow-50 sharded CT (re-run) | idle-before 2.55, other 3.16 | Penalises the winner; wins by 23% |
| slow-100 sharded all | idle-before 1.97, other 2.22 | Penalises the winner; wins by 21% |
| slow-100 default Vitest, atomized Playwright, atomized Vitest | other 2.40, 3.40, 2.91 | Not enough to flip a 14–19% gap |
| quick-50/100 default Playwright and Vitest | other 1.62–1.92 | Short runs, where a fixed background is a bigger share; no ranking changes |

At slow-100, `idleSysCoresBefore` was 1.6–2.0 cores in 7 of 12 runs (quick: 0.14–0.76). That is mild background load touching all three setups.

### 9.4 Memory and machine state differ between slow sizes

| Set | MemAvailable at start (GB) | Lowest MemAvailable during a run (GB) | Run times (UTC) |
|---|---|---|---|
| quick 12 / 50 / 100 | 24.4–26.2 / 21.4–26.7 / 20.5–23.5 | 11.7 / 10.3 / 6.4 (P=16 runs) | 2026-10-10 11:43–14:30 |
| slow 12 | 11.3–20.7 | 5.7 | 2026-10-12 06:33–07:11 |
| slow 50 | 19.9–21.1 (re-run: 30.8) | 6.7 | 07:11–08:35 (re-run 13:21) |
| slow 100 | 29.6–34.5 | 21.9 | 13:28–15:34 |

- Slow-12 atomized Playwright started with 11.3 GB, below the matrix's 12 GB gate. `slow.log` also shows the matrix waiting for the gate at 11.1 GB before the next run.
- The browser-connect timeouts (section 9.2) all happened in the low-memory window.
- Slow-100 ran with about 10 GB more free memory than slow-12 and slow-50. Comparisons are made within a size, so this does not bias a setup. Absolute walls across slow sizes are slightly less comparable.

### 9.5 `peakPssMb` sampler artefacts

Between PSS reads, the sampler estimates PSS as RSS × the last PSS/RSS ratio. A ratio taken while a process is starting can be wildly off, which gives PSS above RSS (impossible). Most runs have at least one process whose recorded peak PSS exceeds its peak RSS. 18 of 87 valid runs have a run-level peak PSS more than 10% above the run's PSS p99, or a tick where summed PSS > summed RSS. The worst cases:

| Run | Peak PSS (GB) | PSS p99 (GB) | Peak RSS (GB) | Culprit process (PSS / RSS MB) |
|---|--:|--:|--:|---|
| slow-100 default CT | 25.6 (t = 3.0 s) | 7.7 | 13.4 | `node` of `ct-invoice-0015:component-test`, 20677 / 450 |
| slow-100 sharded CT | 12.3 (t = 422.5 s) | 8.3 | 13.7 | `chrome` of `ct-ticket-0029` shard 3/8, 2993 / 50 |
| quick-100 atomized P=16 | 16.4 | 12.8 | 25.9 | `chrome` of a `ct-ticket-0042` atom, 6006 / 45 |
| quick-50 atomized P=16 | 16.1 | 12.7 | 25.3 | `node` of a `ct-booking-0012` atom, 4636 / 415 |
| slow-50 sharded all | 10.1 | 8.3 | 13.8 | `node` of `ct-patient-0009` shard 4/7, 4389 / 446 |
| quick-50 atomized CT | 8.8 | 6.9 | 12.5 | `chrome` of a `ct-booking-0032` atom, 4494 / 32 |

Use PSS p99 rather than peak PSS. Peak PSS does not affect any timing result.

### 9.6 Other caveats

- **Cypress CT atoms were forced to `parallelism: true`.** Stock Nx 23.3 marks `@nx/cypress` CT atoms `parallelism: false`, so they would run one at a time. The atomized CT numbers here are therefore atomization's best case. Atomized runs also need `NX_SKIP_ATOMIZER_VALIDATION=true` without Nx Cloud.
- **Task durations include contention.** Startup and work rise with P (section 3.5, section 8.2), so per-task numbers from P=8 do not carry over unchanged to other parallelism levels.
- **Cold task history means Nx orders tasks roughly in graph order.** This made the split setups run app builds and e2e last (section 3.3), and default start its largest slow project at 363 s (slow-100).
- **Raw field quirks.**
  - `summary.json` `tasks.realCount` and utilisation, and the "OK …" lines in `slow.log`, still count the continuous `serve-static` tasks. That is why `slow.log` shows 116–174% utilisation. This report uses `loadSummary()`, which removes them.
  - `aggregate.md`'s startup tax counts the `wait-for-webserver` gate as an e2e unit. This report excludes it, so e2e values differ by up to about 0.03 s.
- **Two data sources disagree on coverage, not on values.**
  - `results/agents/agents-real.json` holds only 21 of the 27 quick-specs agent runs. It lacks `atomized-100-{3,5,8}`, `sharded-100-{5,8}` and `sharded-12-8`, because it was written before those runs. Its 21 values match `results/agents/results/*.json`.
  - The blog's `data/agents.json` holds all 27, and they match.
- **The Nx Agents runs used the quick workspaces.** There is no slow-projects run on agents.
- **Agents were not measured per task.** There is no per-task startup or CPU data for CI.

## 10. How the numbers were computed

- **Local runs.** Each `results/{quick,slow}{,-50,-100}/raw/*/summary.json` was loaded with `bench/lib/results.mjs` `loadSummary()`, which marks continuous tasks as noops.
  - Real tasks = `taskList` entries with `isNoop` false. Their `start`/`end`/`duration` come from `NX_PROFILE`.
  - Work = Σ durations; idle tail = `timing.wallMs ÷ 1000 − work ÷ P`.
  - "Fewer than 8 running at the end" comes from a sweep over task start/end events: the time from the last drop below P concurrent tasks to the last task end.
  - Longest task = max real task duration. CPU = `resources.cpuSecondsAttributed` and `cpuSecondsSystem`; "other" cores as in section 9.3.
- **Startup per task.**
  - Per project: `(Σ atom or shard durations − the default run's whole-project task duration) ÷ (n − 1)`, from the same runner group (runner-only vs runner-only, all vs all). Wait-for-webserver gates excluded; median and IQR across projects.
  - Marginal: `(atomized work − sharded work) ÷ (atomized tasks − sharded tasks)` per runner kind.
- **PSS.** From `samples.json.gz` (`loadSamples`): per-tick summed PSS/RSS and per-process peaks.
- **Noise.** Wall range and CV per repeated group in `results/raw`, plus the paired runs listed in section 9.1.
- **Agents.** Each `results/agents/results/*.json` gives `startToReadyS` (boot), `testsS` and `totalS`; agent-minutes = `agents × totalS ÷ 60`. Results were cross-checked against `agents-real.json` and the blog's `agents.json`. Shard counts in the CI logs were found by grepping distinct `…-ci--<x>` task ids.
- **Scripts.** All of the above ran as read-only node/python scripts in the session scratchpad (`/tmp/claude-1000/-home-edouard/133d6e66-0da6-4ba1-9474-5cdd6dc9f70e/scratchpad/report/`: `analyse.mjs`, `tables.mjs`, `md.mjs`, `startup.mjs`, `model.mjs`, `projects.mjs`, `pss2.mjs`, `noise.mjs`, `agents.py`). That directory is temporary.

## 11. Data index

Paths are relative to the repository root. Nx Agents data is in `results/agents/`, its scripts in `bench/agents/`.

| Table | Backing files |
|---|---|
| 1, 3.1–3.5 (quick) | `results/quick/raw/*/summary.json`, `results/quick-50/raw/…`, `results/quick-100/raw/…` (51 runs); task timings from each run's `profile.json` via `summary.json` `taskList` |
| 2 (workspace shapes) | `results/slow*/plan.txt`; plan lines in `results/quick.log`, `quick-50.log`, `quick-100.log`; `generator/size.mjs` (`SPEC_SECONDS`, `SLOW_SPEC_SECONDS`, `SLOW_SHARE`) |
| 4.1–4.5 (slow) | `results/slow/raw/`, `results/slow-50/raw/`, `results/slow-100/raw/` (36 runs); `results/slow.log`; comparison with `results/slow-report.md` |
| 5.1–5.3 (Nx Agents) | `results/agents/results/*.json` (27 runs); `results/agents/agents-real.json` (21 runs); `results/agents/nx-runs.json` (Nx Cloud run ids); `~/work/edbzn.dev.worktrees/nx-atomization-vs-sharding/content/blog/nx-atomization-vs-sharding/data/agents.json`; setup in `bench/agents/{workflow.yml,agents.yaml,patch.py,prepare.sh,run-matrix.sh}`, `results/agents/logs/{matrix.log,matrix-lane2.log}` |
| 6 (earlier studies) | `results/scale/report.md`, `results/scale/raw/n1500/*/run-r1.json`; `results/size-sweep/report.md`, `sweep-runs.jsonl`; `results/closeup/aggregate.md`; `results/aggregate.md` |
| 9.1 (noise) | `results/raw/` (older matrix), `results/quick-validate/`, `results/size-sweep-large/raw/*-50_*`, `results/agents/results-invalid/` |
| 9.2 (excluded runs) | `results/quick-100/{contaminated,flaky}/`, `results/slow/aborted/`, `results/slow-50/flaky/`, `results/slow-100/flaky/` (`summary.json`, `nx.log`); `results/agents/results-invalid/`, `results/agents/logs/sharded12-5.log`, `sharded12-5b.log` |
| 9.3–9.4 (background, memory) | `summary.json` `resources.*` and `config.host.memAvailableAtStartMb`; `results/slow.log` |
| 9.5 (PSS) | each run's `samples.json.gz` |
| Shard plugin, parallelism override | `shard-plugin/src/core.ts` (`DEFAULT_TARGET_SHARD_SECONDS = 90`, `DEFAULT_MAX_SHARDS = 8`); `generator/templates/root.mjs` (`parallelism: true`); `workspaces/size-slow/atomized-12/nx.json` |
