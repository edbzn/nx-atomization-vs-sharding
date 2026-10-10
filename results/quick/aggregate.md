# Aggregate results

Generated 2026-10-10T12:03:30.151Z from 17 run(s) in `results/quick/raw`.

Times are medians over clean reps (min-max for wall). Task stats exclude noop parent tasks. PSS/RSS = peak of the whole Nx process tree. CPU = mean cores busy (attributed to the tree) during the task phase.

| variant | scenario | runner | -P | reps (fail) | wall median (min-max) | pre-task | task phase | crit. path | tasks | sum task time | task mean / med / p95 | slot util | peak PSS GB | peak RSS GB | avg CPU | startup tax |
|---|---|---|--:|--:|---|--:|--:|--:|--:|--:|---|--:|--:|--:|--:|---|
| atomized | full | all | 16 | 1 (0) | 59.4s (59.4s-59.4s) | 717ms | 58.3s | 8.8s | 231 | 15m07s | 3.9s / 1.9s / 7.5s | 97% | 11.9 | 24.5 | 18.83 | ct 4.6s, e2e 1.1s, unit 477ms |
| atomized | full | all | 8 | 1 (0) | 1m27s (1m27s-1m27s) | 722ms | 1m26s | 7.2s | 231 | 11m13s | 2.9s / 1.5s / 6.0s | 98% | 8.4 | 13.6 | 9.16 | ct 2.9s, e2e 590ms, unit 215ms |
| atomized | full | ct | 8 | 1 (0) | 1m10s (1m10s-1m10s) | 703ms | 1m09s | 7.0s | 109 | 8m58s | 4.9s / 5.0s / 6.1s | 98% | 7.3 | 12.4 | 9.41 | ct 2.8s |
| atomized | full | e2e | 8 | 1 (0) | 5.8s (5.8s-5.8s) | 666ms | 4.8s | 3.3s | 12 | 19.7s | 1.6s / 1.5s / 3.1s | 52% | 3.1 | 6.5 | 3.42 | e2e 634ms |
| atomized | full | unit | 8 | 1 (0) | 13.2s (13.2s-13.2s) | 669ms | 12.4s | 1.4s | 110 | 1m37s | 879ms / 851ms / 1.1s | 97% | 1.8 | 2.7 | 8.48 | unit 304ms |
| baseline | full | all | 16 | 1 (0) | 1m37s (1m37s-1m37s) | 630ms | 1m37s | 1m37s | 13 | 5m47s | 26.7s / 20.0s / 1m17s | 22% | 6.2 | 10.7 | 3.85 | - |
| baseline | full | all | 8 | 1 (0) | 1m42s (1m42s-1m42s) | 647ms | 1m41s | 1m35s | 13 | 5m41s | 26.2s / 19.4s / 1m16s | 42% | 6.6 | 10.6 | 3.64 | - |
| baseline | full | ct | 8 | 1 (0) | 1m36s (1m36s-1m36s) | 626ms | 1m35s | 1m35s | 5 | 4m07s | 49.4s / 39.7s / 1m28s | 32% | 5.2 | 8.6 | 2.75 | - |
| baseline | full | e2e | 8 | 1 (0) | 14.5s (14.5s-14.5s) | 631ms | 13.5s | 13.0s | 3 | 13.5s | 4.5s / 522ms / 11.6s | 12% | 0.8 | 1.2 | 0.53 | - |
| baseline | full | unit | 8 | 1 (0) | 27.9s (27.9s-27.9s) | 654ms | 27.2s | 27.2s | 5 | 1m05s | 13.1s / 10.5s / 25.2s | 30% | 1.4 | 2.0 | 2.49 | - |
| sharded (target10) | full | all | 16 | 1 (0) | 39.3s (39.3s-39.3s) | 741ms | 38.5s | 22.7s | 29 | 8m02s | 16.6s / 19.0s / 22.6s | 78% | 15.4 | 21.0 | 15.48 | - |
| sharded (target10) | full | all | 8 | 1 (0) | 53.6s (53.6s-53.6s) | 777ms | 52.5s | 20.1s | 29 | 6m33s | 13.6s / 15.6s / 18.3s | 94% | 7.3 | 12.5 | 8.53 | - |
| sharded (target30) | full | all | 8 | 1 (0) | 1m04s (1m04s-1m04s) | 761ms | 1m03s | 41.6s | 16 | 5m56s | 22.2s / 26.5s / 37.1s | 70% | 6.4 | 10.9 | 6.26 | - |
| sharded (target5) | full | all | 8 | 1 (0) | 57.2s (57.2s-57.2s) | 785ms | 56.3s | 16.9s | 43 | 6m56s | 9.7s / 10.0s / 15.0s | 92% | 7.6 | 13.3 | 8.46 | - |
| sharded (target10) | full | ct | 8 | 1 (0) | 47.1s (47.1s-47.1s) | 715ms | 46.3s | 18.2s | 19 | 4m58s | 15.7s / 15.6s / 17.5s | 80% | 7.8 | 13.4 | 7.46 | - |
| sharded (target10) | full | e2e | 8 | 1 (0) | 8.7s (8.7s-8.7s) | 714ms | 7.7s | 7.1s | 4 | 14.1s | 3.5s / 3.5s / 6.9s | 23% | 1.3 | 2.2 | 1.04 | - |
| sharded (target10) | full | unit | 8 | 1 (0) | 18.4s (18.4s-18.4s) | 717ms | 17.6s | 17.6s | 6 | 1m10s | 11.6s / 12.9s / 16.9s | 49% | 1.7 | 2.4 | 4.08 | - |

## Startup tax

(sum of unit durations - baseline whole-project duration) / (units - 1), per project; median and IQR across projects.

| variant | scenario | runner | -P | kind | projects | median | p25-p75 |
|---|---|---|--:|---|--:|--:|---|
| atomized | full | all | 16 | ct | 5 | 4.6s | 4.6s-4.8s |
| atomized | full | all | 16 | e2e | 1 | 1.1s | 1.1s-1.1s |
| atomized | full | all | 16 | unit | 5 | 477ms | 454ms-523ms |
| atomized | full | all | 8 | ct | 5 | 2.9s | 2.9s-2.9s |
| atomized | full | all | 8 | e2e | 1 | 590ms | 590ms-590ms |
| atomized | full | all | 8 | unit | 5 | 215ms | 204ms-218ms |
| atomized | full | ct | 8 | ct | 5 | 2.8s | 2.7s-2.9s |
| atomized | full | e2e | 8 | e2e | 1 | 634ms | 634ms-634ms |
| atomized | full | unit | 8 | unit | 5 | 304ms | 274ms-309ms |

Sampler overhead: median 14% of one core, max 19%.
