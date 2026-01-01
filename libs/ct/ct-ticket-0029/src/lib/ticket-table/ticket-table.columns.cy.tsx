import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0353', name: 'Broken Sidebar', category: 'Question', amount: 279920 },
  { id: 'TCK-0354', name: 'Blank Dashboard', category: 'Question', amount: 607954 },
  { id: 'TCK-0355', name: 'Slow Login', category: 'Incident', amount: 557060 },
  { id: 'TCK-0356', name: 'Blank Login', category: 'Chore', amount: 320037 },
  { id: 'TCK-0357', name: 'Stale Login', category: 'Feature', amount: 136188 },
  { id: 'TCK-0358', name: 'Hidden Export', category: 'Incident', amount: 402045 },
  { id: 'TCK-0359', name: 'Hidden Report', category: 'Incident', amount: 225217 },
  { id: 'TCK-0360', name: 'Stuck Search', category: 'Incident', amount: 2949 },
  { id: 'TCK-0361', name: 'Missing Payment', category: 'Feature', amount: 522007 },
  { id: 'TCK-0362', name: 'Duplicate Sidebar', category: 'Bug', amount: 27764 },
  { id: 'TCK-0363', name: 'Flaky Sidebar', category: 'Chore', amount: 963265 },
  { id: 'TCK-0364', name: 'Flaky Dashboard', category: 'Bug', amount: 867494 },
  { id: 'TCK-0365', name: 'Slow Login', category: 'Question', amount: 373388 },
];

describe('TicketTable columns', () => {
  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0360');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0360');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0360');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0354');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0360');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0360');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0360');
    cy.get('input[name=filter]').clear().type('Broke');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0353');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0353');
  });
});
