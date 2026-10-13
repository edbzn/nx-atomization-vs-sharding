# Slow projects: does atomization win when some tests are slow?

Short answer: **no, not at `--parallel=8` on one machine, at any measured size.**
- Slow projects make splitting essential. Default is 1.5x (100 projects) to 3x (12) slower than sharding.
- Sharding still beats atomization on all runners: by 23% at 12 projects, 33% at 50 and 21% at 100.
- The 8-shard cap set how many shards each slow project got, but never the wall time. The sharded runs were limited by total work, not by their longest shard.
- Atomization pays about 2.4 to 3.2 s of startup for each extra Cypress task, and that cost accounts for the whole gap.
- Atomization would only pull ahead with far more parallelism than 8: about 18 at 12 projects, 33 at 50 and 58 at 100 (back-of-envelope estimate below). The bigger the workspace, the smaller each slow project's share of the work, and the further away that break-even moves.

All numbers come from `summary.json` / `profile.json`. They were loaded through `bench/lib/results.mjs` `loadSummary`, which drops the continuous `serve-static` tasks the same way `aggregate.md` does. One run per configuration, `--parallel=8`, scenario `full`, sharded = `target10`.

## 1. Setup

What changed versus the quick experiment (`bench/quick.sh`): the generator, seed, project graph and spec counts are the same (229 / 887 / 1674 specs at 12 / 50 / 100 projects). `SIZE_SLOW=0.2` gives a fifth of each runner's projects (at least one) slow specs:

| Runner | quick spec time | slow spec time |
|---|---|---|
| Cypress CT, Playwright | median 0.95 s (0.5 to 2 s) | median 15 s (5 to 60 s) |
| Vitest | median 0.22 s (0.1 to 0.5 s) | median 3 s (1 to 8 s) |

Total spec seconds from the `generator/size.mjs` model:

| Projects | Slow projects (CT / Vitest / Playwright) | quick | slow | Share of slow work held by the slow projects | Biggest slow project's share of sharded task time |
|---|---|--:|--:|--:|--:|
| 12 | 3 (1 / 1 / 1) | 152.8 s | 923.9 s | 822.4 s = 89% | 44% (ct-invoice-0002) |
| 50 | 9 (4 / 4 / 1) | 622.9 s | 2939.8 s | 2465.5 s = 84% | 31% (ct-booking-0012) |
| 100 | 18 (8 / 8 / 2) | 1118.5 s | 5697.8 s | 4876.8 s = 86% | 14% (ct-product-0026) |

Slow projects. Shards are the shard plugin's count at a 10 s target, from the byte estimate (0.7 s/KB for CT, 0.095 for Vitest, 0.14 for Playwright), then capped at `maxShards` = 8 and by the spec count. **Bold** = the cap reduced the count.

