// Discrete-event model of distributed task execution (DTE): K agents x P slots replaying
// measured task durations over the task graph. Pure: no I/O.
//
// Model:
//  - every agent boots for `bootstrapMs` (agents can start work at t = B);
//  - a task is ready when all its dependencies have finished;
//  - a task whose dependency ran on another agent pays `penaltyMs` once (remote-cache
//    restore of that dependency's outputs), added to its duration;
//  - optional per-agent memory cap: a task can only start if the agent's running tasks'
//    peak PSS plus its own fits the cap (an oversized task may still start on an empty agent);
//  - noop tasks (`isNoop`, e.g. atomizer parent targets) complete instantly when their deps
//    are done (`noopMode: 'instant'`, default) or occupy a slot like any task (`'slot'`);
//  - policies:
//      greedy: whenever a slot frees up, the agent pulls the next ready task;
//      batch:  an idle agent pulls up to P ready tasks at once and only pulls again once the
//              whole batch has finished;
//  - ordering of the ready queue: longest-first (historical duration), critical-path
//    (longest remaining path incl. the task), graph-order (topological, stable on task
//    graph order), observed (start time in the measured run - used for validation).

export const ORDERS = ['longest-first', 'critical-path', 'graph-order', 'observed'];
export const POLICIES = ['greedy', 'batch'];

/**
 * @param {{tasks: Array<{id:string,duration:number,peakPssMb?:number,isNoop?:boolean,observedStart?:number}>,
 *          deps: Record<string,string[]>}} input
 * @param {{agents:number, slots:number, policy?:string, order?:string, memCapMb?:number|null,
 *          bootstrapMs?:number, penaltyMs?:number, noopMode?:'instant'|'slot'}} p
 */
