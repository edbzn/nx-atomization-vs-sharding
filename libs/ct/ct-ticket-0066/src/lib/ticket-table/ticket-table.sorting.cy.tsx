import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0034', name: 'Duplicate Login', category: 'Chore', amount: 289213 },
  { id: 'TCK-0035', name: 'Missing Login', category: 'Bug', amount: 551408 },
  { id: 'TCK-0036', name: 'Duplicate Export', category: 'Feature', amount: 9885 },
  { id: 'TCK-0037', name: 'Wrong Search', category: 'Feature', amount: 264910 },
  { id: 'TCK-0038', name: 'Slow Export', category: 'Feature', amount: 735507 },
  { id: 'TCK-0039', name: 'Duplicate Sidebar', category: 'Feature', amount: 1185 },
  { id: 'TCK-0040', name: 'Stale Export', category: 'Incident', amount: 485394 },
  { id: 'TCK-0041', name: 'Duplicate Export', category: 'Question', amount: 30621 },
  { id: 'TCK-0042', name: 'Flaky Search', category: 'Incident', amount: 678121 },
  { id: 'TCK-0043', name: 'Blank Invoice', category: 'Bug', amount: 860316 },
  { id: 'TCK-0044', name: 'Wrong Search', category: 'Feature', amount: 259663 },
  { id: 'TCK-0045', name: 'Duplicate Search', category: 'Bug', amount: 701585 },
];

describe('TicketTable sorting', () => {
  it('filters, sorts and pages through 12 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0034');
    cy.get('input[name=filter]').clear().type('pay');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0039');
  });

  it('filters, sorts and pages through 12 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0034');
  });
});