| Projects | Project | Runner | Specs | Spec seconds | Max spec | Shards wanted → got |
|---|---|---|--:|--:|--:|---|
| 12 | ct-invoice-0002 | Cypress | 29 | 473.2 | 39.6 | 29 → **8** |
| 12 | unit-asset-0003 | Vitest | 49 | 162.3 | 8.0 | 20 → **8** |
| 12 | academy-0000-e2e (the only e2e project) | Playwright | 10 | 186.9 | 43.2 | 10 → **8** |
| 50 | ct-booking-0012 | Cypress | 60 | 1112.3 | 60.0 | 60 → **8** |
| 50 | ct-invoice-0039 | Cypress | 33 | 512.4 | 40.6 | 33 → **8** |
| 50 | ct-shipment-0006 | Cypress | 16 | 248.2 | 41.8 | 16 → **8** |
| 50 | ct-ticket-0024 | Cypress | 10 | 160.1 | 40.9 | 10 → **8** |
| 50 | academy-0000-e2e | Playwright | 11 | 210.1 | 43.2 | 11 → **8** |
| 50 | unit-employee-0011 / unit-recipe-0026 | Vitest | 19 / 20 | 65.3 / 68.9 | 6.3 / 6.3 | 9 → **8** each |
| 50 | unit-contract-0033 / unit-contract-0007 | Vitest | 14 / 10 | 52.5 / 35.8 | 8.0 / 8.0 | 8 → 8, 5 → 5 |
| 100 | ct-product-0026 | Cypress | 56 | 969.7 | 40.8 | 56 → **8** |
| 100 | ct-booking-0012 | Cypress | 35 | 650.9 | 44.3 | 35 → **8** |
| 100 | ct-ticket-0029 | Cypress | 38 | 624.3 | 43.8 | 38 → **8** |
| 100 | ct-ticket-0052 | Cypress | 33 | 579.6 | 30.7 | 33 → **8** |
| 100 | ct-booking-0038 / ct-shipment-0079 / ct-invoice-0015 | Cypress | 21 / 20 / 19 | 370.4 / 367.2 / 351.3 | 51.1 / 37.6 / 36.2 | 21 / 20 / 19 → **8** |
| 100 | ct-product-0076 | Cypress | 9 | 140.5 | 26.3 | 9 → **8** |
| 100 | shop-0008-e2e / homes-0004-e2e | Playwright | 28 / 6 | 413.0 / 97.6 | 35.9 / 27.0 | 28 → **8**, 6 → 6 |
| 100 | unit-contract-0018 | Vitest | 19 | 73.9 | 8.0 | 11 → **8** |
| 100 | 7 other Vitest (unit-contract-0075, unit-asset-0071/0023/0051, unit-employee-0049, unit-recipe-0032/0019) | Vitest | 6 to 14 | 17.0 to 51.4 | ≤ 8 | 3 to 7, not capped |

The cap set the shard count for 3 of 3 slow projects at 12, 7 of 9 at 50 and 10 of 18 at 100. For the slow Cypress and Playwright projects, the 10 s target is below the 15 s median spec. Without the cap, sharding would have produced one shard per spec, which is the same as atomization.

## 2. Wall time

Wall time = `exitAt − spawnAt`, in seconds. % is against default. Winner is the fastest setup.

| Projects | Runner | default | sharded | atomized | Winner | atomized vs sharded |
|---|---|--:|--:|--:|---|--:|
| 12 | all | 507.2 | **171.4** (−66.2%) | 211.3 (−58.3%) | sharded | +23.3% |
| 12 | ct | 506.1 | **107.3** (−78.8%) | 124.8 (−75.3%) | sharded | +16.3% |
| 12 | e2e | 209.8 | **56.2** (−73.2%) | 58.5 (−72.1%) | tie (sharded by 2.3 s) | +4.1% |
| 12 | unit | 166.0 | 43.2 (−74.0%) | **32.7** (−80.3%) | atomized | −24.3% |
| 50 | all | 1241.0 | **489.9** (−60.5%) | 650.6 (−47.6%) | sharded | +32.8% |
| 50 | ct | 1195.0 | **399.4** (−66.6%) | 489.7 (−59.0%) | sharded | +22.6% |
| 50 | e2e | 224.1 | **55.2** (−75.4%) | 72.2 (−67.8%) | sharded | +30.8% |
| 50 | unit | 96.7 | **64.1** (−33.7%) | 68.7 (−29.0%) | sharded | +7.2% |
| 100 | all | 1414.0 | **966.4** (−31.7%) | 1170.3 (−17.2%) | sharded | +21.1% |
| 100 | ct | 1310.0 | **762.6** (−41.8%) | 953.3 (−27.2%) | sharded | +25.0% |
| 100 | e2e | 421.1 | **95.7** (−77.3%) | 109.5 (−74.0%) | sharded | +14.4% |
| 100 | unit | 131.2 | **110.0** (−16.2%) | 130.7 (−0.4%) | sharded | +18.8% |

**Quick versus slow, same configurations** (wall s; % against default)