export function simulate(input, p) {
  const K = p.agents;
  const P = p.slots;
  const B = p.bootstrapMs ?? 0;
  const D = p.penaltyMs ?? 0;
  const policy = p.policy ?? 'greedy';
  const order = p.order ?? 'longest-first';
  const cap = p.memCapMb ?? null;
  const noopInstant = (p.noopMode ?? 'instant') === 'instant';
  if (!POLICIES.includes(policy)) throw new Error(`unknown policy ${policy}`);
  if (!ORDERS.includes(order)) throw new Error(`unknown order ${order}`);

  const byId = new Map(input.tasks.map((t, i) => [t.id, { ...t, index: i }]));
  const deps = new Map();
  const dependents = new Map();
  for (const t of byId.values()) {
    const d = (input.deps[t.id] ?? []).filter((x) => byId.has(x));
    deps.set(t.id, d);
    for (const x of d) {
      if (!dependents.has(x)) dependents.set(x, []);
      dependents.get(x).push(t.id);
    }
  }

  const prio = priorities(byId, deps, dependents, order);
  const cmp = (a, b) => prio.get(a) - prio.get(b) || byId.get(a).index - byId.get(b).index;

  const remaining = new Map([...byId.keys()].map((id) => [id, deps.get(id).length]));
  const doneAt = new Map();
  const ranOn = new Map(); // id -> Set of agents whose outputs this task (transitively, through noops) carries
  const ready = []; // sorted by cmp
  const insertReady = (id) => {
    let lo = 0;
    let hi = ready.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cmp(ready[mid], id) <= 0) lo = mid + 1;
      else hi = mid;
    }
    ready.splice(lo, 0, id);
  };

  const agents = Array.from({ length: K }, (_, a) => ({
    a,
    slots: Array(P).fill(null), // running task id per slot
    mem: 0,
    peakMem: 0,
    busyMs: 0,
    tasks: 0,
    lastEnd: null,
    batchOpen: 0, // running tasks of the current batch (batch policy)
  }));
  const running = []; // {id, agent, slot, end}
  const gantt = [];
  let penalties = 0;
  let penaltyMsTotal = 0;
  let now = 0;
  let finished = 0;
  const total = byId.size;
  const warnings = new Set();

  const complete = (id, t, agentSet) => {
    doneAt.set(id, t);
    ranOn.set(id, agentSet);
    finished++;
    for (const dep of dependents.get(id) ?? []) {
      const r = remaining.get(dep) - 1;
      remaining.set(dep, r);
      if (r === 0) becomeReady(dep, t);
    }
  };
  const becomeReady = (id, t) => {
    const task = byId.get(id);
    if (task.isNoop && noopInstant) {
      const carried = new Set();
      for (const d of deps.get(id)) for (const a of ranOn.get(d)) carried.add(a);
      complete(id, t, carried);
    } else insertReady(id);
  };
  for (const id of byId.keys()) if (remaining.get(id) === 0) becomeReady(id, 0);

  const mem = (id) => byId.get(id).peakPssMb ?? 0;
  const fits = (ag, id) => {
    if (cap == null) return true;
    const m = mem(id);
    if (m > cap) {
      warnings.add(`task ${id} needs ${Math.round(m)}MB > cap ${cap}MB: runs alone on an empty agent`);
      return ag.mem === 0 && ag.slots.every((s) => s == null);
    }
    return ag.mem + m <= cap;
  };
  const start = (ag, slot, id, t) => {
    const task = byId.get(id);
    const cross = deps.get(id).some((d) => [...ranOn.get(d)].some((a) => a !== ag.a));
    const pen = cross && D > 0 ? D : 0;
    if (pen) {
      penalties++;
      penaltyMsTotal += pen;
    }
    const end = t + pen + task.duration;
    ag.slots[slot] = id;
    ag.mem += mem(id);
    ag.peakMem = Math.max(ag.peakMem, ag.mem);
    ag.busyMs += end - t;
    ag.tasks++;
    running.push({ id, agent: ag.a, slot, end });
    gantt.push({ agent: ag.a, slot, id, start: t, end, penalty: pen });
  };

  const dispatch = (t) => {
    if (t < B) return;
    if (policy === 'greedy') {
      // Walk the ready queue once in priority order; each task goes to the least-loaded agent
      // with a free slot and memory room (capacity only shrinks within one dispatch, so a
      // task skipped for lack of room cannot fit later in the same pass).
      let freeTotal = agents.reduce((s, ag) => s + ag.slots.filter((x) => x == null).length, 0);
      for (let i = 0; i < ready.length && freeTotal > 0; ) {
        const id = ready[i];
        let best = null;
        let bestFree = 0;
        for (const ag of agents) {
          const free = ag.slots.filter((s) => s == null).length;
          if (free > bestFree && fits(ag, id)) {
            best = ag;
            bestFree = free;
          }
        }
        if (best) {
          ready.splice(i, 1);
          start(best, best.slots.indexOf(null), id, t);
          freeTotal--;
        } else i++;
      }
    } else {
      for (const ag of agents) {
        if (ag.batchOpen > 0 || !ready.length) continue;
        let n = 0;
        for (let i = 0; i < ready.length && n < P; ) {
          const id = ready[i];
          if (fits(ag, id)) {
            ready.splice(i, 1);
            start(ag, n, id, t);
            n++;
          } else i++;
        }
        ag.batchOpen = n;
      }
    }
  };

  dispatch(0);
  let guard = 0;
  while (finished < total) {
    if (++guard > 10 * total + 1000) throw new Error('simulation did not converge (cycle in task graph?)');
    let next = Infinity;
    for (const r of running) next = Math.min(next, r.end);
    if (now < B) next = Math.min(next, B);
    if (next === Infinity) {
      if (ready.length) throw new Error(`deadlock: ${ready.length} ready task(s) can never be placed (memory cap too low?)`);
      throw new Error('deadlock: tasks with unsatisfiable dependencies');
    }
    now = next;
    // Complete everything ending now.
    for (let i = running.length - 1; i >= 0; i--) {
      const r = running[i];
      if (r.end !== now) continue;
      running.splice(i, 1);
      const ag = agents[r.agent];
      ag.slots[r.slot] = null;
      ag.mem -= mem(r.id);
      ag.lastEnd = Math.max(ag.lastEnd ?? 0, now);
      if (policy === 'batch') ag.batchOpen--;
      complete(r.id, now, new Set([r.agent]));
    }
    dispatch(now);
  }

  const makespan = Math.max(B, ...[...doneAt.values()]);
  const window = Math.max(0, makespan - B);
  const busyTotal = agents.reduce((s, ag) => s + ag.busyMs, 0);
  return {
    params: { agents: K, slots: P, policy, order, memCapMb: cap, bootstrapMs: B, penaltyMs: D, noopMode: noopInstant ? 'instant' : 'slot' },
    makespanMs: makespan,
    slotUtilisation: window > 0 ? busyTotal / (K * P * window) : null,
    agentMinutes: (K * makespan) / 60000,
    agentMinutesReleased: agents.reduce((s, ag) => s + (ag.lastEnd ?? B), 0) / 60000,
    penalties,
    penaltyMsTotal,
    agents: agents.map((ag) => ({
      agent: ag.a,
      tasks: ag.tasks,
      busyMs: ag.busyMs,
      busyPct: window > 0 ? ag.busyMs / (P * window) : null,
      lastEndMs: ag.lastEnd,
      peakMemMb: Math.round(ag.peakMem),
    })),
    gantt,
    warnings: [...warnings],
  };
}

