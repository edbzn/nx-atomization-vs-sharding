import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0120', name: 'Wrong Export', category: 'Feature', amount: 96460 },
  { id: 'TCK-0121', name: 'Stuck Login', category: 'Bug', amount: 468806 },
  { id: 'TCK-0122', name: 'Blank Export', category: 'Incident', amount: 805273 },
  { id: 'TCK-0123', name: 'Slow Invoice', category: 'Incident', amount: 931853 },
  { id: 'TCK-0124', name: 'Missing Search', category: 'Question', amount: 152520 },
  { id: 'TCK-0125', name: 'Wrong Webhook', category: 'Bug', amount: 480127 },
  { id: 'TCK-0126', name: 'Missing Report', category: 'Incident', amount: 934907 },
  { id: 'TCK-0127', name: 'Blank Report', category: 'Incident', amount: 944155 },
  { id: 'TCK-0128', name: 'Broken Export', category: 'Chore', amount: 858507 },
  { id: 'TCK-0129', name: 'Hidden Payment', category: 'Feature', amount: 29598 },
  { id: 'TCK-0130', name: 'Broken Sidebar', category: 'Question', amount: 687103 },
  { id: 'TCK-0131', name: 'Hidden Payment', category: 'Bug', amount: 950770 },
  { id: 'TCK-0132', name: 'Stuck Sidebar', category: 'Chore', amount: 534823 },
  { id: 'TCK-0133', name: 'Flaky Webhook', category: 'Chore', amount: 236024 },
  { id: 'TCK-0134', name: 'Stuck Dashboard', category: 'Chore', amount: 854673 },
  { id: 'TCK-0135', name: 'Missing Dashboard', category: 'Incident', amount: 901597 },
  { id: 'TCK-0136', name: 'Stuck Search', category: 'Feature', amount: 755462 },
  { id: 'TCK-0137', name: 'Missing Payment', category: 'Bug', amount: 880208 },
  { id: 'TCK-0138', name: 'Broken Report', category: 'Question', amount: 80641 },
  { id: 'TCK-0139', name: 'Blank Export', category: 'Bug', amount: 473243 },
];

describe('TicketTable sorting', () => {
  it('filters, sorts and pages through 20 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0130');
    cy.get('input[name=filter]').clear().type('tck-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Slo');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
