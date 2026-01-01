import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0171', name: 'Stuck Webhook', category: 'Feature', amount: 65527 },
  { id: 'TCK-0172', name: 'Hidden Report', category: 'Feature', amount: 622766 },
  { id: 'TCK-0173', name: 'Slow Search', category: 'Chore', amount: 851471 },
  { id: 'TCK-0174', name: 'Stuck Payment', category: 'Chore', amount: 793696 },
  { id: 'TCK-0175', name: 'Duplicate Report', category: 'Chore', amount: 96575 },
  { id: 'TCK-0176', name: 'Hidden Payment', category: 'Bug', amount: 545378 },
  { id: 'TCK-0177', name: 'Wrong Report', category: 'Incident', amount: 514105 },
  { id: 'TCK-0178', name: 'Stuck Export', category: 'Bug', amount: 356434 },
  { id: 'TCK-0179', name: 'Slow Search', category: 'Question', amount: 198931 },
  { id: 'TCK-0180', name: 'Missing Payment', category: 'Bug', amount: 654492 },
  { id: 'TCK-0181', name: 'Duplicate Login', category: 'Incident', amount: 473793 },
  { id: 'TCK-0182', name: 'Stuck Webhook', category: 'Incident', amount: 389681 },
  { id: 'TCK-0183', name: 'Stale Report', category: 'Feature', amount: 229107 },
  { id: 'TCK-0184', name: 'Missing Export', category: 'Incident', amount: 546882 },
];

describe('TicketTable sorting', () => {
  it('filters, sorts and pages through 14 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('TCK-0183');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0183');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0183');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0173');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0183');
  });

  it('filters, sorts and pages through 14 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0181');
  });
});
