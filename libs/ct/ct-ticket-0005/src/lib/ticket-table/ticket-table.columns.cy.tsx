import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0238', name: 'Broken Login', category: 'Chore', amount: 501370 },
  { id: 'TCK-0239', name: 'Duplicate Report', category: 'Chore', amount: 879040 },
  { id: 'TCK-0240', name: 'Blank Upload', category: 'Chore', amount: 582570 },
  { id: 'TCK-0241', name: 'Hidden Search', category: 'Bug', amount: 795541 },
  { id: 'TCK-0242', name: 'Wrong Search', category: 'Chore', amount: 782388 },
  { id: 'TCK-0243', name: 'Flaky Invoice', category: 'Bug', amount: 155102 },
  { id: 'TCK-0244', name: 'Flaky Webhook', category: 'Feature', amount: 550247 },
  { id: 'TCK-0245', name: 'Stuck Search', category: 'Chore', amount: 518642 },
  { id: 'TCK-0246', name: 'Hidden Webhook', category: 'Feature', amount: 990411 },
  { id: 'TCK-0247', name: 'Stuck Search', category: 'Feature', amount: 404881 },
  { id: 'TCK-0248', name: 'Missing Report', category: 'Chore', amount: 529387 },
  { id: 'TCK-0249', name: 'Duplicate Upload', category: 'Question', amount: 474223 },
  { id: 'TCK-0250', name: 'Stuck Dashboard', category: 'Incident', amount: 517216 },
  { id: 'TCK-0251', name: 'Blank Dashboard', category: 'Chore', amount: 24419 },
  { id: 'TCK-0252', name: 'Flaky Search', category: 'Question', amount: 582212 },
];

describe('TicketTable columns', () => {
  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('tck-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0238');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0238');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0252');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0242');
  });
});
