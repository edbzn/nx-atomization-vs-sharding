# Aggregate results

Generated 2026-10-10T09:13:13.288Z from 26 run(s) in `/home/edouard/work/nx-atomization-vs-sharding/results/closeup/raw`.

Times are medians over clean reps (min-max for wall). Task stats exclude noop parent tasks. PSS/RSS = peak of the whole Nx process tree. CPU = mean cores busy (attributed to the tree) during the task phase.

| variant | scenario | runner | -P | reps (fail) | wall median (min-max) | pre-task | task phase | crit. path | tasks | sum task time | task mean / med / p95 | slot util | peak PSS GB | peak RSS GB | avg CPU | startup tax |
|---|---|---|--:|--:|---|--:|--:|--:|--:|--:|---|--:|--:|--:|--:|---|
| atomized | full | all | 16 | 1 (0) | 1m46s (1m46s-1m46s) | 1.1s | 1m45s | 9.4s | 450 | 27m36s | 3.7s / 2.0s / 7.5s | 99% | 12.4 | 24.4 | 19.15 | ct 4.2s, e2e 904ms, unit 258ms |
| atomized | full | all | 4 | 1 (0) | 4m36s (4m36s-4m36s) | 1.2s | 4m35s | 7.1s | 450 | 18m10s | 2.4s / 1.6s / 5.0s | 99% | 4.0 | 6.5 | 4.38 | ct 2.2s, e2e 720ms, unit 195ms |
| atomized | full | all | 8 | 1 (0) | 2m33s (2m33s-2m33s) | 1.1s | 2m32s | 7.2s | 450 | 20m05s | 2.7s / 1.7s / 5.5s | 99% | 7.4 | 12.6 | 9.15 | ct 2.7s, e2e 783ms, unit 221ms |
| atomized | full | ct | 8 | 1 (0) | 1m57s (1m57s-1m57s) | 1.1s | 1m56s | 7.3s | 185 | 15m07s | 4.9s / 5.0s / 6.1s | 98% | 7.2 | 12.4 | 9.27 | ct 2.6s |
| atomized | full | e2e | 8 | 1 (0) | 16.8s (16.8s-16.8s) | 986ms | 15.8s | 3.9s | 66 | 1m57s | 1.8s / 1.8s / 2.9s | 93% | 3.4 | 6.9 | 6.78 | e2e 768ms |
| atomized | full | unit | 8 | 1 (0) | 23.3s (23.3s-23.3s) | 1.0s | 22.3s | 1.3s | 199 | 2m54s | 875ms / 862ms / 1.1s | 98% | 2.0 | 2.9 | 8.64 | unit 202ms |
| baseline | full | all | 16 | 1 (0) | 1m18s (1m18s-1m18s) | 1.0s | 1m17s | 59.9s | 100 | 16m03s | 9.6s / 6.8s / 27.5s | 78% | 11.1 | 21.9 | 15.72 | - |
| baseline | full | all | 4 | 1 (0) | 3m05s (3m05s-3m05s) | 967ms | 3m04s | 50.4s | 100 | 11m40s | 7.0s / 4.7s / 20.8s | 95% | 4.2 | 6.9 | 3.97 | - |
| baseline | full | all | 8 | 1 (0) | 1m50s (1m50s-1m50s) | 938ms | 1m49s | 53.3s | 100 | 12m26s | 7.5s / 4.9s / 22.0s | 86% | 7.3 | 12.8 | 7.62 | - |
| baseline | full | ct | 8 | 1 (0) | 1m15s (1m15s-1m15s) | 925ms | 1m14s | 52.2s | 40 | 8m46s | 13.2s / 9.6s / 31.4s | 89% | 7.7 | 13.4 | 8.3 | - |
| baseline | full | e2e | 8 | 1 (0) | 26.7s (26.7s-26.7s) | 942ms | 25.7s | 25.7s | 20 | 1m20s | 4.0s / 1.4s / 10.1s | 39% | 3.9 | 7.8 | 2.19 | - |
| baseline | full | unit | 8 | 1 (0) | 22.3s (22.3s-22.3s) | 906ms | 21.4s | 11.7s | 40 | 2m18s | 3.4s / 2.6s / 9.9s | 81% | 2.0 | 2.8 | 7.05 | - |
| sharded | full | all | 16 | 1 (0) | 1m10s (1m10s-1m10s) | 1.1s | 1m09s | 28.3s | 106 | 16m49s | 9.5s / 7.1s / 26.2s | 92% | 11.8 | 23.1 | 18.55 | ct 6.6s, e2e 3.1s |
| sharded (target1.5) | full | all | 16 | 1 (0) | 1m35s (1m35s-1m35s) | 1.2s | 1m34s | 14.1s | 262 | 24m43s | 5.7s / 6.2s / 10.0s | 99% | 12.4 | 24.7 | 19.41 | - |
| sharded | full | all | 4 | 1 (0) | 3m03s (3m03s-3m03s) | 1.1s | 3m02s | 21.0s | 106 | 11m52s | 6.7s / 4.8s / 19.1s | 98% | 4.4 | 7.3 | 4.1 | ct 2.6s, e2e 610ms |
| sharded (target1.5) | full | all | 4 | 1 (0) | 4m07s (4m07s-4m07s) | 1.3s | 4m06s | 9.4s | 262 | 16m20s | 3.7s / 3.9s / 6.7s | 100% | 4.3 | 7.1 | 4.36 | - |
| sharded | full | all | 8 | 1 (0) | 1m41s (1m41s-1m41s) | 1.1s | 1m40s | 22.3s | 106 | 12m47s | 7.2s / 5.1s / 20.1s | 96% | 7.5 | 13.2 | 8.63 | ct 2.6s, e2e 2.2s |
| sharded (target1.5) | full | all | 8 | 1 (0) | 2m17s (2m17s-2m17s) | 1.2s | 2m16s | 10.3s | 262 | 18m01s | 4.1s / 4.3s / 7.2s | 99% | 7.5 | 13.2 | 9.23 | - |
| sharded (target30) | full | all | 8 | 1 (0) | 1m52s (1m52s-1m52s) | 1.1s | 1m51s | 37.7s | 101 | 12m35s | 7.5s / 5.0s / 25.2s | 85% | 7.4 | 13.0 | 7.63 | - |
| sharded (target90) | full | all | 8 | 1 (0) | 1m50s (1m50s-1m50s) | 1.1s | 1m49s | 53.3s | 100 | 12m32s | 7.5s / 5.0s / 22.0s | 86% | 7.8 | 13.0 | 7.65 | - |
| sharded | full | ct | 8 | 1 (0) | 1m14s (1m14s-1m14s) | 1.0s | 1m13s | 21.9s | 45 | 8m57s | 11.9s / 10.5s / 21.2s | 92% | 7.7 | 13.3 | 8.59 | ct 2.6s |
| sharded (target1.5) | full | ct | 8 | 1 (0) | 1m48s (1m48s-1m48s) | 1.1s | 1m47s | 10.4s | 154 | 13m53s | 5.4s / 5.1s / 8.1s | 98% | 7.3 | 12.8 | 9.28 | - |
| sharded | full | e2e | 8 | 1 (0) | 15.1s (15.1s-15.1s) | 1.1s | 14.0s | 14.0s | 21 | 1m21s | 3.9s / 2.1s / 13.2s | 72% | 4.2 | 8.0 | 4.26 | e2e 1.5s |
| sharded (target1.5) | full | e2e | 8 | 1 (0) | 15.1s (15.1s-15.1s) | 1.1s | 14.0s | 5.4s | 48 | 1m43s | 2.2s / 2.1s / 4.3s | 93% | 4.0 | 8.0 | 6.58 | - |
| sharded | full | unit | 8 | 1 (0) | 22.5s (22.5s-22.5s) | 1.1s | 21.4s | 11.7s | 40 | 2m17s | 3.4s / 2.6s / 9.8s | 80% | 2.1 | 3.0 | 7.1 | - |
| sharded (target1.5) | full | unit | 8 | 1 (0) | 20.6s (20.6s-20.6s) | 1.1s | 19.5s | 4.2s | 60 | 2m25s | 2.4s / 2.4s / 3.6s | 93% | 2.0 | 2.9 | 8.17 | - |

