# Aggregate results

Generated 2026-10-12T15:36:04.592Z from 12 run(s) in `results/slow-100/raw`.

Times are medians over clean reps (min-max for wall). Task stats exclude noop parent tasks. PSS/RSS = peak of the whole Nx process tree. CPU = mean cores busy (attributed to the tree) during the task phase.

| variant | scenario | runner | -P | reps (fail) | wall median (min-max) | pre-task | task phase | crit. path | tasks | sum task time | task mean / med / p95 | slot util | peak PSS GB | peak RSS GB | avg CPU | startup tax |
|---|---|---|--:|--:|---|--:|--:|--:|--:|--:|---|--:|--:|--:|--:|---|
| atomized | full | all | 8 | 1 (0) | 19m30s (19m30s-19m30s) | 1.5s | 19m28s | 59.8s | 1694 | 155m05s | 5.5s / 2.8s / 23.1s | 100% | 8.4 | 14.1 | 6.77 | ct 2.6s, e2e 836ms, unit 215ms |
| atomized | full | ct | 8 | 1 (0) | 15m53s (15m53s-15m53s) | 1.3s | 15m52s | 1m01s | 733 | 125m26s | 10.3s / 5.2s / 31.2s | 99% | 8.0 | 13.1 | 6.78 | ct 2.5s |
| atomized | full | e2e | 8 | 1 (0) | 1m50s (1m50s-1m50s) | 1.2s | 1m48s | 45.5s | 198 | 14m09s | 4.3s / 1.9s / 20.2s | 98% | 4.7 | 8.6 | 5.98 | e2e 750ms |
| atomized | full | unit | 8 | 1 (0) | 2m11s (2m11s-2m11s) | 1.3s | 2m09s | 9.3s | 763 | 17m05s | 1.3s / 935ms / 4.3s | 99% | 3.0 | 3.9 | 7.85 | unit 272ms |
| baseline | full | all | 8 | 1 (0) | 23m34s (23m34s-23m34s) | 951ms | 23m33s | 17m31s | 110 | 119m28s | 1m05s / 20.3s / 6m49s | 63% | 8.0 | 14.2 | 3.54 | - |
| baseline | full | ct | 8 | 1 (0) | 21m50s (21m50s-21m50s) | 966ms | 21m49s | 17m41s | 40 | 96m15s | 2m24s / 41.1s / 11m24s | 55% | 25.6 | 13.4 | 3.28 | - |
| baseline | full | e2e | 8 | 1 (0) | 7m01s (7m01s-7m01s) | 883ms | 6m60s | 6m59s | 30 | 11m38s | 23.3s / 712ms / 1m15s | 21% | 5.0 | 9.0 | 0.94 | - |
| baseline | full | unit | 8 | 1 (0) | 2m11s (2m11s-2m11s) | 921ms | 2m10s | 1m27s | 40 | 13m41s | 20.5s / 13.8s / 49.3s | 79% | 2.6 | 3.5 | 5.78 | - |
| sharded (target10) | full | all | 8 | 1 (0) | 16m06s (16m06s-16m06s) | 1.2s | 16m05s | 2m42s | 285 | 128m01s | 27.0s / 15.4s / 1m32s | 100% | 8.8 | 14.7 | 6.33 | - |
| sharded (target10) | full | ct | 8 | 1 (0) | 12m43s (12m43s-12m43s) | 1.1s | 12m41s | 2m39s | 152 | 99m57s | 39.5s / 18.3s / 1m53s | 98% | 12.3 | 13.7 | 5.94 | - |
| sharded (target10) | full | e2e | 8 | 1 (0) | 1m36s (1m36s-1m36s) | 1.0s | 1m34s | 1m03s | 55 | 11m55s | 13.0s / 6.8s / 57.6s | 95% | 5.2 | 9.1 | 4.56 | - |
| sharded (target10) | full | unit | 8 | 1 (0) | 1m50s (1m50s-1m50s) | 1.0s | 1m49s | 21.4s | 78 | 13m25s | 10.3s / 9.2s / 18.8s | 92% | 3.0 | 3.9 | 6.7 | - |

## Startup tax

(sum of unit durations - baseline whole-project duration) / (units - 1), per project; median and IQR across projects.

| variant | scenario | runner | -P | kind | projects | median | p25-p75 |
|---|---|---|--:|---|--:|--:|---|
| atomized | full | all | 8 | ct | 40 | 2.6s | 2.4s-2.7s |
| atomized | full | all | 8 | e2e | 10 | 836ms | 830ms-880ms |
| atomized | full | all | 8 | unit | 40 | 215ms | 150ms-236ms |
| atomized | full | ct | 8 | ct | 40 | 2.5s | 2.4s-2.8s |
| atomized | full | e2e | 8 | e2e | 10 | 750ms | 728ms-801ms |
| atomized | full | unit | 8 | unit | 40 | 272ms | 242ms-296ms |

Sampler overhead: median 16% of one core, max 18%.
