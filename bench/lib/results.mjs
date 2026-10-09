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
  return s;
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