| Projects | Runner | quick default / sharded / atomized | quick winner | slow default / sharded / atomized | slow winner |
|---|---|---|---|---|---|
| 12 | all | 102.0 / 53.6 (−47.5%) / 86.9 (−14.8%) | sharded | 507.2 / 171.4 (−66.2%) / 211.3 (−58.3%) | sharded |
| 12 | ct | 95.8 / 47.1 (−50.8%) / 69.6 (−27.3%) | sharded | 506.1 / 107.3 (−78.8%) / 124.8 (−75.3%) | sharded |
| 12 | e2e | 14.5 / 8.7 (−40.0%) / 5.8 (−60.0%) | atomized | 209.8 / 56.2 (−73.2%) / 58.5 (−72.1%) | tie |
| 12 | unit | 27.9 / 18.4 (−34.1%) / 13.2 (−52.7%) | atomized | 166.0 / 43.2 (−74.0%) / 32.7 (−80.3%) | atomized |
| 50 | all | 196.3 / 198.5 (+1.1%) / 323.8 (+65.0%) | default ≈ sharded | 1241.0 / 489.9 (−60.5%) / 650.6 (−47.6%) | sharded |
| 50 | ct | 147.7 / 149.4 (+1.2%) / 257.1 (+74.1%) | default ≈ sharded | 1195.0 / 399.4 (−66.6%) / 489.7 (−59.0%) | sharded |
| 50 | e2e | 53.7 / 20.9 (−61.1%) / 28.5 (−46.9%) | sharded | 224.1 / 55.2 (−75.4%) / 72.2 (−67.8%) | sharded |
| 50 | unit | 44.4 / 36.3 (−18.2%) / 42.1 (−5.2%) | sharded | 96.7 / 64.1 (−33.7%) / 68.7 (−29.0%) | sharded |
| 100 | all | 351.2 / 353.3 (+0.6%) / 594.3 (+69.2%) | default ≈ sharded | 1414.0 / 966.4 (−31.7%) / 1170.3 (−17.2%) | sharded |
| 100 | ct | 280.3 / 257.9 (−8.0%) / 460.5 (+64.3%) | sharded | 1310.0 / 762.6 (−41.8%) / 953.3 (−27.2%) | sharded |
| 100 | e2e | 40.8 / 32.9 (−19.4%) / 44.5 (+9.1%) | sharded | 421.1 / 95.7 (−77.3%) / 109.5 (−74.0%) | sharded |
| 100 | unit | 71.9 / 73.1 (+1.7%) / 87.3 (+21.4%) | default ≈ sharded | 131.2 / 110.0 (−16.2%) / 130.7 (−0.4%) | sharded |

How slow projects change the picture:
- **Default collapses.** A slow project becomes one huge task: ct-booking-0012 took 1203 s of a 1241 s run at 50 projects, and ct-product-0026 took 1051 s at 100. Against default, atomization goes from 65–69% slower (quick, 50 and 100 projects) to 17–48% faster.
- **The gap between atomized and sharded shrinks but stays.** On all runners, atomized was 62% / 63% / 68% slower than sharded at 12 / 50 / 100 projects in the quick experiment. With slow projects it is 23% / 33% / 21% slower.
- The only atomized win left is Vitest at 12 projects. The win comes from finer packing of a short run, not from the slow specs (see section 3).

## 3. Why: all-runners runs

Tasks = real tasks: noop parents and the continuous `serve-static` are excluded; app builds and `wait-for-webserver` are included. Ideal = total task time ÷ 8. "Fewer than 8 at the end" is measured from `profile.json` (`ph: 'X'` events): the time from the last moment 8 tasks were running to the end of the last task.

