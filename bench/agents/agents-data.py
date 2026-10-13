"""Valid Nx Agents results -> the blog's data/agents.json. Usage: agents-data.py"""
import glob, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.expanduser('~/work/edbzn.dev.worktrees/nx-atomization-vs-sharding/content/blog/nx-atomization-vs-sharding/data/agents.json')
rows = []
for f in sorted(glob.glob(f'{HERE}/../../results/agents/results/*.json')):
    if '-slow-' in f:
        continue  # agents-slow-data.py
    r = json.load(open(f))
    if r.get('conclusion') != 'success' or not r.get('testsS'):
        continue
    setup, size = r['workspace'].split('-')
    rows.append({'size': int(size), 'variant': setup, 'agents': r['agents'], 'tests_s': round(r['testsS'], 1),
                 'boot_s': round(r['startToReadyS'], 1), 'total_s': round(r['totalS'], 1),
                 'agent_min': round(r['agents'] * r['totalS'] / 60, 1), 'run': r['githubRunId']})
rows.sort(key=lambda r: (r['size'], r['variant'], r['agents']))
json.dump(rows, open(OUT, 'w'), indent=1)
print(len(rows), 'runs ->', OUT)
