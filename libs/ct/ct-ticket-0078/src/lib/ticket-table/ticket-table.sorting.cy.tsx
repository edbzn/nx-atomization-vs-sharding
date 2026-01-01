import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0099', name: 'Slow Export', category: 'Question', amount: 785284 },
  { id: 'TCK-0100', name: 'Stale Sidebar', category: 'Feature', amount: 90922 },
  { id: 'TCK-0101', name: 'Stale Search', category: 'Feature', amount: 212772 },
  { id: 'TCK-0102', name: 'Stuck Report', category: 'Chore', amount: 336424 },
  { id: 'TCK-0103', name: 'Flaky Payment', category: 'Feature', amount: 975585 },
  { id: 'TCK-0104', name: 'Stuck Search', category: 'Bug', amount: 441495 },
  { id: 'TCK-0105', name: 'Stuck Login', category: 'Incident', amount: 23245 },
  { id: 'TCK-0106', name: 'Hidden Search', category: 'Question', amount: 788704 },
  { id: 'TCK-0107', name: 'Duplicate Sidebar', category: 'Question', amount: 15944 },
  { id: 'TCK-0108', name: 'Slow Search', category: 'Question', amount: 88664 },
  { id: 'TCK-0109', name: 'Hidden Search', category: 'Question', amount: 101151 },
  { id: 'TCK-0110', name: 'Broken Webhook', category: 'Incident', amount: 772902 },
  { id: 'TCK-0111', name: 'Hidden Invoice', category: 'Chore', amount: 594568 },
  { id: 'TCK-0112', name: 'Flaky Login', category: 'Incident', amount: 183269 },
  { id: 'TCK-0113', name: 'Stale Upload', category: 'Feature', amount: 516359 },
];

describe('TicketTable sorting', () => {
  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0099');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0109');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0099');
    cy.get('input[name=filter]').clear().type('chore');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0099');
    cy.get('input[name=filter]').clear().type('tck-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
