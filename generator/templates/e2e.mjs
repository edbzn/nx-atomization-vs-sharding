// Playwright e2e projects (apps/<app>-e2e): config + spec files. Scenarios simulate the app
// so assertions are correct by construction; each emitted test reports its work counts
// (tests, page loads, actions, assertions, typed chars) for the runtime cost model.

import {
  PAGE_SIZE,
  WORDS,
  emailFor,
  filterRows,
  formatMoney,
  orderReference,
  personName,
  pickQuery,
  showingText,
  sortRows,
  tsString,
} from '../lib/domain.mjs';
import { pluralize, validateAll, validateField } from '../lib/scenarios.mjs';
import { CHECKOUT_RULES, DELIVERY, DELIVERY_FEES, LANGUAGES, NOTIFICATIONS, VISIBILITY } from './app.mjs';
import { estimate } from '../lib/cost.mjs';

const q = tsString;
const re = (s) => `/^${s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}/`;

class Test {
  constructor(title) {
    this.title = title;
    this.lines = [];
    this.cost = { tests: 1, gotos: 0, actions: 0, asserts: 0, chars: 0 };
  }
  add(line, c = {}) {
    this.lines.push(`  ${line}`);
    for (const [k, v] of Object.entries(c)) this.cost[k] += v;
  }
  code() {
    return `test(${q(this.title)}, async ({ page }) => {\n${this.lines.join('\n')}\n});\n`;
  }
}

const nav = (label) => `page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: ${label} })`;

// ------------------------------------------------------------------ catalog
function catalogTest(rng, ctx, size) {
  const { rows, domain } = ctx;
  const t = new Test(`filters, sorts and pages the ${domain.plural.toLowerCase()} catalog (${size} steps)`);
  t.add(`await page.goto('/catalog');`, { gotos: 1 });
  t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText(${q(domain.plural)});`, { asserts: 1 });
  t.add(`const filter = page.getByRole('searchbox', { name: 'Filter' });`);
  const st = { query: '', sort: null, page: 0 };
  const view = () => {
    let list = filterRows(rows, st.query);
    if (st.sort) list = sortRows(list, st.sort.key, st.sort.dir);
    const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const page = Math.min(st.page, pageCount - 1);
    const visible = list.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    return { page, pageCount, visible, status: showingText(list.length, page) };
  };
  const headers = [
    { header: 'Price', key: 'amount' },
    { header: 'Reference', key: 'id' },
    { header: 'Name', key: 'name' },
  ];
  for (let i = 0; i < size; i++) {
    const v = view();
    const r = rng.next();
    let showFirst = true;
    if (r < 0.4) {
      const nextQuery = pickQuery(rng, rows, domain);
      // fill() with the current value may fire no change event: type it again instead
      const typed = nextQuery === st.query || rng.bool(0.3);
      st.page = 0;
      st.query = nextQuery;
      if (typed) {
        t.add(`await filter.clear();`, { actions: 1 });
        t.add(`await filter.pressSequentially(${q(st.query)});`, { actions: 1, chars: st.query.length });
      }
      else t.add(`await filter.fill(${q(st.query)});`, { actions: 1 });
      showFirst = false;
    } else if (r < 0.65) {
      const h = rng.pick(headers);
      st.sort = st.sort && st.sort.key === h.key ? { key: h.key, dir: st.sort.dir === 'asc' ? 'desc' : 'asc' } : { key: h.key, dir: 'asc' };
      st.page = 0;
      t.add(`await page.getByRole('button', { name: ${re(h.header)} }).click();`, { actions: 1 });
    } else if (v.page < v.pageCount - 1) {
      st.page = v.page + 1;
      t.add(`await page.getByRole('button', { name: 'Next' }).click();`, { actions: 1 });
    } else {
      if (st.query) st.page = 0;
      st.query = '';
      t.add(`await filter.clear();`, { actions: 1 });
    }
    const e = view();
    t.add(`await expect(page.getByTestId('table-status')).toHaveText(${q(e.status)});`, { asserts: 1 });
    t.add(`await expect(page.getByTestId('row')).toHaveCount(${e.visible.length});`, { asserts: 1 });
    if (showFirst && e.visible[0]) t.add(`await expect(page.getByTestId('row').first()).toContainText(${q(e.visible[0].id)});`, { asserts: 1 });
  }
  const e = view();
  if (e.visible.length && rng.bool(0.6)) {
    const row = rng.pick(e.visible);
    t.add(`await page.getByTestId('row').filter({ hasText: ${q(row.id)} }).click();`, { actions: 1 });
    t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText(${q(row.name)});`, { asserts: 1 });
    t.add(`await expect(page.getByTestId('detail-price')).toHaveText(${q(formatMoney(row.amount))});`, { asserts: 1 });
  }
  return t;
}

