import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0031', name: 'Wrong Webhook', category: 'Bug', amount: 333673 },
  { id: 'TCK-0032', name: 'Stuck Dashboard', category: 'Bug', amount: 714128 },
  { id: 'TCK-0033', name: 'Broken Webhook', category: 'Question', amount: 716702 },
  { id: 'TCK-0034', name: 'Stale Login', category: 'Feature', amount: 940189 },
  { id: 'TCK-0035', name: 'Missing Report', category: 'Bug', amount: 137149 },
  { id: 'TCK-0036', name: 'Slow Upload', category: 'Question', amount: 847280 },
  { id: 'TCK-0037', name: 'Slow Payment', category: 'Bug', amount: 972793 },
  { id: 'TCK-0038', name: 'Blank Login', category: 'Feature', amount: 741215 },
  { id: 'TCK-0039', name: 'Missing Export', category: 'Incident', amount: 611134 },
  { id: 'TCK-0040', name: 'Missing Invoice', category: 'Bug', amount: 735691 },
  { id: 'TCK-0041', name: 'Slow Search', category: 'Incident', amount: 905533 },
  { id: 'TCK-0042', name: 'Hidden Login', category: 'Chore', amount: 510217 },
  { id: 'TCK-0043', name: 'Wrong Sidebar', category: 'Feature', amount: 861529 },
];

describe('TicketTable columns', () => {
  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0031');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0031');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0035');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0041');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0038');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0032');
    cy.get('input[name=filter]').clear().type('tck-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0035');
  });
});
