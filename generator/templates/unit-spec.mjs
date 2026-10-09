// Vitest + React Testing Library emitter: turns scenario plans into `it` blocks and counts
// the work (renders, role queries, user-event actions, typed characters) for the cost model.

import { rowsLiteral, tsString } from '../lib/domain.mjs';

class Block {
  constructor() {
    this.lines = [];
    this.cost = { its: 1, renders: 0, roles: 0, queries: 0, actions: 0, chars: 0, rows: 0 };
  }
  add(line, c = {}) {
    this.lines.push(`    ${line}`);
    for (const [k, v] of Object.entries(c)) this.cost[k] += v;
  }
}

const q = tsString;
const re = (s) => `/^${s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}/`;

function control(field) {
  if (field === 'category') return `screen.getByRole('combobox', { name: 'Category' })`;
  const label = { name: 'Name', email: 'Email', amount: 'Amount', notes: 'Notes' }[field];
  return `screen.getByRole('textbox', { name: ${q(label)} })`;
}

function emitTable(b, plan, names) {
  b.add(plan.rowCount === plan.fixtureLength ? `const rows = ROWS;` : `const rows = ROWS.slice(0, ${plan.rowCount});`, { rows: plan.rows.length });
  b.add(`const user = userEvent.setup();`);
  b.add(`render(<${names.table} rows={rows} />);`, { renders: 1 });
  b.add(`const filter = screen.getByRole('searchbox', { name: 'Filter' });`, { roles: 1 });
  for (const step of plan.steps) {
    const e = step.expect;
    if (step.op === 'filter') {
      b.add(`await user.clear(filter);`, { actions: 1 });
      b.add(`await user.type(filter, ${q(step.q)});`, { actions: 1, chars: step.q.length });
    } else if (step.op === 'clearFilter') b.add(`await user.clear(filter);`, { actions: 1 });
    else if (step.op === 'sort') b.add(`await user.click(screen.getByRole('button', { name: ${re(step.header)} }));`, { actions: 1, roles: 1 });
    else if (step.op === 'next') b.add(`await user.click(screen.getByRole('button', { name: 'Next' }));`, { actions: 1, roles: 1 });
    else if (step.op === 'prev') b.add(`await user.click(screen.getByRole('button', { name: 'Previous' }));`, { actions: 1, roles: 1 });
    b.add(`expect(screen.getByTestId('table-status').textContent).toBe(${q(e.status)});`, { queries: 1 });
    b.add(`expect(screen.queryAllByTestId('row')).toHaveLength(${e.visible});`, { queries: 1 });
    if (e.firstId && step.op !== 'initial' && step.op !== 'filter') {
      b.add(`expect(screen.getAllByTestId('row')[0]).toHaveTextContent(${q(e.firstId)});`, { queries: 1 });
    }
  }
}

function emitFormError(b, field, error) {
  if (error) {
    b.add(`expect(${control(field)}).toHaveAttribute('aria-invalid', 'true');`, { roles: 1 });
    if (field === 'category') b.add(`expect(screen.getByText(${q(error)})).toBeInTheDocument();`, { queries: 1 });
    else b.add(`expect(${control(field)}).toHaveAccessibleDescription(${q(error)});`, { roles: 1 });
  } else {
    b.add(`expect(${control(field)}).not.toHaveAttribute('aria-invalid');`, { roles: 1 });
  }
}

function emitForm(b, plan, names) {
  b.add(`const onSubmit = vi.fn();`);
  b.add(`const user = userEvent.setup();`);
  b.add(`render(<${names.form} onSubmit={onSubmit} />);`, { renders: 1 });
  for (const step of plan.steps) {
    if (step.op === 'submit') {
      b.add(`await user.click(screen.getByRole('button', { name: ${q(names.saveLabel)} }));`, { actions: 1, roles: 1 });
      b.add(`expect(onSubmit).toHaveBeenCalledTimes(${step.calls});`);
      if (step.ok) {
        b.add(`expect(onSubmit).toHaveBeenLastCalledWith(${JSON.stringify(step.result)});`);
        b.add(`expect(screen.queryByTestId('error-summary')).not.toBeInTheDocument();`, { queries: 1 });
      } else {
        b.add(`expect(screen.getByTestId('error-summary').textContent).toBe(${q(step.summary)});`, { queries: 1 });
        for (const msg of Object.values(step.errors)) b.add(`expect(screen.getByText(${q(msg)})).toBeInTheDocument();`, { queries: 1 });
      }
    } else if (step.op === 'select') {
      b.add(`await user.selectOptions(${control('category')}, ${q(step.value)});`, { actions: 1, roles: 1 });
      emitFormError(b, 'category', step.error);
    } else {
      b.add(`await user.clear(${control(step.field)});`, { actions: 1, roles: 1 });
      b.add(`await user.type(${control(step.field)}, ${q(step.value)});`, { actions: 1, roles: 1, chars: step.value.length });
      emitFormError(b, step.field, step.error);
    }
  }
}

