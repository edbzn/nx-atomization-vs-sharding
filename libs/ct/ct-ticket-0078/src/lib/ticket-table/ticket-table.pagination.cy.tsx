import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0146', name: 'Blank Payment', category: 'Feature', amount: 362410 },
  { id: 'TCK-0147', name: 'Wrong Search', category: 'Incident', amount: 113189 },
  { id: 'TCK-0148', name: 'Blank Dashboard', category: 'Question', amount: 241842 },
  { id: 'TCK-0149', name: 'Broken Dashboard', category: 'Feature', amount: 429635 },
  { id: 'TCK-0150', name: 'Slow Login', category: 'Incident', amount: 99829 },
  { id: 'TCK-0151', name: 'Wrong Sidebar', category: 'Feature', amount: 585204 },
  { id: 'TCK-0152', name: 'Hidden Search', category: 'Bug', amount: 470135 },
  { id: 'TCK-0153', name: 'Slow Invoice', category: 'Bug', amount: 4523 },
  { id: 'TCK-0154', name: 'Flaky Payment', category: 'Chore', amount: 591526 },
  { id: 'TCK-0155', name: 'Stale Sidebar', category: 'Incident', amount: 200735 },
  { id: 'TCK-0156', name: 'Wrong Upload', category: 'Chore', amount: 910213 },
  { id: 'TCK-0157', name: 'Duplicate Webhook', category: 'Question', amount: 999592 },
  { id: 'TCK-0158', name: 'Slow Payment', category: 'Chore', amount: 235294 },
  { id: 'TCK-0159', name: 'Flaky Webhook', category: 'Question', amount: 990052 },
  { id: 'TCK-0160', name: 'Blank Dashboard', category: 'Question', amount: 484965 },
  { id: 'TCK-0161', name: 'Duplicate Report', category: 'Question', amount: 878779 },
  { id: 'TCK-0162', name: 'Missing Report', category: 'Incident', amount: 902307 },
];

describe('TicketTable pagination', () => {
  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('sid');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0155');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0148');
  });
});