// ------------------------------------------------------------------ cart helpers
function addItemsViaCatalog(rng, t, ctx, count, cart) {
  const { rows, domain } = ctx;
  for (let i = 0; i < count; i++) {
    const item = rng.pick(rows);
    const qty = rng.int(1, 6);
    t.add(`await ${nav(q(domain.plural))}.click();`, { actions: 1 });
    t.add(`await page.getByRole('searchbox', { name: 'Filter' }).fill(${q(item.id)});`, { actions: 1 });
    t.add(`await expect(page.getByTestId('row')).toHaveCount(1);`, { asserts: 1 });
    t.add(`await page.getByTestId('row').first().click();`, { actions: 1 });
    t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText(${q(item.name)});`, { asserts: 1 });
    for (let k = 1; k < qty; k++) t.add(`await page.getByRole('button', { name: 'Increase quantity' }).click();`, { actions: 1 });
    t.add(`await expect(page.getByTestId('quantity')).toHaveText('${qty}');`, { asserts: 1 });
    t.add(`await page.getByRole('button', { name: 'Add to cart' }).click();`, { actions: 1 });
    t.add(`await expect(page.getByRole('status').last()).toHaveText(${q(`Added ${qty} × ${item.name}`)});`, { asserts: 1 });
    const line = cart.find((l) => l.item.id === item.id);
    if (line) line.qty += qty;
    else cart.push({ item, qty });
    const n = cart.reduce((s, l) => s + l.qty, 0);
    t.add(`await expect(${nav(re('Cart'))}).toHaveText('Cart (${n})');`, { asserts: 1 });
  }
}

function cartTest(rng, ctx, size) {
  const items = Math.max(1, Math.ceil(size / 2));
  const t = new Test(`adds ${items} ${ctx.domain.plural.toLowerCase()} to the cart and updates totals`);
  t.add(`await page.goto('/');`, { gotos: 1 });
  t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText(${q(ctx.title)});`, { asserts: 1 });
  const cart = [];
  addItemsViaCatalog(rng, t, ctx, items, cart);
  const verify = () => {
    t.add(`await expect(page.getByTestId('cart-line')).toHaveCount(${cart.length});`, { asserts: 1 });
    cart.forEach((l, i) => {
      t.add(`await expect(page.getByTestId('line-quantity').nth(${i})).toHaveText('${l.qty}');`, { asserts: 1 });
      t.add(`await expect(page.getByTestId('line-total').nth(${i})).toHaveText(${q(formatMoney(l.qty * l.item.amount))});`, { asserts: 1 });
    });
    const subtotal = cart.reduce((s, l) => s + l.qty * l.item.amount, 0);
    t.add(`await expect(page.getByTestId('cart-subtotal')).toHaveText(${q(`Subtotal: ${formatMoney(subtotal)}`)});`, { asserts: 1 });
  };
  t.add(`await ${nav(re('Cart'))}.click();`, { actions: 1 });
  verify();
  if (cart.length > 1 && rng.bool(0.6)) {
    const victim = rng.pick(cart);
    cart.splice(cart.indexOf(victim), 1);
    t.add(`await page.getByRole('button', { name: ${q(`Remove ${victim.item.id}`)} }).click();`, { actions: 1 });
    verify();
  }
  return t;
}