| Projects | Setup | Wall (s) | Tasks | Total task time (s) | Parallelism utilisation | Ideal (s) | Idle tail = wall − ideal (s) | Fewer than 8 at the end (s) | Longest task = Nx critical path (s) | Avg cores busy |
|---|---|--:|--:|--:|--:|--:|--:|---|--:|--:|
| 12 | default | 507.2 | 13 | 1126.2 | 27.8% | 140.8 | 366.4 | 481.7 (from 25.4 s) | 506.5 | 1.46 |
| 12 | sharded | **171.4** | 44 | 1192.7 | 87.6% | 149.1 | 22.3 | 37.9 (from 133.2 s) | 81.6 | 5.01 |
| 12 | atomized | 211.3 | 231 | 1435.0 | 85.3% | 179.4 | 31.9 | 47.4 (from 163.5 s) | 53.9 | 5.54 |
| 50 | default | 1241.0 | 55 | 3844.4 | 38.7% | 480.5 | 760.5 | 985.8 (from 255.2 s) | 1203.1 | 2.34 |
| 50 | sharded | **489.9** | 163 | 3872.0 | 99.1% | 484.0 | 5.9 | 8.1 (from 481.4 s) | 159.1 | 5.80 |
| 50 | atomized | 650.6 | 897 | 5108.0 | 98.4% | 638.5 | 12.1 | 12.1 (from 638.1 s) | 66.2 | 7.22 |
| 100 | default | 1414.0 | 110 | 7168.2 | 63.4% | 896.0 | 517.9 | 755.1 (from 658.8 s) | 1050.7 | 3.54 |
| 100 | sharded | **966.4** | 285 | 7681.2 | 99.5% | 960.1 | 6.3 | 7.5 (from 958.6 s) | 162.4 | 6.33 |
| 100 | atomized | 1170.3 | 1694 | 9305.2 | 99.6% | 1163.1 | 7.1 | 3.9 (from 1166.0 s) | 59.8 | 6.77 |

**Slowest projects per setup** (task seconds; one task per project for default). The biggest shard is the critical path of each sharded run.

| Projects | Project | default task | sharded: shards / sum / biggest (ends at) | atomized: atoms / sum / biggest |
|---|---|--:|---|---|
| 12 | ct-invoice-0002 | 506.5 | 8 / 525.0 / **81.6** (106 s of 171) | 29 / 571.1 / 44.0 |
| 12 | academy-0000-e2e | 210.5 | 8 / 216.5 / 53.8 | 10 / 217.6 / **53.7** (critical path) |
| 50 | ct-booking-0012 | 1203.1 | 8 / 1205.6 / **159.1** (282 s of 490) | 60 / 1365.5 / **66.2** |
| 50 | ct-invoice-0039 | 570.0 | 8 / 575.4 / 85.7 | 33 / 653.0 / 45.9 |
| 100 | ct-product-0026 | 1050.7 (started at 363 s) | 8 / 1100.5 / **162.4** (798 s of 966) | 56 / 1200.7 / 49.1 |
| 100 | ct-booking-0012 | 702.3 | 8 / 731.3 / 112.5 | 35 / 774.0 / 50.1 |
| 100 | ct-booking-0038 | 412.1 | 8 / 428.3 / 59.7 | 21 / 457.4 / **59.8** (critical path) |

What this shows:
- **Atomization does shorten the critical path**: 82 → 54 s (12 projects), 159 → 66 s (50), 162 → 60 s (100). But at 8-way parallelism the critical path wasn't the limit. Both split setups had a parallelism utilisation of 98 to 100% at 50 and 100 projects, and 85 to 88% at 12. The wall time follows total task time ÷ 8, and atomization has 20 to 32% more total task time.
- **The cap capped the shard count but never the wall time.** The biggest shard always ended well before the run did. With parallelism equal to `maxShards`, one project's biggest shard is about that project's work ÷ 8, which can't exceed the whole run's work ÷ 8. With 8 parallelism on one machine, the cap can only hurt through scheduling order, and here it didn't.
- **The idle tail is small for both splits from 50 projects up**: 4 to 12 s.
  - At 12 projects, both runs end on the slow Playwright project. Nx scheduled the app build late, at 83 s (sharded) and 110 s (atomized), so the e2e work ran last and finished on one spec of about 54 s that neither setup can split further.
  - Default at 100 is relatively less bad (−32% for sharded, against −61% at 50) because its biggest project is a smaller share of the work. It still loses because Nx started that 1051 s project only at 363 s.
