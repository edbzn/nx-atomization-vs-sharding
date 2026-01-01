import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0364', name: 'Duplicate Invoice', category: 'Bug', amount: 289213 },
  { id: 'TCK-0365', name: 'Slow Login', category: 'Question', amount: 419491 },
  { id: 'TCK-0366', name: 'Broken Dashboard', category: 'Incident', amount: 620938 },
  { id: 'TCK-0367', name: 'Duplicate Payment', category: 'Incident', amount: 200601 },
  { id: 'TCK-0368', name: 'Broken Search', category: 'Chore', amount: 157662 },
  { id: 'TCK-0369', name: 'Broken Login', category: 'Question', amount: 271835 },
  { id: 'TCK-0370', name: 'Broken Search', category: 'Question', amount: 155274 },
  { id: 'TCK-0371', name: 'Flaky Export', category: 'Incident', amount: 595619 },
  { id: 'TCK-0372', name: 'Missing Sidebar', category: 'Bug', amount: 712998 },
  { id: 'TCK-0373', name: 'Hidden Login', category: 'Incident', amount: 182717 },
  { id: 'TCK-0374', name: 'Stale Report', category: 'Chore', amount: 945894 },
  { id: 'TCK-0375', name: 'Missing Export', category: 'Question', amount: 930433 },
  { id: 'TCK-0376', name: 'Missing Sidebar', category: 'Incident', amount: 745097 },
];

describe('TicketTable empty results', () => {
  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0374');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0364');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0374');
  });

  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('tck-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0364');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0366');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0374');
    cy.get('input[name=filter]').clear().type('inv');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