// ------------------------------------------------------------------ checkout
function checkoutValue(rng, field, valid) {
  if (!valid) {
    return {
      fullName: rng.pick(['Al', 'Jo']),
      email: rng.pick(['not-an-email', 'jane@example', 'a@b.c']),
      address: rng.pick(['Rd', 'Main']),
      postalCode: rng.pick(['90', '12345', 'abcd']),
    }[field];
  }
  switch (field) {
    case 'fullName':
      return personName(rng);
    case 'email':
      return emailFor(personName(rng), rng);
    case 'address':
      return `${rng.pick(WORDS)}straat ${rng.int(1, 250)}`.replace(/^./, (c) => c.toUpperCase());
    case 'city':
      return rng.pick(['Gent', 'Antwerpen', 'Leuven', 'Brugge', 'Namur', 'Liège', 'Mechelen', 'Hasselt']);
    case 'postalCode':
      return String(rng.int(1000, 9999));
    default:
      throw new Error(field);
  }
}

function checkoutTest(rng, ctx, size) {
  const withItems = rng.bool(0.5);
  const t = new Test(`validates the checkout form and places an order${withItems ? ' with items' : ''} (${size} edits)`);
  const cart = [];
  if (withItems) {
    t.add(`await page.goto('/catalog');`, { gotos: 1 });
    addItemsViaCatalog(rng, t, ctx, rng.int(1, 2), cart);
    t.add(`await ${nav(re('Cart'))}.click();`, { actions: 1 });
    t.add(`await page.getByRole('link', { name: 'Proceed to checkout' }).click();`, { actions: 1 });
  } else {
    t.add(`await page.goto('/checkout');`, { gotos: 1 });
  }
  t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText('Checkout');`, { asserts: 1 });
  const items = cart.reduce((s, l) => s + l.qty, 0);
  const subtotal = cart.reduce((s, l) => s + l.qty * l.item.amount, 0);
  const values = { fullName: '', email: '', address: '', city: '', postalCode: '', delivery: '', terms: '' };
  let errors = {};
  const submit = () => {
    t.add(`await page.getByRole('button', { name: 'Place order' }).click();`, { actions: 1 });
    errors = validateAll(values, CHECKOUT_RULES);
    const n = Object.keys(errors).length;
    if (n) {
      t.add(`await expect(page.getByTestId('error-summary')).toHaveText(${q(pluralize(n, 'error'))});`, { asserts: 1 });
      t.add(`await expect(page.getByRole('alert')).toHaveCount(${n});`, { asserts: 1 });
    }
    return n === 0;
  };
  const labels = { fullName: 'Full name', email: 'Email', address: 'Address', city: 'City', postalCode: 'Postal code' };
  // useForm re-validates a field on change only while it has an error: fill() is one change
  // event, clear() + pressSequentially() is one per character.
  const change = (field, value) => {
    if (values[field] === value) return;
    values[field] = value;
    if (errors[field]) {
      const m = validateField(value, CHECKOUT_RULES[field]);
      if (m) errors[field] = m;
      else delete errors[field];
    }
  };
  const edit = (field, value) => {
    const typed = field !== 'delivery' && field !== 'terms' && rng.bool(0.35);
    if (typed) {
      change(field, '');
      for (let i = 1; i <= value.length; i++) change(field, value.slice(0, i));
    } else change(field, value);
    if (field === 'delivery') t.add(`await page.getByRole('combobox', { name: 'Delivery' }).selectOption(${q(value)});`, { actions: 1 });
    else if (field === 'terms') t.add(`await page.getByRole('checkbox', { name: 'I accept the terms' }).${value ? 'check' : 'uncheck'}();`, { actions: 1 });
    else {
      const loc = `page.getByRole('textbox', { name: ${q(labels[field])}, exact: true })`;
      if (typed) {
        t.add(`await ${loc}.clear();`, { actions: 1 });
        t.add(`await ${loc}.pressSequentially(${q(value)});`, { actions: 1, chars: value.length });
      } else t.add(`await ${loc}.fill(${q(value)});`, { actions: 1 });
      if (errors[field]) t.add(`await expect(${loc}).toHaveAccessibleDescription(${q(errors[field])});`, { asserts: 1 });
      else t.add(`await expect(${loc}).not.toHaveAttribute('aria-invalid');`, { asserts: 1 });
    }
  };
  if (rng.bool(0.85)) submit();
  const textFields = ['fullName', 'email', 'address', 'city', 'postalCode'];
  for (let i = 0; i < size; i++) {
    const f = rng.pick(textFields);
    edit(f, checkoutValue(rng, f, f === 'city' || rng.bool(0.65)));
    if (rng.bool(0.15)) submit();
  }
  for (const f of textFields) if (validateField(values[f], CHECKOUT_RULES[f])) edit(f, checkoutValue(rng, f, true));
  const delivery = rng.pick(DELIVERY);
  edit('delivery', delivery);
  edit('terms', 'accepted');
  submit();
  t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText(${q(`Thank you, ${values.fullName}`)});`, { asserts: 1 });
  t.add(`await expect(page.getByTestId('order-reference')).toHaveText(${q(orderReference(`${values.fullName}|${values.email}|${values.postalCode}`))});`, { asserts: 1 });
  t.add(`await expect(page.getByTestId('order-total')).toHaveText(${q(`${pluralize(items, 'item')} · ${formatMoney(subtotal + DELIVERY_FEES[delivery])}`)});`, { asserts: 1 });
  return t;
}

