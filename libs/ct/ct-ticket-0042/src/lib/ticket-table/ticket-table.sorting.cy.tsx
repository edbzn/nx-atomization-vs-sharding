import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0175', name: 'Broken Webhook', category: 'Feature', amount: 855539 },
  { id: 'TCK-0176', name: 'Stuck Export', category: 'Incident', amount: 429963 },
  { id: 'TCK-0177', name: 'Wrong Dashboard', category: 'Feature', amount: 150991 },
  { id: 'TCK-0178', name: 'Stale Login', category: 'Chore', amount: 808725 },
  { id: 'TCK-0179', name: 'Wrong Payment', category: 'Feature', amount: 935969 },
  { id: 'TCK-0180', name: 'Stale Report', category: 'Feature', amount: 596230 },
  { id: 'TCK-0181', name: 'Missing Invoice', category: 'Chore', amount: 601412 },
  { id: 'TCK-0182', name: 'Stale Search', category: 'Incident', amount: 344117 },
  { id: 'TCK-0183', name: 'Stale Report', category: 'Incident', amount: 51159 },
  { id: 'TCK-0184', name: 'Wrong Report', category: 'Feature', amount: 804320 },
  { id: 'TCK-0185', name: 'Duplicate Dashboard', category: 'Bug', amount: 193748 },
  { id: 'TCK-0186', name: 'Stale Dashboard', category: 'Chore', amount: 573595 },
  { id: 'TCK-0187', name: 'Stale Invoice', category: 'Question', amount: 216588 },
  { id: 'TCK-0188', name: 'Stale Payment', category: 'Bug', amount: 275596 },
  { id: 'TCK-0189', name: 'Wrong Export', category: 'Bug', amount: 341384 },
];

describe('TicketTable sorting', () => {
  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('web');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('bug');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0175');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0185');
    cy.get('input[name=filter]').clear().type('upl');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0185');
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
