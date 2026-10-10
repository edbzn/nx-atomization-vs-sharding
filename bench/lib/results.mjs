// Discovery/loading of raw run results.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { gunzipSync } from 'node:zlib';

/** All summary.json files under `root` (recursive). */
export function findSummaries(root) {
  const out = [];
  const walk = (d) => {
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (!e.name.startsWith('_')) walk(join(d, e.name)); // _superseded/ etc.
      }
      else if (e.name === 'summary.json') out.push(join(d, e.name));
    }
  };
  walk(root);
  return out.sort();
}

export function loadSummary(file) {
  const s = JSON.parse(readFileSync(file, 'utf8'));
  s._dir = dirname(file);
  excludeContinuousTasks(s);
  return s;
}

/**
 * Continuous tasks (a dev server other tasks depend on, e.g. an app's `serve-static`) run for
 * the whole run and don't take a --parallel slot. Counting them as tasks inflates task time
 * and pushes slot utilisation over 100%, so they're treated like noops in the task metrics.
 * Their processes' CPU and memory stay in the resource totals: that work is real.
 */
function excludeContinuousTasks(s) {
  const graphFile = join(s._dir, 'task-graph.json');
  if (!s.taskList || !existsSync(graphFile)) return;
  const deps = JSON.parse(readFileSync(graphFile, 'utf8')).tasks?.continuousDependencies ?? {};
  const continuous = new Set(Object.values(deps).flat());
  if (!continuous.size) return;
  let removed = 0;
  let removedMs = 0;
  for (const t of s.taskList) {
    if (!continuous.has(t.id) || t.isNoop) continue;
    t.isContinuous = true;
    t.isNoop = true;
    removed++;
    removedMs += t.duration ?? 0;
  }
  if (!removed) return;
  s.tasks.realCount -= removed;
  s.tasks.sumRealDurationMs -= removedMs;
  s.tasks.sumDurationMs -= removedMs;
  const phase = s.timing?.taskPhaseMs;
  if (phase) s.slotUtilisation = s.tasks.sumRealDurationMs / (phase * s.config.parallel);
}

export function loadSamples(dir) {
  const f = join(dir, 'samples.json.gz');
  return existsSync(f) ? JSON.parse(gunzipSync(readFileSync(f))) : null;
}

/** workspace/scenario/runner/pN[/label] */
export function groupKey(s) {
  const c = s.config;
  return [c.workspace, c.scenario, c.runner, `p${c.parallel}`, c.label].filter(Boolean).join('/');
}

/** Identity of one rep, for resumable matrices. */
export function repKey(c) {
  return [c.workspace, c.scenario, c.runner, `p${c.parallel}`, c.label ?? '', `r${c.rep}`].join('/');
}