// ------------------------------------------------------------------ board
const NEXT = { todo: { verb: 'Start', to: 'doing' }, doing: { verb: 'Finish', to: 'done' }, done: { verb: 'Reopen', to: 'todo' } };

function boardTest(rng, ctx, size) {
  const t = new Test(`plans work on the board and keeps it after a reload (${size} steps)`);
  t.add(`await page.goto('/board');`, { gotos: 1 });
  t.add(`const newCard = page.getByRole('textbox', { name: 'New card' });`);
  t.add(`const filter = page.getByRole('searchbox', { name: 'Filter cards' });`);
  t.add(`const cardsIn = (column: string) => page.getByRole('region', { name: column }).getByTestId('card');`);
  let cards = [];
  let filter = '';
  const used = new Set();
  const counts = (all = false) => {
    const qy = all ? '' : filter.toLowerCase();
    const vis = qy ? cards.filter((c) => c.title.toLowerCase().includes(qy)) : cards;
    return { vis, todo: vis.filter((c) => c.status === 'todo').length, doing: vis.filter((c) => c.status === 'doing').length, done: vis.filter((c) => c.status === 'done').length };
  };
  const expectCounts = (c) => {
    t.add(`await expect(cardsIn('To do')).toHaveCount(${c.todo});`, { asserts: 1 });
    t.add(`await expect(cardsIn('In progress')).toHaveCount(${c.doing});`, { asserts: 1 });
    t.add(`await expect(cardsIn('Done')).toHaveCount(${c.done});`, { asserts: 1 });
    t.add(`await expect(page.getByTestId('board-summary')).toHaveText(${q(`${cards.filter((x) => x.status === 'done').length} of ${cards.length} done`)});`, { asserts: 1 });
  };
  for (let i = 0; i < size; i++) {
    const c = counts();
    const r = rng.next();
    if (cards.length < 2 || r < 0.4) {
      let title;
      do title = `${rng.pick(['Call', 'Email', 'Quote', 'Ship', 'Count', 'Check', 'Restock', 'Invoice'])} ${rng.pick(ctx.domain.nouns).toLowerCase()} ${rng.pick(WORDS)}`;
      while (used.has(title));
      used.add(title);
      cards.push({ title, status: 'todo' });
      if (rng.bool(0.3)) t.add(`await newCard.pressSequentially(${q(title)});`, { actions: 1, chars: title.length });
      else t.add(`await newCard.fill(${q(title)});`, { actions: 1 });
      t.add(`await newCard.press('Enter');`, { actions: 1 });
    } else if (r < 0.8 && c.vis.length) {
      const card = rng.pick(c.vis);
      const m = NEXT[card.status];
      card.status = m.to;
      t.add(`await page.getByRole('button', { name: ${q(`${m.verb} ${card.title}`)} }).click();`, { actions: 1 });
    } else if (r < 0.88 && c.vis.length) {
      const card = rng.pick(c.vis);
      cards = cards.filter((x) => x !== card);
      t.add(`await page.getByRole('button', { name: ${q(`Delete ${card.title}`)} }).click();`, { actions: 1 });
    } else {
      filter = filter ? '' : rng.pick(cards).title.split(' ')[rng.int(0, 2)].slice(0, 4);
      t.add(filter ? `await filter.fill(${q(filter)});` : `await filter.clear();`, { actions: 1 });
    }
    if (i % 2 === 1 || i === size - 1) expectCounts(counts());
  }
  t.add(`await page.reload();`, { gotos: 1 });
  filter = '';
  expectCounts(counts(true));
  return t;
}

