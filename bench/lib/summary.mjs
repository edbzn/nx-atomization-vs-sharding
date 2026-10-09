// Turns one run's artifacts (NX_PROFILE trace, task graph, sampler output, hook dump, log)
// into summary.json.
import { classifyTarget } from './config.mjs';
import { max, mean, median, p95, round, sum } from './stats.mjs';
import { parsePerformanceReport } from './perf-report.mjs';

const CACHE_HIT = new Set(['local-cache', 'local-cache-kept-existing', 'remote-cache']);
const NOOP_EXECUTORS = new Set(['nx:noop']);

/**
 * Tasks from an Nx NX_PROFILE Chrome trace (TaskProfilingLifeCycle): complete events
 * {name: taskId, cat: "project,target,configuration", ph: 'X', ts: µs epoch, dur: µs,
 * pid, tid: groupId (= slot index 0..parallel-1), args: {target, status}} preceded by
 * 'M' thread_name metadata events per group.
 */
export function tasksFromProfile(profile) {
  return profile
    .filter((e) => e.ph === 'X')
    .map((e) => ({
      id: e.name,
      project: e.args?.target?.project,
      target: e.args?.target?.target,
      configuration: e.args?.target?.configuration ?? null,
      startAt: e.ts / 1000,
      endAt: (e.ts + e.dur) / 1000,
      slot: e.tid,
      status: e.args?.status ?? null,
    }));
}

/** Fallback when the profile is missing: the hook's PerformanceLifeCycle timings (no slot info). */
export function tasksFromHook(perf, taskGraph) {
  if (!perf?.timings) return [];
  return Object.entries(perf.timings)
    .filter(([, t]) => t.startTime != null && t.endTime != null)
    .map(([id, t]) => {
      const tg = taskGraph?.tasks?.[id]?.target;
      const [project, target, configuration] = id.split(':');
      return {
        id,
        project: tg?.project ?? project,
        target: tg?.target ?? target,
        configuration: tg?.configuration ?? configuration ?? null,
        startAt: t.startTime,
        endAt: t.endTime,
        slot: null,
        status: perf.statuses?.[id] ?? null,
      };
    });
}

