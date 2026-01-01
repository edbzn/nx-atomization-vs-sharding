import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0142', name: 'Hidden Search', category: 'Incident', amount: 712327 },
  { id: 'TCK-0143', name: 'Stuck Invoice', category: 'Incident', amount: 757245 },
  { id: 'TCK-0144', name: 'Flaky Webhook', category: 'Question', amount: 917740 },
  { id: 'TCK-0145', name: 'Hidden Export', category: 'Feature', amount: 193688 },
  { id: 'TCK-0146', name: 'Broken Login', category: 'Feature', amount: 241658 },
  { id: 'TCK-0147', name: 'Missing Invoice', category: 'Question', amount: 53248 },
  { id: 'TCK-0148', name: 'Flaky Payment', category: 'Incident', amount: 473444 },
  { id: 'TCK-0149', name: 'Flaky Dashboard', category: 'Bug', amount: 353741 },
  { id: 'TCK-0150', name: 'Stuck Export', category: 'Chore', amount: 409557 },
  { id: 'TCK-0151', name: 'Duplicate Dashboard', category: 'Bug', amount: 401441 },
  { id: 'TCK-0152', name: 'Broken Search', category: 'Chore', amount: 158600 },
  { id: 'TCK-0153', name: 'Stale Payment', category: 'Bug', amount: 439194 },
  { id: 'TCK-0154', name: 'Missing Export', category: 'Bug', amount: 201922 },
  { id: 'TCK-0155', name: 'Stuck Login', category: 'Feature', amount: 871936 },
  { id: 'TCK-0156', name: 'Slow Search', category: 'Feature', amount: 94226 },
];

describe('TicketTable pagination', () => {
  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0147');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0148');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0147');
    cy.get('input[name=filter]').clear().type('TCK-0148');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0147');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0148');
  });

  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('sea');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });
});