function emitTagSteps(b, steps) {
  b.add(`const tagInput = () => screen.getByRole('textbox', { name: 'New tag' });`);
  for (const step of steps) {
    if (step.op === 'add') b.add(`await user.type(tagInput(), ${q(`${step.text}{Enter}`)});`, { actions: 1, roles: 1, chars: step.text.length + 1 });
    else b.add(`await user.click(screen.getByRole('button', { name: ${q(`Remove ${step.tag}`)} }));`, { actions: 1, roles: 1 });
    b.add(`expect(screen.getByTestId('tag-count').textContent).toBe(${q(step.count)});`, { queries: 1 });
    b.add(`expect(screen.queryAllByTestId('tag')).toHaveLength(${step.length});`, { queries: 1 });
    if (step.message) b.add(`expect(screen.getByTestId('tag-message').textContent).toBe(${q(step.message)});`, { queries: 1 });
    else b.add(`expect(screen.queryByTestId('tag-message')).not.toBeInTheDocument();`, { queries: 1 });
  }
}

function emitTags(b, plan) {
  b.add(`const onChange = vi.fn();`);
  b.add(`const user = userEvent.setup();`);
  b.add(`render(<TagEditor onChange={onChange} />);`, { renders: 1 });
  emitTagSteps(b, plan.steps);
  b.add(`expect(onChange).toHaveBeenCalledTimes(${plan.commits});`);
  if (plan.commits > 0) b.add(`expect(onChange).toHaveBeenLastCalledWith(${JSON.stringify(plan.tags)});`);
}

function emitWizard(b, plan, names) {
  b.add(`const onComplete = vi.fn();`);
  b.add(`const user = userEvent.setup();`);
  b.add(`render(<${names.wizard} onComplete={onComplete} />);`, { renders: 1 });
  b.add(`const step = () => screen.getByTestId('wizard-step').textContent;`);
  b.add(`expect(step()).toBe('Step 1 of 3: Details');`, { queries: 1 });
  if (plan.invalidFirst) {
    if (plan.shortName) b.add(`await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Al');`, { actions: 1, roles: 1, chars: 2 });
    b.add(`await user.click(screen.getByRole('button', { name: 'Next' }));`, { actions: 1, roles: 1 });
    b.add(`expect(screen.getByText(${q(plan.shortName ? 'Name must be at least 3 characters' : 'Name is required')})).toBeInTheDocument();`, { queries: 1 });
    b.add(`expect(screen.getByText('Category is required')).toBeInTheDocument();`, { queries: 1 });
    b.add(`expect(step()).toBe('Step 1 of 3: Details');`, { queries: 1 });
  }
  b.add(`await user.clear(screen.getByRole('textbox', { name: 'Name' }));`, { actions: 1, roles: 1 });
  b.add(`await user.type(screen.getByRole('textbox', { name: 'Name' }), ${q(plan.name)});`, { actions: 1, roles: 1, chars: plan.name.length });
  b.add(`await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), ${q(plan.category)});`, { actions: 1, roles: 1 });
  b.add(`await user.click(screen.getByRole('button', { name: 'Next' }));`, { actions: 1, roles: 1 });
  b.add(`expect(step()).toBe('Step 2 of 3: Tags');`, { queries: 1 });
  emitTagSteps(b, plan.tagSteps);
  if (plan.backAndForth) {
    b.add(`await user.click(screen.getByRole('button', { name: 'Back' }));`, { actions: 1, roles: 1 });
    b.add(`expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(${q(plan.name)});`, { roles: 1 });
    b.add(`await user.click(screen.getByRole('button', { name: 'Next' }));`, { actions: 1, roles: 1 });
    b.add(`expect(screen.queryAllByTestId('tag')).toHaveLength(${plan.tags.length});`, { queries: 1 });
  }
  b.add(`await user.click(screen.getByRole('button', { name: 'Next' }));`, { actions: 1, roles: 1 });
  b.add(`expect(screen.getByTestId('review-name').textContent).toBe(${q(plan.name)});`, { queries: 1 });
  b.add(`expect(screen.getByTestId('review-category').textContent).toBe(${q(plan.category)});`, { queries: 1 });
  b.add(`expect(screen.getByTestId('review-tags').textContent).toBe(${q(plan.tags.length ? plan.tags.join(', ') : 'None')});`, { queries: 1 });
  b.add(`await user.click(screen.getByRole('button', { name: ${q(names.createLabel)} }));`, { actions: 1, roles: 1 });
  b.add(`expect(onComplete).toHaveBeenCalledExactlyOnceWith(${JSON.stringify({ name: plan.name, category: plan.category, tags: plan.tags })});`);
  b.add(`expect(screen.getByRole('status')).toHaveTextContent(${q(`Created ${plan.name}`)});`, { roles: 1 });
}

