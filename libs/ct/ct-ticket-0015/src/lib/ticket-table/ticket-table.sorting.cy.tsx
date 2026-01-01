import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0239', name: 'Wrong Invoice', category: 'Chore', amount: 120029 },
  { id: 'TCK-0240', name: 'Stale Sidebar', category: 'Incident', amount: 683076 },
  { id: 'TCK-0241', name: 'Slow Upload', category: 'Incident', amount: 818157 },
  { id: 'TCK-0242', name: 'Slow Invoice', category: 'Question', amount: 636490 },
  { id: 'TCK-0243', name: 'Duplicate Login', category: 'Feature', amount: 521782 },
  { id: 'TCK-0244', name: 'Stuck Search', category: 'Incident', amount: 113223 },
  { id: 'TCK-0245', name: 'Blank Search', category: 'Question', amount: 483392 },
  { id: 'TCK-0246', name: 'Hidden Report', category: 'Bug', amount: 170346 },
  { id: 'TCK-0247', name: 'Blank Login', category: 'Incident', amount: 591022 },
  { id: 'TCK-0248', name: 'Stale Invoice', category: 'Question', amount: 652912 },
  { id: 'TCK-0249', name: 'Broken Sidebar', category: 'Chore', amount: 986230 },
  { id: 'TCK-0250', name: 'Hidden Invoice', category: 'Bug', amount: 665098 },
  { id: 'TCK-0251', name: 'Duplicate Dashboard', category: 'Incident', amount: 690559 },
];

describe('TicketTable sorting', () => {
  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0249');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0244');
    cy.get('input[name=filter]').clear().type('dash');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0244');
    cy.get('input[name=filter]').clear().type('question');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0244');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0244');
  });

  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('TCK-0242');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
