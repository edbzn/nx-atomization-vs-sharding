import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0206', name: 'Wrong Report', category: 'Bug', amount: 686650 },
  { id: 'TCK-0207', name: 'Duplicate Invoice', category: 'Feature', amount: 978497 },
  { id: 'TCK-0208', name: 'Hidden Export', category: 'Question', amount: 447966 },
  { id: 'TCK-0209', name: 'Wrong Invoice', category: 'Bug', amount: 289342 },
  { id: 'TCK-0210', name: 'Duplicate Upload', category: 'Bug', amount: 222459 },
  { id: 'TCK-0211', name: 'Wrong Login', category: 'Bug', amount: 245574 },
  { id: 'TCK-0212', name: 'Wrong Upload', category: 'Question', amount: 609251 },
  { id: 'TCK-0213', name: 'Missing Search', category: 'Feature', amount: 203327 },
  { id: 'TCK-0214', name: 'Wrong Sidebar', category: 'Incident', amount: 199042 },
  { id: 'TCK-0215', name: 'Broken Search', category: 'Chore', amount: 62527 },
  { id: 'TCK-0216', name: 'Hidden Invoice', category: 'Feature', amount: 613563 },
  { id: 'TCK-0217', name: 'Duplicate Upload', category: 'Feature', amount: 373555 },
  { id: 'TCK-0218', name: 'Stuck Webhook', category: 'Bug', amount: 302623 },
  { id: 'TCK-0219', name: 'Broken Invoice', category: 'Incident', amount: 551700 },
  { id: 'TCK-0220', name: 'Flaky Payment', category: 'Chore', amount: 137399 },
  { id: 'TCK-0221', name: 'Blank Dashboard', category: 'Question', amount: 550270 },
  { id: 'TCK-0222', name: 'Hidden Invoice', category: 'Bug', amount: 778336 },
  { id: 'TCK-0223', name: 'Duplicate Upload', category: 'Chore', amount: 10751 },
  { id: 'TCK-0224', name: 'Wrong Payment', category: 'Bug', amount: 170051 },
];

describe('TicketTable filtering', () => {
  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0206');
  });

  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0206');
  });
});