- **The Vitest-only win at 12** is a packing effect. Unit work is only about 30 s ÷ 8, and sharding has a 28.6 s shard plus a 20 s delegated project. That leaves 18.1 s with fewer than 8 tasks at the end, against 0.6 s for atomized. At 50 and 100 projects there is enough work for the shards to pack well, and sharding wins (by 7% and 19%).

**Startup overhead of atomization against sharding** (all-runners runs)

| | 12 projects | 50 projects | 100 projects |
|---|--:|--:|--:|
| Extra tasks (CT / Vitest / Playwright) | 87 / 98 / 2 | 324 / 321 / 89 | 581 / 685 / 143 |
| Startup per task against default, from `aggregate.md` (CT / e2e / unit) | 2.7 / 0.73 / 0.21 s | 2.9 / 0.71 / 0.24 s | 2.6 / 0.84 / 0.22 s |
| Estimate: extra tasks × startup | 257.2 s → 32.2 s of wall | 1078.6 s → 134.8 s of wall | 1777.4 s → 222.2 s of wall |
| Measured extra total task time (atomized − sharded) | +242.3 s (+20%) → 30.3 s | +1236.0 s (+32%) → 154.5 s | +1624.0 s (+21%) → 203.0 s |
| Measured cost per extra task (CT / unit / e2e) | 2.58 / 0.17 / 0.55 s | 3.20 / 0.35 / 0.99 s | 2.38 / 0.16 / 0.90 s |
| Measured wall gap | +39.9 s | +160.7 s | +203.9 s |

The extra startup explains the whole wall gap at each size (wall at 8 = extra task time ÷ 8). The cost per task is about the same as in the quick experiment, where atomized minus sharded task time was +1031.4 s at 50 projects and +1919.1 s at 100. Slow specs only make it a smaller share of the work: +67% and +69% of task time in quick, against +32% and +21% here.

`report/startup-tax.json` uses the runner-only runs and so lists slightly different values for CT / e2e / unit: 2.76 / 0.73 / 0.28 s (12), 2.55 / 0.66 / 0.23 s (50), 2.48 / 0.75 / 0.27 s (100).

## 4. Verdict on the hypothesis

"Atomization shines when some tests take much longer, because sharding caps a huge project at 8 shards": **not supported at `--parallel=8` on one machine, at 12, 50 or 100 projects.**

| Where | Result |
|---|---|
| Against default | Atomization wins: −58% (12), −48% (50), −17% (100) on all runners. In the quick experiment it lost by 65–69% at 50 and 100 projects. |
| Against sharded, all runners | Atomization loses: +23% (+39.9 s), +33% (+160.7 s), +21% (+203.9 s) |
| Against sharded, per runner | Loses on CT (+16%, +23%, +25%), e2e (+4% tie, +31%, +14%) and unit at 50 and 100 (+7%, +19%). Wins only on unit at 12 (−24%, about 10 s). |

**When atomization would win (back-of-envelope estimate, not measured).** Model: wall ≈ max(total task time ÷ P, longest task), with the measured task times from the all-runners runs. This assumes task durations don't grow with P and ignores dependency order.

| Projects | Sharded | Atomized | Atomized faster from | Sharded vs atomized (s) at P = 24 / 32 / 48 / 64 |
|---|---|---|---|---|
| 12 | max(1192.7/P, 81.6) | max(1435.0/P, 53.9) | P ≥ 18 | 81.6 vs 59.8 (−27%) / 81.6 vs 53.9 / 81.6 vs 53.9 / 81.6 vs 53.9 (−34%) |
| 50 | max(3872.0/P, 159.1) | max(5108.0/P, 66.2) | P ≥ 33 | 161.3 vs 212.8 / 159.1 vs 159.6 (tie) / 159.1 vs 106.4 (−33%) / 159.1 vs 79.8 (−50%) |
| 100 | max(7681.2/P, 162.4) | max(9305.2/P, 59.8) | P ≥ 58 | 320.1 vs 387.7 / 240.0 vs 290.8 / 162.4 vs 193.9 / 162.4 vs 145.4 (−10%) |

