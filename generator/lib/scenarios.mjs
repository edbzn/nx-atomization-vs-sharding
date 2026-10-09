// Abstract test scenarios for the domain-lib components, with a simulation of the component
// logic so every generated assertion is correct by construction. Emitters (Cypress CT,
// Vitest/RTL) turn a plan into code. `size` drives how many steps a scenario has.

import {
  PAGE_SIZE,
  WORDS,
  emailFor,
  filterRows,
  makeRows,
  personName,
  pickQuery,
  showingText,
  sortRows,
  words,
} from './domain.mjs';

// ---------------------------------------------------------------- validation mirror
export const FORM_RULES = {
  name: { label: 'Name', required: true, minLength: 3, maxLength: 60 },
  email: { label: 'Email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, patternMessage: 'Enter a valid email address' },
  category: { label: 'Category', required: true },
  amount: { label: 'Amount', required: true, min: 1, max: 100000 },
  notes: { label: 'Notes', maxLength: 200 },
};

export function validateField(raw, rule) {
  const value = raw == null ? '' : String(raw).trim();
  if (rule.required && value.length === 0) return `${rule.label} is required`;
  if (value.length === 0) return undefined;
  if (rule.minLength !== undefined && value.length < rule.minLength) return `${rule.label} must be at least ${rule.minLength} characters`;
  if (rule.maxLength !== undefined && value.length > rule.maxLength) return `${rule.label} must be at most ${rule.maxLength} characters`;
  if (rule.pattern && !rule.pattern.test(value)) return rule.patternMessage ?? `${rule.label} is invalid`;
  if (rule.min !== undefined || rule.max !== undefined) {
    const n = Number(value);
    if (Number.isNaN(n) || (rule.min !== undefined && n < rule.min) || (rule.max !== undefined && n > rule.max)) {
      return `${rule.label} must be between ${rule.min ?? '-inf'} and ${rule.max ?? 'inf'}`;
    }
  }
  return undefined;
}

export function validateAll(values, rules) {
  const errors = {};
  for (const key of Object.keys(rules)) {
    const m = validateField(values[key], rules[key]);
    if (m) errors[key] = m;
  }
  return errors;
}

export function normalizeTag(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, '-');
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

// ---------------------------------------------------------------- table
export function planTable(rng, domain, size, fixture) {
  // Rows come from the spec-level fixture (shared by all blocks of a file) when given.
  const rowCount = Math.min(fixture ? fixture.length : Infinity, 11 + size * 2 + rng.int(0, 6));
  const rows = fixture ? fixture.slice(0, rowCount) : makeRows(rng, domain, rowCount, rng.int(0, 400));
  const st = { query: '', sort: null, page: 0 };
  const view = () => {
    let list = filterRows(rows, st.query);
    if (st.sort) list = sortRows(list, st.sort.key, st.sort.dir);
    const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const page = Math.min(st.page, pageCount - 1);
    const visible = list.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    return { total: list.length, page, pageCount, visible: visible.length, firstId: visible[0]?.id, status: showingText(list.length, page) };
  };
  const steps = [{ op: 'initial', expect: view() }];
  const headers = [
    { header: 'Amount', key: 'amount' },
    { header: 'Reference', key: 'id' },
    { header: 'Name', key: 'name' },
  ];
  for (let i = 0; i < size; i++) {
    const v = view();
    const r = rng.next();
    if (r < 0.4) {
      const q = rng.bool(0.15) ? '' : pickQuery(rng, rows, domain);
      // clear() on an empty input fires no change event, so the page only resets on a change
      if (q || st.query) st.page = 0;
      st.query = q;
      steps.push({ op: q ? 'filter' : 'clearFilter', q, expect: view() });
    } else if (r < 0.65) {
      const h = rng.pick(headers);
      st.sort = st.sort && st.sort.key === h.key ? { key: h.key, dir: st.sort.dir === 'asc' ? 'desc' : 'asc' } : { key: h.key, dir: 'asc' };
      st.page = 0;
      steps.push({ op: 'sort', header: h.header, expect: view() });
    } else if (v.page < v.pageCount - 1 && r < 0.9) {
      st.page = v.page + 1;
      steps.push({ op: 'next', expect: view() });
    } else if (v.page > 0) {
      st.page = v.page - 1;
      steps.push({ op: 'prev', expect: view() });
    } else {
      if (st.query) st.page = 0;
      st.query = '';
      steps.push({ op: 'clearFilter', q: '', expect: view() });
    }
  }
  return { kind: 'table', rows, rowCount, fixtureLength: fixture?.length, steps, title: `filters, sorts and pages through ${rowCount} ${domain.plural.toLowerCase()}` };
}

// ---------------------------------------------------------------- form
function validFormValue(rng, field, domain) {
  switch (field) {
    case 'name':
      return rng.bool(0.5) ? personName(rng) : `${rng.pick(domain.adjectives)} ${rng.pick(domain.nouns)} ${rng.int(2, 99)}`;
    case 'email':
      return emailFor(personName(rng), rng);
    case 'amount':
      return String(rng.int(1, 100000));
    case 'notes':
      return words(rng, rng.int(3, 14));
    default:
      throw new Error(field);
  }
}

function invalidFormValue(rng, field) {
  switch (field) {
    case 'name':
      return rng.bool() ? rng.pick(['Ab', 'Jo', 'X']) : 'N'.repeat(61);
    case 'email':
      return rng.pick(['not-an-email', 'jane@example', 'a@b.c', 'missing.at.example.com']);
    case 'amount':
      return rng.pick(['0', '250000', 'abc', '-5']);
    case 'notes':
      return words(rng, 40).slice(0, 201).padEnd(201, 'x');
    default:
      throw new Error(field);
  }
}

export function planForm(rng, domain, size) {
  const values = { name: '', email: '', category: '', amount: '', notes: '' };
  let errors = {};
  let calls = 0;
  const steps = [];
  const submit = () => {
    errors = validateAll(values, FORM_RULES);
    const errorList = Object.values(errors);
    if (errorList.length === 0) {
      calls++;
      steps.push({ op: 'submit', ok: true, calls, result: { ...values, amount: Number(values.amount) } });
    } else {
      steps.push({ op: 'submit', ok: false, errors: { ...errors }, summary: pluralize(errorList.length, 'error'), calls });
    }
  };
  // useForm only re-validates a field while it has an error, on every change event:
  // clear() fires one change (if non-empty), typing fires one per character.
  const change = (field, value) => {
    values[field] = value;
    if (errors[field]) {
      const m = validateField(value, FORM_RULES[field]);
      if (m) errors[field] = m;
      else delete errors[field];
    }
  };
  const edit = (field, value) => {
    if (field === 'category') change(field, value);
    else {
      if (values[field] !== '') change(field, '');
      for (let i = 1; i <= value.length; i++) change(field, value.slice(0, i));
    }
    const step = field === 'category' ? { op: 'select', field, value } : { op: 'type', field, value };
    step.error = errors[field];
    steps.push(step);
  };
  if (rng.bool(0.8)) submit();
  const textFields = ['name', 'email', 'amount', 'notes'];
  // `size` rounds of edits; every round fixes or breaks a field, every few rounds submit.
  for (let i = 0; i < size; i++) {
    const field = rng.pick([...textFields, 'category']);
    if (field === 'category') edit('category', rng.pick(domain.categories));
    else if (rng.bool(0.35)) edit(field, invalidFormValue(rng, field));
    else edit(field, validFormValue(rng, field, domain));
    if (rng.bool(0.3)) submit();
  }
  // finish with a valid submission
  for (const f of textFields) {
    if (validateField(values[f], FORM_RULES[f]) || (f !== 'notes' && !values[f])) edit(f, validFormValue(rng, f, domain));
  }
  if (!values.category) edit('category', rng.pick(domain.categories));
  submit();
  return { kind: 'form', steps, title: `validates and saves a ${domain.entity.toLowerCase()} (${steps.length} interactions)` };
}

// ---------------------------------------------------------------- tags
function tagInput(rng, existing) {
  const r = rng.next();
  if (existing.length && r < 0.2) {
    // duplicate, possibly with different casing / whitespace
    const t = rng.pick(existing);
    return rng.bool() ? t.toUpperCase() : `  ${t} `;
  }
  if (r < 0.35) return `${rng.pick(WORDS)} ${rng.pick(WORDS)}`;
  if (r < 0.45) return rng.pick(WORDS).toUpperCase();
  return `${rng.pick(WORDS)}${rng.bool(0.4) ? rng.int(1, 99) : ''}`;
}

export function simulateTags(rng, size, initialTags = [], max = 40) {
  let tags = initialTags.slice();
  let commits = 0;
  const steps = [];
  for (let i = 0; i < size; i++) {
    if (tags.length > 2 && rng.bool(0.18)) {
      const tag = rng.pick(tags);
      tags = tags.filter((t) => t !== tag);
      commits++;
      steps.push({ op: 'remove', tag, count: pluralize(tags.length, 'tag'), length: tags.length, message: undefined });
      continue;
    }
    const text = tagInput(rng, tags);
    const tag = normalizeTag(text);
    let message;
    if (tags.includes(tag)) message = `"${tag}" is already added`;
    else if (tags.length >= max) message = `At most ${max} tags`;
    else {
      tags = [...tags, tag];
      commits++;
    }
    steps.push({ op: 'add', text, count: pluralize(tags.length, 'tag'), length: tags.length, message });
  }
  return { steps, tags, commits };
}

export function planTags(rng, domain, size) {
  const sim = simulateTags(rng, size);
  return { kind: 'tags', ...sim, title: `edits a list of ${sim.steps.length} tag operations` };
}

// ---------------------------------------------------------------- wizard
export function planWizard(rng, domain, size) {
  const name = rng.bool() ? personName(rng) : `${rng.pick(domain.adjectives)} ${rng.pick(domain.nouns)}`;
  const category = rng.pick(domain.categories);
  const invalidFirst = rng.bool(0.6);
  const shortName = invalidFirst && rng.bool(0.5);
  const tagSim = simulateTags(rng, Math.max(1, size));
  const backAndForth = rng.bool(0.5);
  return {
    kind: 'wizard',
    name,
    category,
    invalidFirst,
    shortName,
    tagSteps: tagSim.steps,
    tags: tagSim.tags,
    backAndForth,
    title: `creates a ${domain.entity.toLowerCase()} in three steps with ${tagSim.tags.length} tags`,
  };
}

// ---------------------------------------------------------------- board
const MOVES = {
  todo: [{ verb: 'Start', to: 'doing' }],
  doing: [
    { verb: 'Finish', to: 'done' },
    { verb: 'Pause', to: 'todo' },
  ],
  done: [{ verb: 'Reopen', to: 'todo' }],
};

export function planBoard(rng, domain, size) {
  let cards = [];
  let filter = '';
  let message;
  const steps = [];
  const view = () => {
    const q = filter.trim().toLowerCase();
    const vis = q ? cards.filter((c) => c.title.toLowerCase().includes(q)) : cards;
    return {
      todo: vis.filter((c) => c.status === 'todo').length,
      doing: vis.filter((c) => c.status === 'doing').length,
      done: vis.filter((c) => c.status === 'done').length,
      summary: `${cards.filter((c) => c.status === 'done').length} of ${cards.length} done`,
      message,
      visible: vis,
    };
  };
  const newTitle = () => `${rng.pick(['Review', 'Draft', 'Ship', 'Fix', 'Plan', 'Test', 'Archive', 'Price', 'Label', 'Audit'])} ${rng.pick(domain.nouns).toLowerCase()} ${rng.pick(WORDS)}`;
  for (let i = 0; i < size; i++) {
    const v = view();
    const r = rng.next();
    if (cards.length < 2 || r < 0.35) {
      let title = cards.length && rng.bool(0.12) ? rng.pick(cards).title.toUpperCase() : newTitle();
      const trimmed = title.trim();
      if (cards.some((c) => c.title.toLowerCase() === trimmed.toLowerCase())) message = `"${trimmed}" already exists`;
      else {
        message = undefined;
        cards.push({ id: cards.length + 1000, title: trimmed, status: 'todo' });
      }
      steps.push({ op: 'add', title, expect: view() });
    } else if (r < 0.75 && v.visible.length) {
      const card = rng.pick(v.visible);
      const m = rng.pick(MOVES[card.status]);
      card.status = m.to;
      steps.push({ op: 'move', verb: m.verb, title: card.title, expect: view() });
    } else if (r < 0.85 && v.visible.length) {
      const card = rng.pick(v.visible);
      cards = cards.filter((c) => c !== card);
      steps.push({ op: 'delete', title: card.title, expect: view() });
    } else {
      filter = filter || !cards.length ? '' : rng.pick(cards).title.split(' ')[rng.int(0, 2)].slice(0, 4);
      steps.push({ op: filter ? 'filter' : 'clearFilter', q: filter, expect: view() });
    }
  }
  return { kind: 'board', steps, title: `moves ${cards.length} cards across the board` };
}

export const PLANNERS = { table: planTable, form: planForm, tags: planTags, wizard: planWizard, board: planBoard };
