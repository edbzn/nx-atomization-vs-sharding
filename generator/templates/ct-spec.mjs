// Cypress component-test emitter: turns scenario plans into `it` blocks and counts the work
// (mounts, Cypress commands, typed characters) for the runtime cost model.

import { rowsLiteral, tsString } from '../lib/domain.mjs';

class Block {
  constructor() {
    this.lines = [];
    this.cost = { its: 1, mounts: 0, cmds: 0, chars: 0, fastChars: 0, rows: 0 };
  }
  /** add a line of Cypress code; `cmds` = number of Cypress commands in the chain */
  cy(line, cmds, chars = 0) {
    this.lines.push(`    ${line}`);
    this.cost.cmds += cmds;
    this.cost.chars += chars;
  }
  raw(line) {
    this.lines.push(`    ${line}`);
  }
}

const q = tsString;
const typed = (s) => s.length;

function fieldSel(field) {
  return field === 'category' ? `select[name=${field}]` : field === 'notes' ? `textarea[name=${field}]` : `input[name=${field}]`;
}

function emitTable(b, plan, names) {
  b.raw(plan.rowCount === plan.fixtureLength ? `const rows = ROWS;` : `const rows = ROWS.slice(0, ${plan.rowCount});`);
  b.cost.rows += plan.rows.length;
  b.cy(`cy.mount(<${names.table} rows={rows} />);`, 1);
  b.cost.mounts++;
  for (const step of plan.steps) {
    const e = step.expect;
    if (step.op === 'filter') b.cy(`cy.get('input[name=filter]').clear().type(${q(step.q)});`, 3, typed(step.q));
    else if (step.op === 'clearFilter') b.cy(`cy.get('input[name=filter]').clear();`, 2);
    else if (step.op === 'sort') b.cy(`cy.contains('th button', ${q(step.header)}).click();`, 2);
    else if (step.op === 'next') b.cy(`cy.contains('button', 'Next').click();`, 2);
    else if (step.op === 'prev') b.cy(`cy.contains('button', 'Previous').click();`, 2);
    b.cy(`cy.get('[data-testid=table-status]').should('have.text', ${q(e.status)});`, 2);
    b.cy(`cy.get('[data-testid=row]').should('have.length', ${e.visible});`, 2);
    if (e.firstId && step.op !== 'initial' && step.op !== 'filter') {
      b.cy(`cy.get('[data-testid=row]').first().should('contain.text', ${q(e.firstId)});`, 3);
    }
  }
}

function emitFormError(b, field, error) {
  if (error) {
    b.cy(`cy.get('${fieldSel(field)}').should('have.attr', 'aria-invalid', 'true');`, 2);
    b.cy(`cy.get('${fieldSel(field)}').parent().find('[role=alert]').should('have.text', ${q(error)});`, 4);
  } else {
    b.cy(`cy.get('${fieldSel(field)}').should('not.have.attr', 'aria-invalid');`, 2);
  }
}

function emitForm(b, plan, names) {
  b.cy(`const onSubmit = cy.stub().as('submit');`, 1);
  b.cy(`cy.mount(<${names.form} onSubmit={onSubmit} />);`, 1);
  b.cost.mounts++;
  for (const step of plan.steps) {
    if (step.op === 'submit') {
      b.cy(`cy.contains('button', ${q(names.saveLabel)}).click();`, 2);
      if (step.ok) {
        b.cy(`cy.get('@submit').should('have.callCount', ${step.calls});`, 2);
        b.cy(`cy.get('@submit').its('lastCall.args.0').should('deep.equal', ${JSON.stringify(step.result)});`, 3);
        b.cy(`cy.get('[data-testid=error-summary]').should('not.exist');`, 2);
      } else {
        b.cy(`cy.get('[data-testid=error-summary]').should('have.text', ${q(step.summary)});`, 2);
        for (const [field, msg] of Object.entries(step.errors)) {
          b.cy(`cy.contains('[role=alert]', ${q(msg)}).should('be.visible');`, 2);
          void field;
        }
        b.cy(`cy.get('@submit').should('have.callCount', ${step.calls});`, 2);
      }
    } else if (step.op === 'select') {
      b.cy(`cy.get('select[name=category]').select(${q(step.value)});`, 2);
      emitFormError(b, 'category', step.error);
    } else {
      if (step.value.length > 20) {
        // long free text: type without the default 10ms per-key delay
        b.cy(`cy.get('${fieldSel(step.field)}').clear().type(${q(step.value)}, { delay: 0 });`, 3);
        b.cost.fastChars += step.value.length;
      } else {
        b.cy(`cy.get('${fieldSel(step.field)}').clear().type(${q(step.value)});`, 3, typed(step.value));
      }
      emitFormError(b, step.field, step.error);
    }
  }
}

function emitTagSteps(b, steps) {
  for (const step of steps) {
    if (step.op === 'add') {
      b.cy(`cy.get('input[name=new-tag]').type(${q(`${step.text}{enter}`)});`, 2, typed(step.text) + 1);
    } else {
      b.cy(`cy.get('button[aria-label=${JSON.stringify(`Remove ${step.tag}`)}]').click();`, 2);
    }
    b.cy(`cy.get('[data-testid=tag-count]').should('have.text', ${q(step.count)});`, 2);
    b.cy(`cy.get('[data-testid=tag]').should('have.length', ${step.length});`, 2);
    if (step.message) b.cy(`cy.get('[data-testid=tag-message]').should('have.text', ${q(step.message)});`, 2);
    else b.cy(`cy.get('[data-testid=tag-message]').should('not.exist');`, 2);
  }
}