// ------------------------------------------------------------------ settings
function settingsTest(rng, ctx, size) {
  const t = new Test(`updates and persists settings (${size} changes)`);
  t.add(`await page.goto('/settings');`, { gotos: 1 });
  t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');`, { asserts: 1 });
  const s = { displayName: '', language: 'English', notifications: { 'Order updates': true, 'Weekly digest': false, 'Product news': false }, visibility: 'Team', searchable: true };
  let tab = 'Profile';
  const goTab = (name) => {
    if (tab !== name) {
      t.add(`await page.getByRole('tab', { name: ${q(name)} }).click();`, { actions: 1 });
      tab = name;
    }
  };
  for (let i = 0; i < size; i++) {
    const r = rng.int(0, 4);
    if (r === 0) {
      goTab('Profile');
      s.displayName = personName(rng);
      t.add(`await page.getByRole('textbox', { name: 'Display name' }).fill(${q(s.displayName)});`, { actions: 1 });
    } else if (r === 1) {
      goTab('Profile');
      s.language = rng.pick(LANGUAGES);
      t.add(`await page.getByRole('combobox', { name: 'Language' }).selectOption(${q(s.language)});`, { actions: 1 });
    } else if (r === 2) {
      goTab('Notifications');
      const n = rng.pick(NOTIFICATIONS);
      s.notifications[n] = !s.notifications[n];
      t.add(`await page.getByRole('checkbox', { name: ${q(n)} }).${s.notifications[n] ? 'check' : 'uncheck'}();`, { actions: 1 });
    } else if (r === 3) {
      goTab('Privacy');
      s.visibility = rng.pick(VISIBILITY);
      t.add(`await page.getByRole('combobox', { name: 'Profile visibility' }).selectOption(${q(s.visibility)});`, { actions: 1 });
    } else {
      goTab('Privacy');
      s.searchable = !s.searchable;
      t.add(`await page.getByRole('checkbox', { name: 'Show me in search' }).${s.searchable ? 'check' : 'uncheck'}();`, { actions: 1 });
    }
  }
  t.add(`await page.getByRole('button', { name: 'Save settings' }).click();`, { actions: 1 });
  t.add(`await expect(page.getByRole('status').last()).toHaveText('Settings saved');`, { asserts: 1 });
  t.add(`await page.reload();`, { gotos: 1 });
  t.add(`await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveValue(${q(s.displayName)});`, { asserts: 1 });
  t.add(`await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue(${q(s.language)});`, { asserts: 1 });
  t.add(`await page.getByRole('tab', { name: 'Notifications' }).click();`, { actions: 1 });
  for (const n of NOTIFICATIONS) t.add(`await expect(page.getByRole('checkbox', { name: ${q(n)} })).${s.notifications[n] ? 'toBeChecked' : 'not.toBeChecked'}();`, { asserts: 1 });
  t.add(`await page.getByRole('tab', { name: 'Privacy' }).click();`, { actions: 1 });
  t.add(`await expect(page.getByRole('combobox', { name: 'Profile visibility' })).toHaveValue(${q(s.visibility)});`, { asserts: 1 });
  t.add(`await expect(page.getByRole('checkbox', { name: 'Show me in search' })).${s.searchable ? 'toBeChecked' : 'not.toBeChecked'}();`, { asserts: 1 });
  return t;
}