export function buildSummary({
  config,
  spawnAt,
  exitAt,
  exitCode,
  signal,
  timedOut,
  profile,
  taskGraph,
  sampler,
  samplerStats,
  perfHook,
  logText,
  leftovers,
  suspectOrphans,
  phases,
  gitDirty,
  idleSysCores,
}) {
  const parallel = config.parallel;
  let tasks = profile ? tasksFromProfile(profile) : tasksFromHook(perfHook, taskGraph);
  const profileSource = profile ? 'NX_PROFILE' : perfHook?.timings ? 'hook-timings' : 'none';
  const executors = taskGraph?.executors ?? {};
  const perTask = sampler?.perTask ?? {};

  tasks = tasks
    .sort((a, b) => a.startAt - b.startAt || a.id.localeCompare(b.id))
    .map((t) => {
      const cls = classifyTarget(t.target ?? '');
      const executor = executors[t.id] ?? null;
      const duration = t.endAt - t.startAt;
      const s = perTask[t.id];
      const isNoop = executor ? NOOP_EXECUTORS.has(executor) : cls.isCiParent && duration < 50 && !s;
      return {
        id: t.id,
        project: t.project,
        target: t.target,
        configuration: t.configuration,
        kind: cls.kind,
        isAtom: cls.isAtom,
        isNoop,
        executor,
        start: round(t.startAt - spawnAt),
        end: round(t.endAt - spawnAt),
        duration: round(duration),
        slot: t.slot,
        status: t.status,
        cacheStatus: t.status == null ? null : CACHE_HIT.has(t.status) ? 'hit' : 'miss',
        peakPssMb: s?.peakPssMb ?? null,
        peakRssMb: s?.peakRssMb ?? null,
        cpuSeconds: s?.cpuSeconds ?? null,
        procs: s?.procs ?? 0,
      };
    });

  const wallMs = exitAt - spawnAt;
  const firstStart = tasks.length ? Math.min(...tasks.map((t) => t.start)) : null;
  const lastEnd = tasks.length ? Math.max(...tasks.map((t) => t.end)) : null;
  const taskPhaseMs = tasks.length ? lastEnd - firstStart : null;
  const real = tasks.filter((t) => !t.isNoop);
  const durations = tasks.map((t) => t.duration);
  const realDur = real.map((t) => t.duration);
  const failed = tasks.filter((t) => t.status === 'failure').map((t) => t.id);
  const notRun = taskGraph?.tasks?.tasks
    ? Object.keys(taskGraph.tasks.tasks).filter((id) => !tasks.some((t) => t.id === id))
    : [];
  const statusCounts = {};
  for (const t of tasks) statusCounts[t.status ?? 'unknown'] = (statusCounts[t.status ?? 'unknown'] ?? 0) + 1;
  const byKind = {};
  for (const t of real) {
    const k = (byKind[t.kind] ??= { count: 0, atoms: 0, sumDurationMs: 0 });
    k.count++;
    if (t.isAtom) k.atoms++;
    k.sumDurationMs += t.duration;
  }

  // Resources from the sampler time series.
  const cols = sampler?.columns ?? [];
  const col = (name) => (sampler?.samples ?? []).map((r) => r[cols.indexOf(name)]);
  const samplerOffset = sampler ? sampler.startedAt - spawnAt : 0; // sampler t=0 relative to spawn
  const inTaskPhase = (sampler?.samples ?? []).filter((r) => {
    const t = r[0] + samplerOffset;
    return firstStart != null && t >= firstStart && t <= lastEnd;
  });
  const coresIdx = cols.indexOf('cores');
  const sysIdx = cols.indexOf('sysCores');
  const cpuSecondsAttributed = sum((sampler?.processes ?? []).map((p) => p.cpuSeconds));
  // Exact machine-wide CPU (from /proc/stat deltas) integrated over the run: includes
  // background noise, but not the per-process end-of-life loss of the attributed figure.
  let cpuSecondsSystem = 0;
  const ss = sampler?.samples ?? [];
  for (let i = 1; i < ss.length; i++) cpuSecondsSystem += ss[i][sysIdx] * ((ss[i][0] - ss[i - 1][0]) / 1000);
  const resources = sampler
    ? {
        peakPssMb: max(col('pssMb')),
        peakRssMb: max(col('rssMb')),
        peakProcs: max(col('procs')),
        avgCores: round(mean(col('cores')), 2),
        peakCores: max(col('cores')),
        avgCoresTaskPhase: round(mean(inTaskPhase.map((r) => r[coresIdx])), 2),
        cpuSecondsAttributed: round(cpuSecondsAttributed, 1),
        cpuSecondsSystem: round(cpuSecondsSystem, 1),
        idleSysCoresBefore: idleSysCores ?? null,
        avgSysCores: round(mean(col('sysCores').slice(1)), 2),
        peakSysCores: max(col('sysCores')),
        avgSysCoresTaskPhase: round(mean(inTaskPhase.map((r) => r[sysIdx])), 2),
        minMemAvailableMb: Math.min(...col('memAvailMb')),
        maxLoad1: max(col('load1')),
        processesSeen: sampler.processes.length,
        reparentedProcesses: sampler.processes.filter((p) => p.reparented).length,
        nxCoordinator: perTask['(nx)'] ?? null,
      }
    : null;

  // Nx performance report: structured (hook) or parsed from the log.
  let nxPerformance = null;
  if (perfHook?.summary) {
    nxPerformance = {
      source: 'hook',
      ...perfHook.summary,
      recoverable: perfHook.summary.recoverableByParallel + perfHook.summary.recoverableByMachines,
      criticalPath: perfHook.criticalPath?.path ?? null,
    };
  } else if (logText) {
    nxPerformance = parsePerformanceReport(logText);
  }

  const graphReadyAt = perfHook?.lifeCycleCreatedAt?.[0];
  const timing = {
    wallMs: round(wallMs),
    firstTaskStartMs: firstStart,
    lastTaskEndMs: lastEnd,
    preTaskMs: firstStart,
    taskPhaseMs,
    postTaskMs: lastEnd != null ? round(wallMs - lastEnd) : null,
    // Only with the hook launcher: node+nx boot, then project/task graph computation,
    // then dispatch (hashing + scheduling of the first task).
    nxBootMs: perfHook?.hookLoadedAt ? perfHook.hookLoadedAt - spawnAt : null,
    graphMs: graphReadyAt && perfHook?.hookLoadedAt ? graphReadyAt - perfHook.hookLoadedAt : null,
    dispatchMs: graphReadyAt && firstStart != null ? round(firstStart - (graphReadyAt - spawnAt)) : null,
    ...phases,
  };

  const slotUtilisation = taskPhaseMs > 0 ? sum(durations) / (taskPhaseMs * parallel) : null;
  const slotUtilisationReal = taskPhaseMs > 0 ? sum(realDur) / (taskPhaseMs * parallel) : null;
  const flags = {
    failedTasks: failed.length > 0,
    nonZeroExit: exitCode !== 0,
    timedOut: !!timedOut,
    missingProfile: !profile,
    leftovers: (leftovers?.length ?? 0) > 0,
    suspectOrphans: (suspectOrphans?.length ?? 0) > 0,
    gitDirty: !!gitDirty,
    notRun: notRun.length > 0,
  };

  return {
    schema: 1,
    config,
    ok: !flags.failedTasks && !flags.nonZeroExit && !flags.timedOut && !flags.missingProfile && !flags.notRun,
    flags,
    exitCode,
    signal: signal ?? null,
    spawnAt,
    exitAt,
    timing,
    tasks: {
      source: profileSource,
      count: tasks.length,
      realCount: real.length,
      noopCount: tasks.length - real.length,
      atomCount: real.filter((t) => t.isAtom).length,
      graphCount: taskGraph?.tasks?.tasks ? Object.keys(taskGraph.tasks.tasks).length : null,
      notRun,
      failed,
      statusCounts,
      byKind,
      sumDurationMs: round(sum(durations)),
      sumRealDurationMs: round(sum(realDur)),
      meanMs: round(mean(realDur)),
      medianMs: round(median(realDur)),
      p95Ms: round(p95(realDur)),
      maxMs: round(max(realDur)),
    },
    slotUtilisation: round(slotUtilisation, 4),
    slotUtilisationReal: round(slotUtilisationReal, 4),
    resources,
    nxPerformance,
    sampler: samplerStats ?? sampler?.overhead ?? null,
    leftovers: leftovers ?? [],
    suspectOrphans: suspectOrphans ?? [],
    taskList: tasks,
  };
}

