# Aggregate results

Generated 2026-10-09T20:41:02.157Z from 112 run(s) in `results/raw`.

Times are medians over clean reps (min-max for wall). Task stats exclude noop parent tasks. PSS/RSS = peak of the whole Nx process tree. CPU = mean cores busy (attributed to the tree) during the task phase.

| variant | scenario | runner | -P | reps (fail) | wall median (min-max) | pre-task | task phase | crit. path | tasks | sum task time | task mean / med / p95 | slot util | peak PSS GB | peak RSS GB | avg CPU | startup tax |
|---|---|---|--:|--:|---|--:|--:|--:|--:|--:|---|--:|--:|--:|--:|---|
| atomized | full | all | 16 | 2 (0) | 1m53s (1m53s-1m53s) | 989ms | 1m52s | 25.3s | 320 | 28m00s | 5.3s / 2.8s / 14.1s | 94% | 12.6 | 24.4 | 16.345 | ct 5.9s, e2e 1.4s, unit 558ms |
| atomized | full | all | 4 | 2 (0) | 5m17s (5m15s-5m18s) | 1.0s | 5m16s | 21.1s | 320 | 20m55s | 3.9s / 2.2s / 10.5s | 99% | 4.0 | 6.5 | 3.385 | ct 2.3s, e2e 674ms, unit 234ms |
| atomized | full | all | 8 | 3 (0) | 2m44s (2m40s-2m55s) | 880ms | 2m43s | 21.6s | 320 | 21m05s | 4.0s / 2.3s / 10.8s | 96% | 7.4 | 12.6 | 6.81 | ct 2.7s, e2e 798ms, unit 218ms |
| atomized | full | ct | 16 | 2 (0) | 1m18s (1m17s-1m18s) | 913ms | 1m17s | 23.5s | 84 | 16m59s | 12.1s / 11.1s / 21.3s | 83% | 17.1 | 24.8 | 14.995000000000001 | ct 6.3s |
| atomized | full | ct | 4 | 2 (0) | 3m04s (3m04s-3m04s) | 911ms | 3m03s | 21.0s | 84 | 11m58s | 8.6s / 7.7s / 16.8s | 98% | 4.0 | 6.5 | 3.375 | ct 2.4s |
| atomized | full | ct | 8 | 3 (0) | 1m41s (1m41s-1m42s) | 801ms | 1m40s | 20.7s | 84 | 12m01s | 8.6s / 7.7s / 16.8s | 90% | 7.4 | 12.6 | 6.24 | ct 2.6s |
| atomized | full | e2e | 8 | 3 (0) | 33.4s (33.2s-35.3s) | 803ms | 32.5s | 13.9s | 48 | 3m41s | 4.6s / 3.5s / 9.7s | 85% | 4.5 | 8.3 | 4.87 | e2e 964ms |
| atomized | full | unit | 8 | 3 (0) | 41.4s (40.9s-1m00s) | 841ms | 40.5s | 3.8s | 188 | 5m11s | 1.9s / 1.7s / 3.6s | 96% | 2.4 | 3.3 | 7.11 | unit 321ms |
| atomized | partial | all | 8 | 3 (0) | 34.2s (34.1s-34.4s) | 784ms | 33.4s | 17.2s | 57 | 3m39s | 3.8s / 2.4s / 10.2s | 82% | 7.4 | 12.5 | 5.6 | ct 2.9s, e2e 855ms, unit 320ms |
| atomized | partial | ct | 8 | 3 (0) | 20.2s (20.1s-20.3s) | 780ms | 19.4s | 17.2s | 14 | 2m02s | 8.7s / 8.4s / 16.9s | 79% | 7.3 | 12.5 | 5.37 | ct 3.0s |
| atomized | partial | e2e | 8 | 3 (0) | 13.7s (13.5s-13.8s) | 746ms | 12.9s | 9.9s | 13 | 50.9s | 3.9s / 3.4s / 9.3s | 49% | 4.1 | 8.1 | 3.08 | e2e 1.0s |
| atomized | partial | unit | 8 | 3 (0) | 7.6s (7.4s-7.7s) | 772ms | 6.8s | 3.1s | 30 | 45.7s | 1.5s / 1.3s / 2.9s | 84% | 2.1 | 3.0 | 6.41 | unit 388ms |
| baseline | full | all | 16 | 2 (0) | 3m35s (3m35s-3m35s) | 809ms | 3m34s | 3m34s | 18 | 17m18s | 57.7s / 36.1s / 2m37s | 30% | 8.8 | 15.0 | 3.775 | - |
| baseline | full | all | 4 | 2 (0) | 5m01s (4m41s-5m21s) | 878ms | 5m00s | 3m36s | 18 | 16m41s | 55.6s / 31.9s / 2m36s | 84% | 4.1 | 6.7 | 2.51 | - |
| baseline | full | all | 8 | 3 (0) | 3m32s (3m31s-3m39s) | 789ms | 3m31s | 3m30s | 18 | 16m28s | 55.7s / 33.1s / 2m43s | 59% | 6.1 | 9.9 | 3.41 | - |
| baseline | full | ct | 16 | 2 (0) | 3m34s (3m34s-3m34s) | 845ms | 3m33s | 3m33s | 6 | 8m56s | 1m29s / 1m17s / 3m33s | 16% | 5.8 | 9.8 | 1.8050000000000002 | - |
| baseline | full | ct | 4 | 2 (0) | 3m34s (3m34s-3m34s) | 863ms | 3m33s | 3m33s | 6 | 8m53s | 1m29s / 1m17s / 3m33s | 62% | 4.3 | 6.9 | 1.7850000000000001 | - |
| baseline | full | ct | 8 | 3 (0) | 3m28s (3m27s-3m29s) | 735ms | 3m27s | 3m27s | 6 | 8m37s | 1m26s / 1m15s / 3m27s | 31% | 5.8 | 9.8 | 1.61 | - |
| baseline | full | e2e | 8 | 3 (0) | 2m05s (2m05s-2m06s) | 747ms | 2m05s | 2m05s | 6 | 2m58s | 29.7s / 6.7s / 2m04s | 18% | 2.0 | 3.5 | 0.74 | - |
| baseline | full | unit | 8 | 3 (0) | 1m50s (1m49s-1m53s) | 736ms | 1m49s | 1m49s | 6 | 4m10s | 41.6s / 29.8s / 1m49s | 29% | 2.0 | 2.7 | 1.93 | - |
| baseline | partial | all | 8 | 3 (0) | 1m25s (1m25s-1m25s) | 734ms | 1m24s | 1m24s | 4 | 2m42s | 40.4s / 38.4s / 1m24s | 24% | 2.5 | 3.5 | 1.28 | - |
| baseline | partial | ct | 8 | 3 (0) | 1m24s (1m24s-1m24s) | 750ms | 1m24s | 1m24s | 1 | 1m24s | 1m24s / 1m24s / 1m24s | 13% | 1.5 | 2.0 | 0.59 | - |
| baseline | partial | e2e | 8 | 3 (0) | 40.2s (40.0s-40.3s) | 740ms | 39.4s | 39.4s | 2 | 39.4s | 19.7s / 19.6s / 39.0s | 13% | 0.9 | 1.3 | 0.56 | - |
| baseline | partial | unit | 8 | 3 (0) | 35.3s (35.2s-35.5s) | 773ms | 34.5s | 34.5s | 1 | 34.5s | 34.5s / 34.5s / 34.6s | 13% | 0.4 | 0.7 | 0.86 | - |
| sharded | full | all | 16 | 2 (0) | 1m39s (1m37s-1m41s) | 964ms | 1m38s | 1m37s | 23 | 19m59s | 52.1s / 1m12s / 1m33s | 76% | 10.9 | 18.2 | 11.6 | ct 18.5s, e2e 17.6s, unit 32.3s |
| sharded | full | all | 4 | 2 (0) | 4m34s (4m28s-4m39s) | 986ms | 4m33s | 1m27s | 23 | 16m36s | 43.3s / 57.7s / 1m22s | 91% | 4.4 | 7.1 | 2.7 | ct 1.3s, e2e -827ms, unit -2552ms |
| sharded | full | all | 8 | 3 (0) | 2m34s (2m23s-2m36s) | 886ms | 2m33s | 1m28s | 23 | 16m43s | 44.2s / 59.4s / 1m23s | 86% | 7.4 | 12.6 | 5.24 | ct 3.6s, e2e 1.1s, unit 2.9s |
| sharded | full | ct | 16 | 2 (0) | 1m31s (1m31s-1m32s) | 993ms | 1m30s | 1m30s | 9 | 9m26s | 1m03s / 1m10s / 1m30s | 39% | 8.5 | 14.7 | 5.154999999999999 | ct 8.2s |
| sharded | full | ct | 4 | 2 (0) | 2m34s (2m34s-2m34s) | 996ms | 2m33s | 1m28s | 9 | 9m01s | 1m00s / 1m07s / 1m28s | 88% | 4.4 | 7.1 | 2.5700000000000003 | ct 2.9s |
| sharded | full | ct | 8 | 3 (0) | 1m28s (1m28s-1m28s) | 871ms | 1m27s | 1m27s | 9 | 8m59s | 60.0s / 1m07s / 1m27s | 78% | 7.9 | 13.5 | 4.5 | ct 6.2s |
| sharded (target15) | full | ct | 8 | 2 (0) | 1m24s (1m22s-1m25s) | 950ms | 1m23s | 34.7s | 28 | 10m05s | 21.6s / 20.1s / 33.0s | 92% | 7.9 | 13.4 | 5.984999999999999 | - |
| sharded (target30) | full | ct | 8 | 2 (0) | 1m32s (1m32s-1m33s) | 919ms | 1m32s | 35.5s | 20 | 9m33s | 28.6s / 29.6s / 34.3s | 78% | 8.0 | 13.4 | 4.92 | - |
| sharded | full | e2e | 8 | 3 (0) | 1m10s (1m10s-1m10s) | 852ms | 1m09s | 1m09s | 7 | 3m01s | 25.9s / 13.0s / 1m09s | 33% | 2.6 | 4.6 | 1.4 | e2e 2.3s |
| sharded (target15) | full | e2e | 8 | 2 (0) | 35.3s (35.2s-35.3s) | 911ms | 34.3s | 21.7s | 15 | 3m15s | 13.0s / 15.1s / 20.0s | 71% | 4.6 | 8.5 | 3.5949999999999998 | - |
| sharded (target30) | full | e2e | 8 | 2 (0) | 31.1s (31.0s-31.2s) | 911ms | 30.1s | 30.1s | 11 | 3m12s | 17.5s / 23.9s / 29.4s | 80% | 4.7 | 8.5 | 4.07 | - |
| sharded | full | unit | 8 | 3 (0) | 1m04s (1m03s-1m04s) | 861ms | 1m03s | 1m03s | 7 | 4m17s | 36.5s / 37.5s / 1m03s | 51% | 2.4 | 3.3 | 3.49 | unit 4.7s |
| sharded (target15) | full | unit | 8 | 2 (0) | 43.2s (43.1s-43.3s) | 923ms | 42.2s | 19.4s | 19 | 4m40s | 14.7s / 14.9s / 18.7s | 83% | 2.6 | 3.5 | 5.955 | - |
| sharded (target30) | full | unit | 8 | 2 (0) | 50.0s (49.9s-50.1s) | 891ms | 49.0s | 35.1s | 11 | 4m34s | 24.9s / 28.8s / 34.8s | 70% | 2.6 | 3.5 | 4.92 | - |
| sharded | partial | all | 8 | 3 (0) | 1m25s (1m25s-1m25s) | 875ms | 1m24s | 1m24s | 4 | 2m42s | 40.3s / 38.2s / 1m24s | 24% | 2.5 | 3.7 | 1.28 | - |
| sharded (target15) | partial | all | 8 | 2 (0) | 35.3s (35.1s-35.5s) | 942ms | 34.3s | 19.6s | 13 | 3m08s | 14.5s / 16.1s / 19.4s | 68% | 6.4 | 10.7 | 4.445 | - |
| sharded (target30) | partial | all | 8 | 2 (0) | 34.2s (34.2s-34.2s) | 910ms | 33.3s | 33.3s | 8 | 2m57s | 22.1s / 23.2s / 33.2s | 67% | 5.0 | 8.2 | 4.055 | - |
| sharded | partial | ct | 8 | 3 (0) | 1m24s (1m24s-1m25s) | 839ms | 1m24s | 1m24s | 1 | 1m24s | 1m24s / 1m24s / 1m24s | 13% | 1.6 | 2.1 | 0.6 | - |
| sharded | partial | e2e | 8 | 3 (0) | 40.4s (40.0s-40.7s) | 821ms | 39.5s | 39.5s | 2 | 39.5s | 19.7s / 19.6s / 39.2s | 13% | 1.0 | 1.5 | 0.56 | - |
| sharded | partial | unit | 8 | 3 (0) | 35.3s (35.1s-35.5s) | 847ms | 34.4s | 34.4s | 1 | 34.4s | 34.4s / 34.4s / 34.6s | 13% | 0.6 | 0.8 | 0.87 | - |