// ------------------------------------------------------------------ navigation
function navigationTest(rng, ctx, size) {
  const t = new Test(`navigates between pages (${size} hops)`);
  t.add(`await page.goto('/');`, { gotos: 1 });
  t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText(${q(ctx.title)});`, { asserts: 1 });
  t.add(`await expect(page.getByTestId('catalog-size')).toHaveText(${q(`${ctx.rows.length} ${ctx.domain.plural.toLowerCase()}`)});`, { asserts: 1 });
  const links = [
    { name: q('Home'), heading: ctx.title, path: '/' },
    { name: q(ctx.domain.plural), heading: ctx.domain.plural, path: '/catalog' },
    { name: re('Cart'), heading: 'Cart', path: '/cart' },
    { name: q('Board'), heading: 'Board', path: '/board' },
    { name: q('Settings'), heading: 'Settings', path: '/settings' },
  ];
  const history = [links[0]];
  for (let i = 0; i < size; i++) {
    if (history.length > 1 && rng.bool(0.25)) {
      history.pop();
      const back = history[history.length - 1];
      t.add(`await page.goBack();`, { actions: 1 });
      t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText(${q(back.heading)});`, { asserts: 1 });
      continue;
    }
    const l = rng.pick(links);
    t.add(`await ${nav(l.name)}.click();`, { actions: 1 });
    t.add(`await expect(page.getByRole('heading', { level: 1 })).toHaveText(${q(l.heading)});`, { asserts: 1 });
    if (history[history.length - 1].path !== l.path) history.push(l);
  }
  const featured = [...ctx.rows].sort((a, b) => b.amount - a.amount).slice(0, 3);
  const f = rng.pick(featured);
  t.add(`await ${nav(q('Home'))}.click();`, { actions: 1 });
  t.add(`await page.getByRole('link', { name: ${q(f.name)}, exact: true }).first().click();`, { actions: 1 });
  t.add(`await expect(page.getByTestId('detail-id')).toHaveText(${q(f.id)});`, { asserts: 1 });
  return t;
}

const E2E_KINDS = {
  catalog: { gen: catalogTest, topics: ['filtering', 'sorting', 'paging', 'search', 'browse', 'details'] },
  cart: { gen: cartTest, topics: ['add-items', 'quantities', 'totals', 'remove-items', 'merge-lines'] },
  checkout: { gen: checkoutTest, topics: ['validation', 'happy-path', 'delivery', 'with-items', 'errors'] },
  board: { gen: boardTest, topics: ['workflow', 'persistence', 'filtering', 'cleanup'] },
  settings: { gen: settingsTest, topics: ['profile', 'notifications', 'privacy', 'persistence'] },
  navigation: { gen: navigationTest, topics: ['smoke', 'menu', 'history', 'featured'] },
};