export function oneLine(s) {
  const f = (ms) => (ms == null ? '-' : ms >= 60_000 ? `${Math.floor(ms / 60000)}m${String(Math.round((ms % 60000) / 1000)).padStart(2, '0')}s` : `${(ms / 1000).toFixed(1)}s`);
  const c = s.config;
  const status = s.ok ? 'OK ' : 'FLAG';
  const parts = [
    `${status} ${c.workspace} ${c.scenario} ${c.runner} p${c.parallel} r${c.rep}`,
    `wall ${f(s.timing.wallMs)} (pre ${f(s.timing.preTaskMs)}, tasks ${f(s.timing.taskPhaseMs)})`,
    `tasks ${s.tasks.realCount}${s.tasks.failed.length ? ` (${s.tasks.failed.length} failed)` : ''}`,
    `util ${s.slotUtilisation != null ? Math.round(s.slotUtilisation * 100) : '-'}%`,
    s.resources ? `PSS ${(s.resources.peakPssMb / 1024).toFixed(1)}GB` : null,
    s.resources ? `CPU ${s.resources.avgCoresTaskPhase ?? '-'}c` : null,
    s.sampler ? `sampler ${(s.sampler.cores * 100).toFixed(1)}%core` : null,
  ];
  const why = Object.entries(s.flags).filter(([, v]) => v).map(([k]) => k);
  if (why.length) parts.push(`flags: ${why.join(',')}`);
  return parts.filter(Boolean).join(' | ');
}
