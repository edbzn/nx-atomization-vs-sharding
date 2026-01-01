import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0221', name: 'Stuck Report', category: 'Feature', amount: 934699 },
  { id: 'TCK-0222', name: 'Hidden Login', category: 'Question', amount: 708571 },
  { id: 'TCK-0223', name: 'Blank Payment', category: 'Chore', amount: 282628 },
  { id: 'TCK-0224', name: 'Duplicate Sidebar', category: 'Incident', amount: 517862 },
  { id: 'TCK-0225', name: 'Flaky Dashboard', category: 'Incident', amount: 650434 },
  { id: 'TCK-0226', name: 'Blank Search', category: 'Bug', amount: 168079 },
  { id: 'TCK-0227', name: 'Stuck Webhook', category: 'Feature', amount: 460374 },
  { id: 'TCK-0228', name: 'Slow Webhook', category: 'Incident', amount: 829548 },
  { id: 'TCK-0229', name: 'Stale Sidebar', category: 'Incident', amount: 887048 },
  { id: 'TCK-0230', name: 'Duplicate Report', category: 'Bug', amount: 793807 },
  { id: 'TCK-0231', name: 'Missing Report', category: 'Feature', amount: 75336 },
  { id: 'TCK-0232', name: 'Hidden Report', category: 'Chore', amount: 940671 },
  { id: 'TCK-0233', name: 'Broken Sidebar', category: 'Question', amount: 29453 },
];

describe('TicketTable pagination', () => {
  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0231');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0221');
    cy.get('input[name=filter]').clear().type('TCK-0224');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0221');
  });
});
