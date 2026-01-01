import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0001', name: 'Wrong Webhook', category: 'Feature', amount: 220495 },
  { id: 'TCK-0002', name: 'Broken Upload', category: 'Feature', amount: 282485 },
  { id: 'TCK-0003', name: 'Flaky Dashboard', category: 'Feature', amount: 575440 },
  { id: 'TCK-0004', name: 'Missing Upload', category: 'Bug', amount: 85024 },
  { id: 'TCK-0005', name: 'Duplicate Webhook', category: 'Question', amount: 777733 },
  { id: 'TCK-0006', name: 'Duplicate Payment', category: 'Incident', amount: 791272 },
  { id: 'TCK-0007', name: 'Slow Login', category: 'Question', amount: 144474 },
  { id: 'TCK-0008', name: 'Broken Report', category: 'Incident', amount: 960307 },
  { id: 'TCK-0009', name: 'Blank Invoice', category: 'Incident', amount: 842422 },
  { id: 'TCK-0010', name: 'Wrong Login', category: 'Question', amount: 160497 },
  { id: 'TCK-0011', name: 'Hidden Dashboard', category: 'Feature', amount: 118221 },
  { id: 'TCK-0012', name: 'Missing Webhook', category: 'Feature', amount: 808394 },
  { id: 'TCK-0013', name: 'Slow Export', category: 'Feature', amount: 281507 },
  { id: 'TCK-0014', name: 'Stuck Export', category: 'Feature', amount: 233466 },
  { id: 'TCK-0015', name: 'Blank Payment', category: 'Incident', amount: 48505 },
  { id: 'TCK-0016', name: 'Flaky Export', category: 'Chore', amount: 30099 },
  { id: 'TCK-0017', name: 'Hidden Invoice', category: 'Chore', amount: 186421 },
];

describe('TicketTable filtering', () => {
  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0011');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0001');
    cy.get('input[name=filter]').clear().type('TCK-0009');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('TCK-0001');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
