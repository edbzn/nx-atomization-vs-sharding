import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0176', name: 'Stale Export', category: 'Question', amount: 995761 },
  { id: 'TCK-0177', name: 'Blank Sidebar', category: 'Feature', amount: 792477 },
  { id: 'TCK-0178', name: 'Broken Sidebar', category: 'Feature', amount: 303988 },
  { id: 'TCK-0179', name: 'Stuck Report', category: 'Chore', amount: 462335 },
  { id: 'TCK-0180', name: 'Stuck Upload', category: 'Incident', amount: 24165 },
  { id: 'TCK-0181', name: 'Slow Dashboard', category: 'Bug', amount: 182963 },
  { id: 'TCK-0182', name: 'Wrong Webhook', category: 'Incident', amount: 906307 },
  { id: 'TCK-0183', name: 'Missing Webhook', category: 'Question', amount: 588169 },
  { id: 'TCK-0184', name: 'Blank Payment', category: 'Feature', amount: 595761 },
  { id: 'TCK-0185', name: 'Missing Invoice', category: 'Question', amount: 306323 },
  { id: 'TCK-0186', name: 'Hidden Report', category: 'Incident', amount: 876018 },
  { id: 'TCK-0187', name: 'Broken Export', category: 'Feature', amount: 702771 },
  { id: 'TCK-0188', name: 'Hidden Dashboard', category: 'Chore', amount: 905888 },
  { id: 'TCK-0189', name: 'Broken Invoice', category: 'Feature', amount: 236607 },
  { id: 'TCK-0190', name: 'Missing Search', category: 'Feature', amount: 410916 },
  { id: 'TCK-0191', name: 'Stale Webhook', category: 'Bug', amount: 272617 },
  { id: 'TCK-0192', name: 'Flaky Export', category: 'Bug', amount: 498297 },
  { id: 'TCK-0193', name: 'Blank Payment', category: 'Question', amount: 25928 },
];

describe('TicketTable empty results', () => {
  it('filters, sorts and pages through 18 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0176');
    cy.get('input[name=filter]').clear().type('TCK-0192');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0192');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0184');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0184');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0180');
  });
});
