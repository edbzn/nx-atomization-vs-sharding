// Fetches Nx Cloud data for Nx Agents runs: the run, every task (start, end, agent) and every
// agent of its run group (online, offline, CPU). Usage: node collect.mjs <name=nxRunId>...
// Needs NX_CLOUD_ACCESS_TOKEN. Writes agents-data/<name>.json.
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://cloud.nx.app/nx-cloud/data/v0-beta';
const headers = { Authorization: `Bearer ${process.env.NX_CLOUD_ACCESS_TOKEN}` };
const get = async (path) => {
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${path}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
};
const all = async (path) => {
  const items = [];
  let cursor = null;
  do {
    const page = await get(`${path}${path.includes('?') ? '&' : '?'}limit=500${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
    items.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);
  return items;
};

mkdirSync('agents-data', { recursive: true });
for (const arg of process.argv.slice(2)) {
  const [name, runId] = arg.split('=');
  const run = await get(`/runs/${runId}`);
  const groupId = typeof run.runGroup === 'string' ? run.runGroup : run.runGroup?.id ?? run.runGroup?.name;
  const tasks = await all(`/runs/${runId}/tasks?sort=ASC`);
  let group = null;
  let agents = [];
  if (groupId) {
    group = await get(`/run-groups/${encodeURIComponent(groupId)}`).catch((e) => ({ error: String(e) }));
    agents = await all(`/run-groups/${encodeURIComponent(groupId)}/agents`).catch((e) => [{ error: String(e) }]);
  }
  writeFileSync(`agents-data/${name}.json`, JSON.stringify({ name, runId, run, group, tasks, agents }, null, 1));
  console.log(`${name}: ${tasks.length} tasks, ${agents.length} agents`);
}
