# Aggregate results

Generated 2026-10-12T07:11:44.185Z from 12 run(s) in `results/slow/raw`.

Times are medians over clean reps (min-max for wall). Task stats exclude noop parent tasks. PSS/RSS = peak of the whole Nx process tree. CPU = mean cores busy (attributed to the tree) during the task phase.

| variant | scenario | runner | -P | reps (fail) | wall median (min-max) | pre-task | task phase | crit. path | tasks | sum task time | task mean / med / p95 | slot util | peak PSS GB | peak RSS GB | avg CPU | startup tax |
|---|---|---|--:|--:|---|--:|--:|--:|--:|--:|---|--:|--:|--:|--:|---|
| atomized | full | all | 8 | 1 (0) | 3m31s (3m31s-3m31s) | 694ms | 3m30s | 53.9s | 231 | 23m55s | 6.2s / 4.3s / 20.8s | 85% | 8.6 | 13.6 | 5.54 | ct 2.7s, e2e 725ms, unit 213ms |
| atomized | full | ct | 8 | 1 (0) | 2m05s (2m05s-2m05s) | 728ms | 2m04s | 44.8s | 109 | 16m20s | 9.0s / 5.1s / 25.8s | 99% | 7.7 | 12.8 | 7.11 | ct 2.8s |
| atomized | full | e2e | 8 | 1 (0) | 58.5s (58.5s-58.5s) | 676ms | 57.4s | 53.6s | 12 | 3m36s | 18.0s / 12.2s / 51.0s | 47% | 4.2 | 7.8 | 1.94 | e2e 729ms |
| atomized | full | unit | 8 | 1 (0) | 32.7s (32.7s-32.7s) | 675ms | 32.0s | 8.7s | 110 | 4m13s | 2.3s / 1.1s / 6.1s | 99% | 2.6 | 3.5 | 6.46 | unit 277ms |
| baseline | full | all | 8 | 1 (0) | 8m27s (8m27s-8m27s) | 646ms | 8m27s | 8m27s | 13 | 18m46s | 1m27s / 24.8s / 5m29s | 28% | 6.5 | 10.4 | 1.46 | - |
| baseline | full | ct | 8 | 1 (0) | 8m26s (8m26s-8m26s) | 628ms | 8m25s | 8m25s | 5 | 11m28s | 2m18s / 39.0s / 7m03s | 17% | 5.2 | 8.5 | 0.9 | - |
| baseline | full | e2e | 8 | 1 (0) | 3m30s (3m30s-3m30s) | 639ms | 3m29s | 3m28s | 3 | 3m29s | 1m10s / 522ms / 3m07s | 13% | 1.0 | 1.4 | 0.49 | - |
| baseline | full | unit | 8 | 1 (0) | 2m46s (2m46s-2m46s) | 658ms | 2m45s | 2m45s | 5 | 3m23s | 40.6s / 10.4s / 2m16s | 15% | 1.5 | 2.0 | 0.9 | - |
| sharded (target10) | full | all | 8 | 1 (0) | 2m51s (2m51s-2m51s) | 810ms | 2m50s | 1m22s | 44 | 19m53s | 27.1s / 18.2s / 1m12s | 88% | 8.2 | 13.5 | 5.01 | - |
| sharded (target10) | full | ct | 8 | 1 (0) | 1m47s (1m47s-1m47s) | 773ms | 1m47s | 1m24s | 22 | 12m55s | 35.2s / 19.4s / 1m20s | 91% | 8.1 | 13.4 | 5.95 | - |
| sharded (target10) | full | e2e | 8 | 1 (0) | 56.2s (56.2s-56.2s) | 822ms | 55.0s | 54.4s | 10 | 3m43s | 22.3s / 15.8s / 52.9s | 51% | 4.2 | 7.7 | 2.32 | - |
| sharded (target10) | full | unit | 8 | 1 (0) | 43.2s (43.2s-43.2s) | 827ms | 42.3s | 29.5s | 12 | 3m56s | 19.7s / 21.9s / 28.5s | 70% | 2.9 | 3.8 | 4.47 | - |

## Startup tax

(sum of unit durations - baseline whole-project duration) / (units - 1), per project; median and IQR across projects.

| variant | scenario | runner | -P | kind | projects | median | p25-p75 |
|---|---|---|--:|---|--:|--:|---|
| atomized | full | all | 8 | ct | 5 | 2.7s | 2.4s-2.8s |
| atomized | full | all | 8 | e2e | 1 | 725ms | 725ms-725ms |
| atomized | full | all | 8 | unit | 5 | 213ms | 197ms-227ms |
| atomized | full | ct | 8 | ct | 5 | 2.8s | 2.7s-2.9s |
| atomized | full | e2e | 8 | e2e | 1 | 729ms | 729ms-729ms |
| atomized | full | unit | 8 | unit | 5 | 277ms | 268ms-292ms |

Sampler overhead: median 15% of one core, max 18%.