function priorities(byId, deps, dependents, order) {
  const prio = new Map();
  if (order === 'longest-first') for (const t of byId.values()) prio.set(t.id, -t.duration);
  else if (order === 'observed') for (const t of byId.values()) prio.set(t.id, t.observedStart ?? Infinity);
  else if (order === 'graph-order') {
    // Stable Kahn topological order over the task graph's key order.
    const indeg = new Map([...byId.keys()].map((id) => [id, deps.get(id).length]));
    const queue = [...byId.keys()].filter((id) => indeg.get(id) === 0);
    let i = 0;
    while (queue.length) {
      const id = queue.shift();
      prio.set(id, i++);
      for (const d of dependents.get(id) ?? []) {
        indeg.set(d, indeg.get(d) - 1);
        if (indeg.get(d) === 0) queue.push(d);
      }
    }
  } else {
    // critical-path: bottom level = own duration + longest path through dependents.
    const memo = new Map();
    const bl = (id, seen = new Set()) => {
      if (memo.has(id)) return memo.get(id);
      if (seen.has(id)) return 0;
      seen.add(id);
      let m = 0;
      for (const d of dependents.get(id) ?? []) m = Math.max(m, bl(d, seen));
      const v = byId.get(id).duration + m;
      memo.set(id, v);
      return v;
    };
    for (const id of byId.keys()) prio.set(id, -bl(id));
  }
  return prio;
}

/** Build simulator input from one summary.json (+ its task-graph.json content). */
export function inputFromSummary(summary, taskGraph) {
  const tasks = summary.taskList.map((t) => ({
    id: t.id,
    duration: t.duration,
    peakPssMb: t.peakPssMb ?? 0,
    isNoop: t.isNoop,
    observedStart: t.start,
  }));
  return { tasks, deps: taskGraph?.tasks?.dependencies ?? {} };
}

/** Median-of-reps input from several summaries of the same configuration. */
export function inputFromSummaries(summaries, taskGraph) {
  const acc = new Map();
  for (const s of summaries) {
    for (const t of s.taskList) {
      if (!acc.has(t.id)) acc.set(t.id, { id: t.id, d: [], m: [], st: [], isNoop: t.isNoop });
      const a = acc.get(t.id);
      a.d.push(t.duration);
      a.m.push(t.peakPssMb ?? 0);
      a.st.push(t.start);
    }
  }
  const med = (xs) => {
    const v = [...xs].sort((a, b) => a - b);
    const n = v.length;
    return n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2;
  };
  const tasks = [...acc.values()].map((a) => ({ id: a.id, duration: med(a.d), peakPssMb: med(a.m), isNoop: a.isNoop, observedStart: med(a.st) }));
  return { tasks, deps: taskGraph?.tasks?.dependencies ?? {}, reps: summaries.length };
}
