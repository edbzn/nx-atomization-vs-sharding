import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0017', name: 'Duplicate Webhook', category: 'Feature', amount: 305890 },
  { id: 'TCK-0018', name: 'Duplicate Sidebar', category: 'Bug', amount: 988001 },
  { id: 'TCK-0019', name: 'Slow Webhook', category: 'Feature', amount: 883096 },
  { id: 'TCK-0020', name: 'Slow Login', category: 'Feature', amount: 309177 },
  { id: 'TCK-0021', name: 'Missing Webhook', category: 'Feature', amount: 208538 },
  { id: 'TCK-0022', name: 'Broken Upload', category: 'Chore', amount: 200193 },
  { id: 'TCK-0023', name: 'Stale Invoice', category: 'Bug', amount: 524296 },
  { id: 'TCK-0024', name: 'Missing Login', category: 'Chore', amount: 795816 },
  { id: 'TCK-0025', name: 'Wrong Login', category: 'Question', amount: 488309 },
  { id: 'TCK-0026', name: 'Broken Dashboard', category: 'Question', amount: 73913 },
  { id: 'TCK-0027', name: 'Hidden Export', category: 'Incident', amount: 19421 },
  { id: 'TCK-0028', name: 'Wrong Payment', category: 'Question', amount: 456415 },
  { id: 'TCK-0029', name: 'Broken Export', category: 'Chore', amount: 195195 },
];

describe('TicketTable filtering', () => {
  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('sear');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0017');
    cy.get('input[name=filter]').clear().type('Miss');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
