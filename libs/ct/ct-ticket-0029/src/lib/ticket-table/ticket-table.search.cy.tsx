import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0098', name: 'Slow Export', category: 'Bug', amount: 115444 },
  { id: 'TCK-0099', name: 'Stuck Sidebar', category: 'Question', amount: 800857 },
  { id: 'TCK-0100', name: 'Hidden Report', category: 'Bug', amount: 562703 },
  { id: 'TCK-0101', name: 'Slow Payment', category: 'Question', amount: 193414 },
  { id: 'TCK-0102', name: 'Wrong Upload', category: 'Bug', amount: 445478 },
  { id: 'TCK-0103', name: 'Stale Invoice', category: 'Chore', amount: 507252 },
  { id: 'TCK-0104', name: 'Stale Search', category: 'Bug', amount: 508369 },
  { id: 'TCK-0105', name: 'Wrong Sidebar', category: 'Incident', amount: 661495 },
  { id: 'TCK-0106', name: 'Slow Search', category: 'Feature', amount: 74609 },
  { id: 'TCK-0107', name: 'Flaky Sidebar', category: 'Bug', amount: 521780 },
  { id: 'TCK-0108', name: 'Flaky Search', category: 'Incident', amount: 656516 },
  { id: 'TCK-0109', name: 'Blank Upload', category: 'Chore', amount: 10509 },
  { id: 'TCK-0110', name: 'Flaky Search', category: 'Bug', amount: 371739 },
  { id: 'TCK-0111', name: 'Blank Payment', category: 'Chore', amount: 949897 },
];

describe('TicketTable search', () => {
  it('filters, sorts and pages through 14 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0098');
    cy.get('input[name=filter]').clear().type('expo');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 14 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0108');
  });
});
