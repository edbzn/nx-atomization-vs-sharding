import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0067', name: 'Blank Sidebar', category: 'Incident', amount: 380795 },
  { id: 'TCK-0068', name: 'Blank Dashboard', category: 'Chore', amount: 923611 },
  { id: 'TCK-0069', name: 'Blank Login', category: 'Question', amount: 554797 },
  { id: 'TCK-0070', name: 'Slow Payment', category: 'Bug', amount: 200869 },
  { id: 'TCK-0071', name: 'Blank Invoice', category: 'Question', amount: 790904 },
  { id: 'TCK-0072', name: 'Slow Export', category: 'Feature', amount: 503771 },
  { id: 'TCK-0073', name: 'Missing Invoice', category: 'Chore', amount: 121200 },
  { id: 'TCK-0074', name: 'Wrong Sidebar', category: 'Chore', amount: 552 },
  { id: 'TCK-0075', name: 'Stale Invoice', category: 'Feature', amount: 621620 },
  { id: 'TCK-0076', name: 'Stuck Search', category: 'Incident', amount: 839965 },
  { id: 'TCK-0077', name: 'Missing Invoice', category: 'Feature', amount: 898110 },
  { id: 'TCK-0078', name: 'Hidden Dashboard', category: 'Chore', amount: 259913 },
  { id: 'TCK-0079', name: 'Wrong Sidebar', category: 'Bug', amount: 533424 },
  { id: 'TCK-0080', name: 'Duplicate Webhook', category: 'Incident', amount: 665675 },
  { id: 'TCK-0081', name: 'Broken Report', category: 'Chore', amount: 274126 },
];

describe('TicketTable filtering', () => {
  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Hidd');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0078');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0067');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0074');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0080');
    cy.get('input[name=filter]').clear().type('Blan');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0074');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0080');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0074');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0074');
  });

  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0077');
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