## Startup tax

(sum of unit durations - baseline whole-project duration) / (units - 1), per project; median and IQR across projects.

| variant | scenario | runner | -P | kind | projects | median | p25-p75 |
|---|---|---|--:|---|--:|--:|---|
| atomized | full | all | 16 | ct | 34 | 4.2s | 3.8s-4.5s |
| atomized | full | all | 16 | e2e | 9 | 904ms | 800ms-1.0s |
| atomized | full | all | 16 | unit | 37 | 258ms | 156ms-441ms |
| atomized | full | all | 4 | ct | 34 | 2.2s | 2.1s-2.3s |
| atomized | full | all | 4 | e2e | 9 | 720ms | 694ms-766ms |
| atomized | full | all | 4 | unit | 37 | 195ms | 183ms-213ms |
| atomized | full | all | 8 | ct | 34 | 2.7s | 2.5s-2.8s |
| atomized | full | all | 8 | e2e | 9 | 783ms | 732ms-835ms |
| atomized | full | all | 8 | unit | 37 | 221ms | 199ms-251ms |
| atomized | full | ct | 8 | ct | 34 | 2.6s | 2.4s-2.8s |
| atomized | full | e2e | 8 | e2e | 9 | 768ms | 750ms-795ms |
| atomized | full | unit | 8 | unit | 37 | 202ms | 190ms-237ms |
| sharded | full | all | 16 | ct | 4 | 6.6s | 4.3s-8.5s |
| sharded | full | all | 16 | e2e | 1 | 3.1s | 3.1s-3.1s |
| sharded | full | all | 4 | ct | 4 | 2.6s | 2.0s-2.7s |
| sharded | full | all | 4 | e2e | 1 | 610ms | 610ms-610ms |
| sharded | full | all | 8 | ct | 4 | 2.6s | 2.5s-2.6s |
| sharded | full | all | 8 | e2e | 1 | 2.2s | 2.2s-2.2s |
| sharded | full | ct | 8 | ct | 4 | 2.6s | 2.1s-2.9s |
| sharded | full | e2e | 8 | e2e | 1 | 1.5s | 1.5s-1.5s |

Sampler overhead: median 16% of one core, max 19%.
