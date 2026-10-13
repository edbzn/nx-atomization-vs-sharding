# Aggregate results

Generated 2026-10-12T13:28:28.077Z from 12 run(s) in `results/slow-50/raw`.

Times are medians over clean reps (min-max for wall). Task stats exclude noop parent tasks. PSS/RSS = peak of the whole Nx process tree. CPU = mean cores busy (attributed to the tree) during the task phase.

| variant | scenario | runner | -P | reps (fail) | wall median (min-max) | pre-task | task phase | crit. path | tasks | sum task time | task mean / med / p95 | slot util | peak PSS GB | peak RSS GB | avg CPU | startup tax |
|---|---|---|--:|--:|---|--:|--:|--:|--:|--:|---|--:|--:|--:|--:|---|
| atomized | full | all | 8 | 1 (0) | 10m51s (10m51s-10m51s) | 1.2s | 10m49s | 1m06s | 897 | 85m08s | 5.7s / 4.1s / 21.8s | 98% | 8.3 | 13.5 | 7.22 | ct 2.9s, e2e 711ms, unit 236ms |
| atomized | full | ct | 8 | 1 (0) | 8m10s (8m10s-8m10s) | 925ms | 8m09s | 1m05s | 408 | 64m56s | 9.5s / 5.1s / 28.4s | 100% | 7.9 | 13.0 | 6.63 | ct 2.5s |
| atomized | full | e2e | 8 | 1 (0) | 1m12s (1m12s-1m12s) | 815ms | 1m11s | 53.6s | 121 | 6m49s | 3.4s / 1.7s / 12.5s | 72% | 4.4 | 8.0 | 4.06 | e2e 659ms |
| atomized | full | unit | 8 | 1 (0) | 1m09s (1m09s-1m09s) | 907ms | 1m08s | 8.7s | 368 | 8m48s | 1.4s / 886ms / 4.7s | 97% | 2.9 | 3.8 | 7.09 | unit 234ms |
| baseline | full | all | 8 | 1 (0) | 20m41s (20m41s-20m41s) | 804ms | 20m40s | 20m03s | 55 | 64m04s | 1m10s / 21.4s / 4m06s | 39% | 7.7 | 12.9 | 2.34 | - |
| baseline | full | ct | 8 | 1 (0) | 19m55s (19m55s-19m55s) | 780ms | 19m54s | 19m54s | 20 | 49m16s | 2m28s / 48.8s / 9m57s | 31% | 8.0 | 13.4 | 1.79 | - |
| baseline | full | e2e | 8 | 1 (0) | 3m44s (3m44s-3m44s) | 720ms | 3m43s | 3m42s | 15 | 5m34s | 22.3s / 653ms / 1m43s | 19% | 3.2 | 5.6 | 0.79 | - |
| baseline | full | unit | 8 | 1 (0) | 1m37s (1m37s-1m37s) | 732ms | 1m36s | 1m13s | 20 | 7m15s | 21.8s / 12.9s / 1m09s | 57% | 2.4 | 3.3 | 3.86 | - |
| sharded (target10) | full | all | 8 | 1 (0) | 8m10s (8m10s-8m10s) | 899ms | 8m09s | 2m39s | 163 | 64m32s | 23.8s / 14.5s / 1m25s | 99% | 10.1 | 13.8 | 5.8 | - |
| sharded (target10) | full | ct | 8 | 1 (0) | 6m39s (6m39s-6m39s) | 946ms | 6m38s | 2m42s | 84 | 52m30s | 37.5s / 18.0s / 2m34s | 99% | 8.5 | 13.9 | 6.3 | - |
| sharded (target10) | full | e2e | 8 | 1 (0) | 55.2s (55.2s-55.2s) | 829ms | 54.1s | 53.5s | 32 | 5m49s | 10.9s / 8.3s / 44.7s | 81% | 4.5 | 8.3 | 3.74 | - |
| sharded (target10) | full | unit | 8 | 1 (0) | 1m04s (1m04s-1m04s) | 851ms | 1m03s | 21.1s | 47 | 7m29s | 9.6s / 8.8s / 16.1s | 89% | 2.8 | 3.7 | 6.11 | - |

## Startup tax

(sum of unit durations - baseline whole-project duration) / (units - 1), per project; median and IQR across projects.

| variant | scenario | runner | -P | kind | projects | median | p25-p75 |
|---|---|---|--:|---|--:|--:|---|
| atomized | full | all | 8 | ct | 20 | 2.9s | 2.8s-3.0s |
| atomized | full | all | 8 | e2e | 5 | 711ms | 684ms-780ms |
| atomized | full | all | 8 | unit | 20 | 236ms | 169ms-287ms |
| atomized | full | ct | 8 | ct | 20 | 2.5s | 2.3s-2.6s |
| atomized | full | e2e | 8 | e2e | 5 | 659ms | 640ms-684ms |
| atomized | full | unit | 8 | unit | 20 | 234ms | 218ms-275ms |

Sampler overhead: median 15% of one core, max 18%.
