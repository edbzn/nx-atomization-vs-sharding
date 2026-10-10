# Aggregate results

Generated 2026-10-10T12:56:36.225Z from 17 run(s) in `results/quick-50/raw`.

Times are medians over clean reps (min-max for wall). Task stats exclude noop parent tasks. PSS/RSS = peak of the whole Nx process tree. CPU = mean cores busy (attributed to the tree) during the task phase.

| variant | scenario | runner | -P | reps (fail) | wall median (min-max) | pre-task | task phase | crit. path | tasks | sum task time | task mean / med / p95 | slot util | peak PSS GB | peak RSS GB | avg CPU | startup tax |
|---|---|---|--:|--:|---|--:|--:|--:|--:|--:|---|--:|--:|--:|--:|---|
| atomized | full | all | 16 | 1 (0) | 3m48s (3m48s-3m48s) | 1.1s | 3m47s | 10.2s | 897 | 59m60s | 4.0s / 2.3s / 8.1s | 99% | 16.1 | 25.3 | 19.12 | ct 4.4s, e2e 815ms, unit 247ms |
| atomized | full | all | 8 | 1 (0) | 5m24s (5m24s-5m24s) | 1.2s | 5m22s | 7.2s | 897 | 42m48s | 2.9s / 1.9s / 5.9s | 100% | 8.5 | 13.7 | 9.24 | ct 2.7s, e2e 644ms, unit 213ms |
| atomized | full | ct | 8 | 1 (0) | 4m17s (4m17s-4m17s) | 914ms | 4m16s | 7.2s | 408 | 33m51s | 5.0s / 5.0s / 6.2s | 99% | 8.8 | 12.5 | 9.39 | ct 2.6s |
| atomized | full | e2e | 8 | 1 (0) | 28.5s (28.5s-28.5s) | 865ms | 27.3s | 3.3s | 121 | 3m22s | 1.7s / 1.7s / 2.5s | 93% | 3.4 | 6.9 | 6.84 | e2e 701ms |
| atomized | full | unit | 8 | 1 (0) | 42.1s (42.1s-42.1s) | 887ms | 41.2s | 1.4s | 368 | 5m25s | 884ms / 869ms / 1.1s | 99% | 2.1 | 2.9 | 8.84 | unit 241ms |
| baseline | full | all | 16 | 1 (0) | 2m48s (2m48s-2m48s) | 755ms | 2m47s | 2m39s | 55 | 28m02s | 30.6s / 19.6s / 1m30s | 63% | 12.6 | 23.7 | 12.37 | - |
| baseline | full | all | 8 | 1 (0) | 3m16s (3m16s-3m16s) | 751ms | 3m15s | 2m27s | 55 | 23m12s | 25.3s / 15.2s / 1m18s | 89% | 8.1 | 14.1 | 7.79 | - |
| baseline | full | ct | 8 | 1 (0) | 2m28s (2m28s-2m28s) | 705ms | 2m27s | 2m26s | 20 | 16m39s | 50.0s / 40.5s / 1m43s | 85% | 7.9 | 13.6 | 7.67 | - |
| baseline | full | e2e | 8 | 1 (0) | 53.7s (53.7s-53.7s) | 732ms | 52.6s | 52.0s | 15 | 2m06s | 8.4s / 625ms / 38.9s | 30% | 3.0 | 5.4 | 1.39 | - |
| baseline | full | unit | 8 | 1 (0) | 44.4s (44.4s-44.4s) | 724ms | 43.7s | 32.3s | 20 | 3m59s | 11.9s / 10.2s / 25.3s | 68% | 2.0 | 2.9 | 5.85 | - |
| sharded (target10) | full | all | 16 | 1 (0) | 2m11s (2m11s-2m11s) | 848ms | 2m10s | 30.1s | 119 | 33m03s | 16.7s / 18.9s / 26.6s | 95% | 13.7 | 26.3 | 19.57 | - |
| sharded (target10) | full | all | 8 | 1 (0) | 3m18s (3m18s-3m18s) | 914ms | 3m17s | 22.8s | 119 | 25m36s | 12.9s / 14.5s / 20.6s | 97% | 8.1 | 14.0 | 8.67 | - |
| sharded (target30) | full | all | 8 | 1 (0) | 3m10s (3m10s-3m10s) | 875ms | 3m08s | 43.4s | 68 | 23m40s | 20.9s / 20.9s / 40.7s | 94% | 9.0 | 14.0 | 8.22 | - |
| sharded (target5) | full | all | 8 | 1 (0) | 3m30s (3m30s-3m30s) | 913ms | 3m29s | 22.0s | 176 | 27m22s | 9.3s / 9.4s / 16.6s | 98% | 7.9 | 13.7 | 8.85 | - |
| sharded (target10) | full | ct | 8 | 1 (0) | 2m29s (2m29s-2m29s) | 884ms | 2m29s | 22.1s | 71 | 18m57s | 16.0s / 15.7s / 20.6s | 96% | 8.1 | 14.0 | 8.83 | - |
| sharded (target10) | full | e2e | 8 | 1 (0) | 20.9s (20.9s-20.9s) | 834ms | 19.7s | 10.8s | 26 | 2m16s | 5.2s / 6.3s / 10.0s | 86% | 4.3 | 8.0 | 4.68 | - |
| sharded (target10) | full | unit | 8 | 1 (0) | 36.3s (36.3s-36.3s) | 831ms | 35.4s | 21.3s | 22 | 3m58s | 10.8s / 10.9s / 19.9s | 84% | 2.1 | 3.0 | 7.29 | - |

## Startup tax

(sum of unit durations - baseline whole-project duration) / (units - 1), per project; median and IQR across projects.

| variant | scenario | runner | -P | kind | projects | median | p25-p75 |
|---|---|---|--:|---|--:|--:|---|
| atomized | full | all | 16 | ct | 20 | 4.4s | 4.2s-4.6s |
| atomized | full | all | 16 | e2e | 5 | 815ms | 757ms-987ms |
| atomized | full | all | 16 | unit | 20 | 247ms | 192ms-373ms |
| atomized | full | all | 8 | ct | 20 | 2.7s | 2.6s-2.7s |
| atomized | full | all | 8 | e2e | 5 | 644ms | 634ms-709ms |
| atomized | full | all | 8 | unit | 20 | 213ms | 203ms-224ms |
| atomized | full | ct | 8 | ct | 20 | 2.6s | 2.6s-2.7s |
| atomized | full | e2e | 8 | e2e | 5 | 701ms | 642ms-702ms |
| atomized | full | unit | 8 | unit | 20 | 241ms | 227ms-260ms |

Sampler overhead: median 17% of one core, max 20%.
