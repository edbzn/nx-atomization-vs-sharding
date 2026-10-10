# Aggregate results

Generated 2026-10-10T14:34:27.149Z from 17 run(s) in `results/quick-100/raw`.

Times are medians over clean reps (min-max for wall). Task stats exclude noop parent tasks. PSS/RSS = peak of the whole Nx process tree. CPU = mean cores busy (attributed to the tree) during the task phase.

| variant | scenario | runner | -P | reps (fail) | wall median (min-max) | pre-task | task phase | crit. path | tasks | sum task time | task mean / med / p95 | slot util | peak PSS GB | peak RSS GB | avg CPU | startup tax |
|---|---|---|--:|--:|---|--:|--:|--:|--:|--:|---|--:|--:|--:|--:|---|
| atomized | full | all | 16 | 1 (0) | 6m57s (6m57s-6m57s) | 1.6s | 6m55s | 11.3s | 1694 | 109m48s | 3.9s / 2.0s / 7.9s | 99% | 16.4 | 25.9 | 19.07 | ct 4.3s, e2e 784ms, unit 312ms |
| atomized | full | all | 8 | 1 (0) | 9m54s (9m54s-9m54s) | 1.5s | 9m52s | 7.6s | 1694 | 78m23s | 2.8s / 1.6s / 5.9s | 99% | 7.8 | 13.6 | 9.17 | ct 2.7s, e2e 624ms, unit 232ms |
| atomized | full | ct | 8 | 1 (0) | 7m40s (7m40s-7m40s) | 1.2s | 7m39s | 7.3s | 733 | 60m53s | 5.0s / 5.0s / 6.1s | 99% | 9.0 | 12.5 | 9.5 | ct 2.6s |
| atomized | full | e2e | 8 | 1 (0) | 44.5s (44.5s-44.5s) | 1.1s | 43.1s | 3.4s | 198 | 5m31s | 1.7s / 1.7s / 2.7s | 96% | 4.9 | 7.5 | 7.2 | e2e 669ms |
| atomized | full | unit | 8 | 1 (0) | 1m27s (1m27s-1m27s) | 1.2s | 1m26s | 1.5s | 763 | 11m19s | 890ms / 864ms / 1.2s | 99% | 2.3 | 3.2 | 8.79 | unit 230ms |
| baseline | full | all | 16 | 1 (0) | 4m27s (4m27s-4m27s) | 875ms | 4m26s | 2m18s | 110 | 52m49s | 28.8s / 20.3s / 1m34s | 74% | 13.4 | 25.7 | 15.14 | - |
| baseline | full | all | 8 | 1 (0) | 5m51s (5m51s-5m51s) | 870ms | 5m50s | 2m09s | 110 | 42m14s | 23.0s / 15.8s / 1m18s | 90% | 7.9 | 14.0 | 7.95 | - |
| baseline | full | ct | 8 | 1 (0) | 4m40s (4m40s-4m40s) | 849ms | 4m39s | 2m09s | 40 | 30m08s | 45.2s / 37.9s / 1m30s | 81% | 8.0 | 13.6 | 7.53 | - |
| baseline | full | e2e | 8 | 1 (0) | 40.8s (40.8s-40.8s) | 888ms | 39.6s | 38.9s | 30 | 3m32s | 7.1s / 733ms / 29.9s | 67% | 4.6 | 8.5 | 3.47 | - |
| baseline | full | unit | 8 | 1 (0) | 1m12s (1m12s-1m12s) | 852ms | 1m11s | 36.8s | 40 | 8m29s | 12.7s / 10.1s / 31.7s | 90% | 2.0 | 2.9 | 7.67 | - |
| sharded (target10) | full | all | 16 | 1 (0) | 3m54s (3m54s-3m54s) | 1.1s | 3m53s | 32.1s | 216 | 60m49s | 16.9s / 19.2s / 26.2s | 98% | 13.7 | 26.7 | 20.18 | - |
| sharded (target10) | full | all | 8 | 1 (0) | 5m53s (5m53s-5m53s) | 1.1s | 5m52s | 22.7s | 216 | 46m24s | 12.9s / 14.4s / 19.6s | 99% | 8.2 | 14.4 | 8.87 | - |
| sharded (target30) | full | all | 8 | 1 (0) | 5m33s (5m33s-5m33s) | 1.0s | 5m31s | 49.9s | 127 | 43m10s | 20.4s / 20.1s / 45.9s | 98% | 9.2 | 14.7 | 8.66 | - |
| sharded (target5) | full | all | 8 | 1 (0) | 6m21s (6m21s-6m21s) | 1.1s | 6m20s | 21.4s | 337 | 50m23s | 9.0s / 9.4s / 14.2s | 99% | 8.2 | 14.6 | 8.99 | - |
| sharded (target10) | full | ct | 8 | 1 (0) | 4m18s (4m18s-4m18s) | 982ms | 4m17s | 21.1s | 127 | 33m40s | 15.9s / 15.9s / 19.5s | 98% | 8.0 | 13.7 | 9.17 | - |
| sharded (target10) | full | e2e | 8 | 1 (0) | 32.9s (32.9s-32.9s) | 973ms | 31.6s | 11.7s | 45 | 3m42s | 4.9s / 5.7s / 11.4s | 88% | 4.5 | 8.5 | 4.83 | - |
| sharded (target10) | full | unit | 8 | 1 (0) | 1m13s (1m13s-1m13s) | 965ms | 1m12s | 21.8s | 44 | 8m31s | 11.6s / 10.7s / 21.1s | 89% | 2.2 | 3.1 | 7.6 | - |

## Startup tax

(sum of unit durations - baseline whole-project duration) / (units - 1), per project; median and IQR across projects.

| variant | scenario | runner | -P | kind | projects | median | p25-p75 |
|---|---|---|--:|---|--:|--:|---|
| atomized | full | all | 16 | ct | 40 | 4.3s | 4.0s-4.5s |
| atomized | full | all | 16 | e2e | 10 | 784ms | 467ms-839ms |
| atomized | full | all | 16 | unit | 40 | 312ms | 228ms-434ms |
| atomized | full | all | 8 | ct | 40 | 2.7s | 2.7s-2.8s |
| atomized | full | all | 8 | e2e | 10 | 624ms | 602ms-655ms |
| atomized | full | all | 8 | unit | 40 | 232ms | 223ms-267ms |
| atomized | full | ct | 8 | ct | 40 | 2.6s | 2.6s-2.7s |
| atomized | full | e2e | 8 | e2e | 10 | 669ms | 635ms-686ms |
| atomized | full | unit | 8 | unit | 40 | 230ms | 225ms-248ms |

Sampler overhead: median 18% of one core, max 21%.
