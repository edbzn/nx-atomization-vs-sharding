"""Slow-projects Nx Agents results (results/*-slow-100-*.json) -> the blog's data/agents.json."""
import glob, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.expanduser('~/work/edbzn.dev.worktrees/nx-atomization-vs-sharding/content/blog/nx-atomization-vs-sharding/data/agents.json')
rows = []
for f in sorted(glob.glob(f'{HERE}/../../results/agents/results/*-slow-100-*.json')):
    r = json.load(open(f))
    if r.get('conclusion') != 'success' or not r.get('testsS'):
        print('skip', f, r.get('conclusion'))
        continue
    setup = r['workspace'].split('-')[0]
    rows.append({'size': 100, 'workload': 'slow', 'variant': setup, 'agents': r['agents'], 'tests_s': round(r['testsS'], 1),
                 'boot_s': round(r['startToReadyS'], 1), 'total_s': round(r['totalS'], 1),
                 'agent_min': round(r['agents'] * r['totalS'] / 60, 1), 'run': r['githubRunId']})
rows.sort(key=lambda r: (r['variant'], r['agents']))
json.dump(rows, open(OUT, 'w'), indent=1)
print(len(rows), 'runs ->', OUT)