Rule of thumb from this model: the cap starts to cost wall time when one project holds more than `maxShards` ÷ P of the total work. The biggest slow project holds 44% / 31% / 14% of the sharded task time, so the cap binds above P ≈ 18 / 26 / 56. Atomization then needs a bit more parallelism again to repay its startup cost.

- **More parallelism than the shard cap**, in practice several CI agents. At P=8, the atomized all-runners runs already used 5.5 to 7.2 cores and 8.3 to 8.6 GB PSS. P=32 would need about 22 to 29 cores and more than 30 GB, beyond this 16-core machine (estimate). So this is a distributed-execution scenario.
- **Slow work concentrated in one project, not bigger workspaces.** With a fixed 20% slow share, a bigger workspace spreads the slow work over more projects. The break-even then moves out (18 → 33 → 58) even as total work grows.
- **Sharding has a simpler fix.** Scaling `maxShards` with P (for example `maxShards` ≥ P) would bring the sharded floor down toward the longest spec plus startup, which is the same floor as atomization, while keeping the grouped startup savings on the fast projects. Atomization's structural edge appears only when P > `maxShards`.

## 5. Caveats

- **One run per configuration.** Gaps under about 5% (e2e at 12: 2.3 s) are within noise. The 21–33% all-runner gaps are not.
- **The sizes ran in different machine states.**
  - 12 and 50 projects (08:33–10:35 CEST) started with 17–21 GB MemAvailable, against 24–26 GB for the quick runs.
  - Browser crashes began around 10:30. After 20 GB of stale tmpfs was removed, the 100-project runs (from 15:28) and the re-run of sharded CT-only at 50 (15:21) started with 30–35 GB available.
  - That sharded CT-only run at 50 ran 5 hours after the rest of its size. Its result (399.4 s) agrees with the all-runners run: its CT task time is 3149.5 s, against 3051.2 s inside the all-runners sharded run.
- **Invalid runs, excluded:**
  - `slow-50/flaky/…082815Z_sharded_full_ct…` (10:28): a shard failed with "Timed out waiting for the browser to connect".
  - `slow-100/flaky/…083652Z_baseline_full_all…` (20 failed tasks).
  - `slow-100/flaky/…085447Z_atomized_full_all…` (aborted, `ERR_INSUFFICIENT_RESOURCES`).
  - `slow/aborted/` (first attempt at the 12-project default all-runners run).
- **Two valid 50-project runs ran just after the crashes began:** sharded e2e (10:34) and sharded unit (10:35). Their indicators look normal, and sharded e2e matches the 12-project result (55.2 s against 56.2 s, both bound by the same 54 s spec).

**PSS anomaly, default CT-only at 100 projects (25.6 GB): a sampler artefact.**
- Real memory never reached it. The 25.6 GB peak is one tick at t = 3.0 s, and every tick above 8.1 GB falls between t = 2.0 and 3.0 s. The summed RSS at that tick was 10.0 GB, PSS p99 over the run was 7.9 GB, and MemAvailable never dropped below 22.1 GB.
- One process drove it: a `node` process (pid 106895) of task `ct-invoice-0015:component-test`, with recorded peak PSS 20,677 MB against peak RSS 450 MB. PSS can't exceed RSS.
- Likely mechanism: the sampler estimates PSS between reads as RSS × the process's last PSS/RSS ratio (`bench/lib/sampler.mjs`). That ratio was taken while the process was just starting, when its RSS was tiny, so the estimate came out about 46 times too high.
- **No effect on timing.** It is a reporting error at second 2–3 of a 1310 s run, and no memory pressure existed.
- The same artefact explains sharded CT-only at 100 (12.3 GB, one tick at 422.5 s; next highest 8.6 GB; Chrome processes recorded at about 2.5–3.0 GB PSS against 43–50 MB RSS).
- Treat `peakPssMb` as unreliable whenever it exceeds peak RSS. The PSS p99 is about 8 GB for every Cypress run.