function emitBoardExpect(b, e) {
  b.add(`expect(cardsIn('todo')).toHaveLength(${e.todo});`, { queries: 2 });
  b.add(`expect(cardsIn('doing')).toHaveLength(${e.doing});`, { queries: 2 });
  b.add(`expect(cardsIn('done')).toHaveLength(${e.done});`, { queries: 2 });
  b.add(`expect(screen.getByTestId('board-summary').textContent).toBe(${q(e.summary)});`, { queries: 1 });
}

function emitBoard(b, plan, names) {
  b.add(`const user = userEvent.setup();`);
  b.add(`render(<${names.board} />);`, { renders: 1 });
  b.add(`const cardsIn = (status: string) => within(screen.getByTestId(\`column-\${status}\`)).queryAllByTestId('card');`);
  b.add(`const newCard = screen.getByRole('textbox', { name: 'New card' });`, { roles: 1 });
  b.add(`const filter = screen.getByRole('searchbox', { name: 'Filter cards' });`, { roles: 1 });
  plan.steps.forEach((step, i) => {
    if (step.op === 'add') {
      b.add(`await user.type(newCard, ${q(`${step.title}{Enter}`)});`, { actions: 1, chars: step.title.length + 1 });
      if (step.expect.message) b.add(`expect(screen.getByTestId('board-message').textContent).toBe(${q(step.expect.message)});`, { queries: 1 });
    } else if (step.op === 'move') {
      b.add(`await user.click(screen.getByRole('button', { name: ${q(`${step.verb} ${step.title}`)} }));`, { actions: 1, roles: 1 });
    } else if (step.op === 'delete') {
      b.add(`await user.click(screen.getByRole('button', { name: ${q(`Delete ${step.title}`)} }));`, { actions: 1, roles: 1 });
    } else if (step.op === 'filter') {
      b.add(`await user.clear(filter);`, { actions: 1 });
      b.add(`await user.type(filter, ${q(step.q)});`, { actions: 1, chars: step.q.length });
    } else {
      b.add(`await user.clear(filter);`, { actions: 1 });
    }
    if (step.op !== 'add' || i === plan.steps.length - 1 || i % 3 === 2) emitBoardExpect(b, step.expect);
  });
}

const EMITTERS = { table: emitTable, form: emitForm, tags: emitTags, wizard: emitWizard, board: emitBoard };

export function emitUnitBlock(plan, names) {
  const b = new Block();
  EMITTERS[plan.kind](b, plan, names);
  const code = `  it(${q(plan.title)}, async () => {\n${b.lines.join('\n')}\n  });\n`;
  return { code, cost: b.cost };
}

export function unitSpecFile({ kind, names, describe, blocks, fixture }) {
  const comp = {
    table: `import { ${names.table} } from './${names.table}';\nimport type { ${names.rowType} } from '../types';`,
    form: `import { ${names.form} } from './${names.form}';`,
    tags: `import { TagEditor } from './TagEditor';`,
    wizard: `import { ${names.wizard} } from './${names.wizard}';`,
    board: `import { ${names.board} } from './${names.board}';`,
  }[kind];
  const rtl = kind === 'board' ? 'render, screen, within' : 'render, screen';
  const vitest = ['form', 'tags', 'wizard'].includes(kind) ? 'describe, expect, it, vi' : 'describe, expect, it';
  return `import { ${rtl} } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${vitest} } from 'vitest';
${comp}
${fixture ? `\nconst ROWS: ${names.rowType}[] = ${rowsLiteral(fixture, '')};\n` : ''}
describe(${q(describe)}, () => {
${blocks.map((x) => x.code).join('\n')}});
`;
}
