import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0353', name: 'Duplicate Webhook', category: 'Incident', amount: 226716 },
  { id: 'TCK-0354', name: 'Stuck Payment', category: 'Bug', amount: 943678 },
  { id: 'TCK-0355', name: 'Missing Dashboard', category: 'Feature', amount: 429503 },
  { id: 'TCK-0356', name: 'Stale Sidebar', category: 'Question', amount: 94846 },
  { id: 'TCK-0357', name: 'Stuck Sidebar', category: 'Chore', amount: 252994 },
  { id: 'TCK-0358', name: 'Flaky Login', category: 'Feature', amount: 333856 },
  { id: 'TCK-0359', name: 'Duplicate Payment', category: 'Feature', amount: 913759 },
  { id: 'TCK-0360', name: 'Duplicate Export', category: 'Feature', amount: 456613 },
  { id: 'TCK-0361', name: 'Slow Payment', category: 'Incident', amount: 98386 },
  { id: 'TCK-0362', name: 'Blank Login', category: 'Bug', amount: 949181 },
  { id: 'TCK-0363', name: 'Stuck Invoice', category: 'Feature', amount: 409051 },
  { id: 'TCK-0364', name: 'Stale Login', category: 'Bug', amount: 827901 },
  { id: 'TCK-0365', name: 'Stale Report', category: 'Feature', amount: 392820 },
  { id: 'TCK-0366', name: 'Stale Report', category: 'Incident', amount: 481454 },
  { id: 'TCK-0367', name: 'Blank Login', category: 'Bug', amount: 323153 },
  { id: 'TCK-0368', name: 'Duplicate Login', category: 'Bug', amount: 186408 },
  { id: 'TCK-0369', name: 'Stuck Report', category: 'Incident', amount: 545470 },
  { id: 'TCK-0370', name: 'Blank Sidebar', category: 'Incident', amount: 232894 },
];

describe('TicketTable filtering', () => {
  it('filters, sorts and pages through 18 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0362');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0362');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0362');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0364');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0362');
    cy.get('input[name=filter]').clear().type('TCK-0363');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0362');
  });

  it('filters, sorts and pages through 18 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0362');
    cy.get('input[name=filter]').clear().type('Flaky');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0362');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0356');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0362');
  });

  it('filters, sorts and pages through 14 tickets', () => {
    const rows = ROWS.slice(0, 14);
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('login');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });
});
