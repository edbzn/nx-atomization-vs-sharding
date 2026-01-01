import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0133', name: 'Hidden Export', category: 'Bug', amount: 319895 },
  { id: 'TCK-0134', name: 'Missing Login', category: 'Bug', amount: 269910 },
  { id: 'TCK-0135', name: 'Missing Search', category: 'Chore', amount: 292334 },
  { id: 'TCK-0136', name: 'Blank Login', category: 'Incident', amount: 616531 },
  { id: 'TCK-0137', name: 'Slow Report', category: 'Chore', amount: 353819 },
  { id: 'TCK-0138', name: 'Flaky Upload', category: 'Bug', amount: 952582 },
  { id: 'TCK-0139', name: 'Wrong Sidebar', category: 'Feature', amount: 3035 },
  { id: 'TCK-0140', name: 'Hidden Report', category: 'Bug', amount: 468608 },
  { id: 'TCK-0141', name: 'Wrong Upload', category: 'Question', amount: 172130 },
  { id: 'TCK-0142', name: 'Blank Dashboard', category: 'Bug', amount: 895210 },
  { id: 'TCK-0143', name: 'Wrong Report', category: 'Incident', amount: 709351 },
  { id: 'TCK-0144', name: 'Blank Webhook', category: 'Chore', amount: 400527 },
  { id: 'TCK-0145', name: 'Duplicate Search', category: 'Question', amount: 414032 },
  { id: 'TCK-0146', name: 'Stuck Search', category: 'Chore', amount: 883911 },
  { id: 'TCK-0147', name: 'Wrong Dashboard', category: 'Bug', amount: 769347 },
];

describe('TicketTable pagination', () => {
  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0143');
    cy.get('input[name=filter]').clear().type('webhoo');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0133');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0142');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0142');
  });

  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0143');
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0133');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0143');
    cy.get('input[name=filter]').clear().type('TCK-0142');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0142');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0133');
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