## Startup tax

(sum of unit durations - baseline whole-project duration) / (units - 1), per project; median and IQR across projects.

| variant | scenario | runner | -P | kind | projects | median | p25-p75 |
|---|---|---|--:|---|--:|--:|---|
| atomized | full | all | 16 | ct | 6 | 5.9s | 5.7s-6.1s |
| atomized | full | all | 16 | e2e | 3 | 1.4s | 1.2s-2.2s |
| atomized | full | all | 16 | unit | 6 | 558ms | 472ms-608ms |
| atomized | full | all | 4 | ct | 6 | 2.3s | 2.3s-2.4s |
| atomized | full | all | 4 | e2e | 3 | 674ms | 603ms-799ms |
| atomized | full | all | 4 | unit | 6 | 234ms | 217ms-247ms |
| atomized | full | all | 8 | ct | 6 | 2.7s | 2.6s-2.7s |
| atomized | full | all | 8 | e2e | 3 | 798ms | 695ms-840ms |
| atomized | full | all | 8 | unit | 6 | 218ms | 208ms-229ms |
| atomized | full | ct | 16 | ct | 6 | 6.3s | 5.9s-7.3s |
| atomized | full | ct | 4 | ct | 6 | 2.4s | 2.3s-2.4s |
| atomized | full | ct | 8 | ct | 6 | 2.6s | 2.6s-2.7s |
| atomized | full | e2e | 8 | e2e | 3 | 964ms | 843ms-1.1s |
| atomized | full | unit | 8 | unit | 6 | 321ms | 315ms-330ms |
| atomized | partial | all | 8 | ct | 1 | 2.9s | 2.9s-2.9s |
| atomized | partial | all | 8 | e2e | 1 | 855ms | 855ms-855ms |
| atomized | partial | all | 8 | unit | 1 | 320ms | 320ms-320ms |
| atomized | partial | ct | 8 | ct | 1 | 3.0s | 3.0s-3.0s |
| atomized | partial | e2e | 8 | e2e | 1 | 1.0s | 1.0s-1.0s |
| atomized | partial | unit | 8 | unit | 1 | 388ms | 388ms-388ms |
| sharded | full | all | 16 | ct | 2 | 18.5s | 17.5s-19.6s |
| sharded | full | all | 16 | e2e | 1 | 17.6s | 17.6s-17.6s |
| sharded | full | all | 16 | unit | 1 | 32.3s | 32.3s-32.3s |
| sharded | full | all | 4 | ct | 2 | 1.3s | 960ms-1.6s |
| sharded | full | all | 4 | e2e | 1 | -827ms | -827ms--827ms |
| sharded | full | all | 4 | unit | 1 | -2552ms | -2552ms--2552ms |
| sharded | full | all | 8 | ct | 2 | 3.6s | 2.9s-4.3s |
| sharded | full | all | 8 | e2e | 1 | 1.1s | 1.1s-1.1s |
| sharded | full | all | 8 | unit | 1 | 2.9s | 2.9s-2.9s |
| sharded | full | ct | 16 | ct | 2 | 8.2s | 7.8s-8.6s |
| sharded | full | ct | 4 | ct | 2 | 2.9s | 2.1s-3.6s |
| sharded | full | ct | 8 | ct | 2 | 6.2s | 5.9s-6.4s |
| sharded | full | e2e | 8 | e2e | 1 | 2.3s | 2.3s-2.3s |
| sharded | full | unit | 8 | unit | 1 | 4.7s | 4.7s-4.7s |

Sampler overhead: median 15% of one core, max 19%.
