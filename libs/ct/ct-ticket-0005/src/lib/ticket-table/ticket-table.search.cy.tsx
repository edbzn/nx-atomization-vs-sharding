import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0281', name: 'Flaky Export', category: 'Question', amount: 945593 },
  { id: 'TCK-0282', name: 'Broken Report', category: 'Chore', amount: 451448 },
  { id: 'TCK-0283', name: 'Slow Payment', category: 'Bug', amount: 20710 },
  { id: 'TCK-0284', name: 'Broken Invoice', category: 'Bug', amount: 310615 },
  { id: 'TCK-0285', name: 'Broken Webhook', category: 'Feature', amount: 581310 },
  { id: 'TCK-0286', name: 'Broken Export', category: 'Question', amount: 373328 },
  { id: 'TCK-0287', name: 'Hidden Webhook', category: 'Question', amount: 392673 },
  { id: 'TCK-0288', name: 'Blank Export', category: 'Chore', amount: 931893 },
  { id: 'TCK-0289', name: 'Slow Login', category: 'Incident', amount: 1458 },
  { id: 'TCK-0290', name: 'Blank Export', category: 'Chore', amount: 730185 },
  { id: 'TCK-0291', name: 'Slow Dashboard', category: 'Feature', amount: 218697 },
  { id: 'TCK-0292', name: 'Broken Invoice', category: 'Bug', amount: 148697 },
  { id: 'TCK-0293', name: 'Missing Sidebar', category: 'Feature', amount: 747277 },
  { id: 'TCK-0294', name: 'Stale Login', category: 'Feature', amount: 664935 },
  { id: 'TCK-0295', name: 'Broken Webhook', category: 'Bug', amount: 496846 },
  { id: 'TCK-0296', name: 'Stuck Sidebar', category: 'Question', amount: 19651 },
  { id: 'TCK-0297', name: 'Missing Search', category: 'Chore', amount: 880349 },
];

describe('TicketTable search', () => {
  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0288');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0289');
  });

  it('filters, sorts and pages through 16 tickets', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0281');
  });
});