Disturbance check on every valid slow run. "Other" cores = (`cpuSecondsSystem` − `cpuSecondsAttributed`) ÷ wall. Atomized runs read 2.0 to 2.7 in the quick experiment too, likely short-lived processes the sampler misses, so that level is normal for atomized.

| Run | Signal | Effect on conclusions |
|---|---|---|
| 12 atomized all | `idleSysCoresBefore` 2.28 | small (about 2 busy cores of 32 threads before the start); atomized still loses by 23% |
| 12 sharded ct | min MemAvailable 5.7 GB (lowest of all runs); other 2.73 cores (sharded is normally 0.9 to 1.7) | if anything, sharded was penalised; its win holds |
| 12 sharded e2e | other 3.88 cores, the highest of any run; idle before 1.52 | e2e at 12 is a tie anyway |
| 12 atomized e2e | started with 11.3 GB MemAvailable, below the matrix's 12 GB gate | e2e is a tie |
| 50 default all | idle before 1.92, other 1.83, min MemAvailable 6.7 GB | none: default loses by 2.5x |
| 50 sharded ct (re-run) | idle before 2.55 (highest of all runs), other 3.16; ran 5 h later with 30.8 GB free | if anything penalises sharded; it wins by 23% |
| 100 sharded all | idle before 1.97, other 2.22 (above the sharded norm) | if anything penalises sharded; it wins by 21% |
| 100 atomized e2e / unit | other 3.40 / 2.91 (quick-100 atomized: 2.68 / 1.93) | atomized loses e2e by 14% and unit by 19%; a small penalty doesn't flip either |
| 100 default ct / sharded ct | PSS artefact (above) | none |

At 100 projects, `idleSysCoresBefore` is 1.6 to 2.0 cores in 7 of the 12 runs, against 0.1 to 0.8 in the quick runs. That's a mild, even background level that touches all three setups. Other runs show nothing unusual: memory at 100 projects never dropped below 21.9 GB.

**Note on raw numbers.** `summary.json` `slotUtilisation`, `tasks.realCount` and the `slow.log` "OK …" lines still count the continuous `serve-static` tasks. That is why `slow.log` shows 116 to 183% utilisation. Use `aggregate.md` or `loadSummary()`, which this report uses.

## 6. Data index

All paths are under `~/work/nx-atomization-vs-sharding/`.

| What | Where |
|---|---|
| Slow runs (12 valid per size) | `results/slow/raw/`, `results/slow-50/raw/`, `results/slow-100/raw/`; each `<run>/` has `summary.json`, `profile.json`, `samples.json.gz`, `nx.log`, `task-graph.json`, `nx-perf.json` |
| Invalid runs | `results/slow-50/flaky/`, `results/slow-100/flaky/`, `results/slow/aborted/` |
| Aggregates | `results/slow{,-50,-100}/aggregate.{md,json}`, `report/*.json` (`runs`, `startup-tax`, `timelines`, `task-durations`, `resources`) |
| Plans (spec counts, spec seconds, shard counts) | `results/slow{,-50,-100}/plan.txt` |
| Run log | `results/slow.log` |
| Quick comparison | `results/quick/`, `results/quick-50/`, `results/quick-100/` (`raw/` only; ignore `quick-100/contaminated/` and `flaky/`; use only `p8` and `target10`), logs `results/quick*.log` |
| Workload model, slow knob | `generator/size.mjs` (`SIZE_SLOW`, `SLOW_SPEC_SECONDS`, `buildModel`) |
| Shard cap and planning | `shard-plugin/src/core.ts` (`DEFAULT_MAX_SHARDS = 8`, `planShards`); seconds per KB per runner in `cypress-ct.ts`, `vitest.ts`, `playwright.ts` |
| Runner, metric definitions, continuous-task exclusion, PSS estimation | `bench/run.mjs`, `bench/README.md`, `bench/lib/results.mjs` (`excludeContinuousTasks`), `bench/lib/sampler.mjs` |
| Experiment script | `bench/slow.sh` |
