import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0155', name: 'Stale Invoice', category: 'Incident', amount: 13601 },
  { id: 'TCK-0156', name: 'Stuck Login', category: 'Feature', amount: 278184 },
  { id: 'TCK-0157', name: 'Flaky Upload', category: 'Question', amount: 3233 },
  { id: 'TCK-0158', name: 'Hidden Dashboard', category: 'Bug', amount: 739460 },
  { id: 'TCK-0159', name: 'Slow Webhook', category: 'Question', amount: 532237 },
  { id: 'TCK-0160', name: 'Stuck Export', category: 'Question', amount: 902064 },
  { id: 'TCK-0161', name: 'Missing Upload', category: 'Incident', amount: 366903 },
  { id: 'TCK-0162', name: 'Duplicate Upload', category: 'Feature', amount: 185470 },
  { id: 'TCK-0163', name: 'Slow Upload', category: 'Question', amount: 351883 },
  { id: 'TCK-0164', name: 'Hidden Payment', category: 'Chore', amount: 702654 },
  { id: 'TCK-0165', name: 'Broken Report', category: 'Chore', amount: 98569 },
  { id: 'TCK-0166', name: 'Wrong Login', category: 'Chore', amount: 297053 },
  { id: 'TCK-0167', name: 'Wrong Report', category: 'Bug', amount: 57710 },
  { id: 'TCK-0168', name: 'Stuck Report', category: 'Incident', amount: 717235 },
];

describe('TicketTable filtering', () => {
  it('filters, sorts and pages through 14 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0165');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0155');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0155');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0155');
    cy.get('input[name=filter]').clear().type('TCK-0155');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0155');
  });

  it('filters, sorts and pages through 14 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0157');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0157');
    cy.get('input[name=filter]').clear().type('Dupl');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0157');
  });
});
