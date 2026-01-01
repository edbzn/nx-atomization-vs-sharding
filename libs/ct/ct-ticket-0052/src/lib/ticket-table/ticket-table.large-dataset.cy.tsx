import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0285', name: 'Blank Invoice', category: 'Question', amount: 763938 },
  { id: 'TCK-0286', name: 'Blank Export', category: 'Chore', amount: 926236 },
  { id: 'TCK-0287', name: 'Flaky Search', category: 'Chore', amount: 877538 },
  { id: 'TCK-0288', name: 'Stale Webhook', category: 'Bug', amount: 288478 },
  { id: 'TCK-0289', name: 'Flaky Export', category: 'Feature', amount: 672917 },
  { id: 'TCK-0290', name: 'Broken Payment', category: 'Chore', amount: 381607 },
  { id: 'TCK-0291', name: 'Duplicate Search', category: 'Chore', amount: 6099 },
  { id: 'TCK-0292', name: 'Broken Invoice', category: 'Incident', amount: 164038 },
  { id: 'TCK-0293', name: 'Stuck Dashboard', category: 'Chore', amount: 577527 },
  { id: 'TCK-0294', name: 'Blank Login', category: 'Chore', amount: 788111 },
  { id: 'TCK-0295', name: 'Stuck Upload', category: 'Bug', amount: 600165 },
  { id: 'TCK-0296', name: 'Stuck Sidebar', category: 'Chore', amount: 81398 },
  { id: 'TCK-0297', name: 'Missing Export', category: 'Feature', amount: 111335 },
];

describe('TicketTable large dataset', () => {
  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0295');
    cy.get('input[name=filter]').clear().type('repo');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('TCK-0286');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0285');
  });
});