function emitTags(b, plan) {
  b.cy(`const onChange = cy.stub().as('change');`, 1);
  b.cy(`cy.mount(<TagEditor onChange={onChange} />);`, 1);
  b.cost.mounts++;
  emitTagSteps(b, plan.steps);
  b.cy(`cy.get('@change').should('have.callCount', ${plan.commits});`, 2);
  if (plan.commits > 0) b.cy(`cy.get('@change').its('lastCall.args.0').should('deep.equal', ${JSON.stringify(plan.tags)});`, 3);
}

function emitWizard(b, plan, names) {
  b.cy(`const onComplete = cy.stub().as('complete');`, 1);
  b.cy(`cy.mount(<${names.wizard} onComplete={onComplete} />);`, 1);
  b.cost.mounts++;
  b.cy(`cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');`, 2);
  if (plan.invalidFirst) {
    if (plan.shortName) b.cy(`cy.get('input[name=wizard-name]').type('Al');`, 2, 2);
    b.cy(`cy.contains('button', 'Next').click();`, 2);
    b.cy(`cy.contains('[role=alert]', ${q(plan.shortName ? 'Name must be at least 3 characters' : 'Name is required')}).should('be.visible');`, 2);
    b.cy(`cy.contains('[role=alert]', 'Category is required').should('be.visible');`, 2);
    b.cy(`cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');`, 2);
  }
  b.cy(`cy.get('input[name=wizard-name]').clear().type(${q(plan.name)});`, 3, typed(plan.name));
  b.cy(`cy.get('select[name=wizard-category]').select(${q(plan.category)});`, 2);
  b.cy(`cy.contains('button', 'Next').click();`, 2);
  b.cy(`cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');`, 2);
  emitTagSteps(b, plan.tagSteps);
  if (plan.backAndForth) {
    b.cy(`cy.contains('button', 'Back').click();`, 2);
    b.cy(`cy.get('input[name=wizard-name]').should('have.value', ${q(plan.name)});`, 2);
    b.cy(`cy.contains('button', 'Next').click();`, 2);
    b.cy(`cy.get('[data-testid=tag]').should('have.length', ${plan.tags.length});`, 2);
  }
  b.cy(`cy.contains('button', 'Next').click();`, 2);
  b.cy(`cy.get('[data-testid=review-name]').should('have.text', ${q(plan.name)});`, 2);
  b.cy(`cy.get('[data-testid=review-category]').should('have.text', ${q(plan.category)});`, 2);
  b.cy(`cy.get('[data-testid=review-tags]').should('have.text', ${q(plan.tags.length ? plan.tags.join(', ') : 'None')});`, 2);
  b.cy(`cy.contains('button', ${q(names.createLabel)}).click();`, 2);
  b.cy(`cy.get('@complete').should('have.been.calledOnceWith', ${JSON.stringify({ name: plan.name, category: plan.category, tags: plan.tags })});`, 2);
  b.cy(`cy.contains('[role=status]', ${q(`Created ${plan.name}`)}).should('be.visible');`, 2);
}

function emitBoardExpect(b, e) {
  b.cy(`cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', ${e.todo});`, 2);
  b.cy(`cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', ${e.doing});`, 2);
  b.cy(`cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', ${e.done});`, 2);
  b.cy(`cy.get('[data-testid=board-summary]').should('have.text', ${q(e.summary)});`, 2);
}

function emitBoard(b, plan, names) {
  b.cy(`cy.mount(<${names.board} />);`, 1);
  b.cost.mounts++;
  plan.steps.forEach((step, i) => {
    if (step.op === 'add') {
      b.cy(`cy.get('input[name=new-card]').type(${q(`${step.title}{enter}`)});`, 2, typed(step.title) + 1);
      if (step.expect.message) b.cy(`cy.get('[data-testid=board-message]').should('have.text', ${q(step.expect.message)});`, 2);
    } else if (step.op === 'move') {
      b.cy(`cy.get('button[aria-label=${JSON.stringify(`${step.verb} ${step.title}`)}]').click();`, 2);
    } else if (step.op === 'delete') {
      b.cy(`cy.get('button[aria-label=${JSON.stringify(`Delete ${step.title}`)}]').click();`, 2);
    } else if (step.op === 'filter') {
      b.cy(`cy.get('input[name=card-filter]').clear().type(${q(step.q)});`, 3, typed(step.q));
    } else {
      b.cy(`cy.get('input[name=card-filter]').clear();`, 2);
    }
    if (step.op !== 'add' || i === plan.steps.length - 1 || i % 3 === 2) emitBoardExpect(b, step.expect);
  });
}

const EMITTERS = { table: emitTable, form: emitForm, tags: emitTags, wizard: emitWizard, board: emitBoard };

export function emitCtBlock(plan, names) {
  const b = new Block();
  EMITTERS[plan.kind](b, plan, names);
  const code = `  it(${q(plan.title)}, () => {\n${b.lines.join('\n')}\n  });\n`;
  return { code, cost: b.cost };
}

export function ctSpecFile({ kind, names, describe, blocks, fixture }) {
  const imports = {
    table: `import { ${names.table} } from './${names.table}';\nimport type { ${names.rowType} } from '../types';`,
    form: `import { ${names.form} } from './${names.form}';`,
    tags: `import { TagEditor } from './TagEditor';`,
    wizard: `import { ${names.wizard} } from './${names.wizard}';`,
    board: `import { ${names.board} } from './${names.board}';`,
  }[kind];
  const rows = fixture ? `\nconst ROWS: ${names.rowType}[] = ${rowsLiteral(fixture, '')};\n` : '';
  return `${imports}\n${rows}\ndescribe(${q(describe)}, () => {\n${blocks.map((x) => x.code).join('\n')}});\n`;
}