export function e2eFiles({ app, title, domain, rows, targets, rng, model }) {
  const root = `apps/${app}-e2e`;
  const name = `${app}-e2e`;
  const files = {};
  const json = (o) => JSON.stringify(o, null, 2) + '\n';
  files[`${root}/package.json`] = json({
    name: `@bench/${name}`,
    version: '0.0.0',
    private: true,
    devDependencies: { [`@bench/${app}`]: 'workspace:*' },
  });
  files[`${root}/project.json`] = json({
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    name,
    sourceRoot: `${root}/src`,
    projectType: 'application',
    tags: ['type:e2e', 'runner:playwright'],
    implicitDependencies: [app],
  });
  files[`${root}/tsconfig.json`] = json({ extends: '../../tsconfig.base.json', compilerOptions: { types: ['node'] }, include: ['src/**/*.ts', 'playwright.config.ts'] });
  files[`${root}/playwright.config.ts`] = `import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const ci = !!process.env.CI;
const appRoot = join(__dirname, '../${app}');

/**
 * Each Playwright run serves the built app on its own free port, so concurrent Nx tasks
 * (plain e2e, atoms or shards of any project) never collide. The port is picked once in the
 * runner's main process (a synchronous helper listens on port 0 and prints the port) and
 * handed to the workers through the environment, since workers re-evaluate this config.
 */
function previewPort(): number {
  const inWorker = process.env.TEST_WORKER_INDEX !== undefined;
  if (inWorker && process.env.E2E_PREVIEW_PORT) return Number(process.env.E2E_PREVIEW_PORT);
  const port = execFileSync(process.execPath, [join(__dirname, '../../tools/free-port.mjs')], { encoding: 'utf8' }).trim();
  process.env.E2E_PREVIEW_PORT = port;
  return Number(port);
}

const port = previewPort();
const baseURL = \`http://127.0.0.1:\${port}\`;

export default defineConfig({
  testDir: './src',
  // Fairness rule: in CI a Playwright process runs one test at a time (1 worker, no
  // fullyParallel, no retries), so Nx --parallel is the only parallelism knob.
  workers: ci ? 1 : undefined,
  fullyParallel: !ci,
  retries: 0,
  forbidOnly: ci,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'off',
    video: 'off',
    screenshot: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Serves the production build (the e2e targets depend on the app's \`build\`).
    command: \`node \${join(__dirname, '../../node_modules/vite/bin/vite.js')} preview --host 127.0.0.1 --port \${port} --strictPort\`,
    cwd: appRoot,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
`;

  const ctx = { rows, domain, title };
  const kinds = rng.shuffle(Object.keys(E2E_KINDS));
  const used = {};
  const specs = [];
  targets.forEach((target, i) => {
    const kind = kinds[i % kinds.length];
    const topics = E2E_KINDS[kind].topics;
    const u = (used[kind] ??= 0);
    used[kind]++;
    const topic = u < topics.length ? topics[u] : `${topics[u % topics.length]}-${Math.floor(u / topics.length) + 1}`;
    const path = `src/${kind}-${topic}.spec.ts`;
    const tests = [];
    let est = estimate(model, { spec: 1 });
    let j = 0;
    while (tests.length === 0 || est < target * 0.97) {
      const remaining = Math.max(target - est, 0.05);
      let size = rng.int(3, 10);
      let test;
      for (let attempt = 0; attempt < 6; attempt++) {
        test = E2E_KINDS[kind].gen(rng.fork(`${path}#${j}.${attempt}`), ctx, size);
        const c = estimate(model, test.cost);
        if (c <= remaining * 1.25 || size === 1) break;
        size = Math.max(1, Math.floor((size * remaining) / c));
      }
      // keep test titles unique within a file
      if (tests.some((x) => x.title === test.title)) test.title = `${test.title} #${tests.length + 1}`;
      tests.push(test);
      est += estimate(model, test.cost);
      if (++j > 200) throw new Error(`runaway e2e spec ${path}`);
    }
    const cost = tests.reduce((acc, x) => {
      for (const [k, v] of Object.entries(x.cost)) acc[k] = (acc[k] ?? 0) + v;
      return acc;
    }, { spec: 1 });
    const content = `import { expect, test } from '@playwright/test';\n\n${tests.map((x) => x.code()).join('\n')}`;
    files[`${root}/${path}`] = content;
    specs.push({ path, kind, target, estimate: est, cost });
  });
  return { root, name, files, specs };
}
