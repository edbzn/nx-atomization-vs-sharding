import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0395', name: 'Slow Login', category: 'Chore', amount: 210138 },
  { id: 'TCK-0396', name: 'Missing Payment', category: 'Question', amount: 761091 },
  { id: 'TCK-0397', name: 'Stuck Report', category: 'Bug', amount: 265426 },
  { id: 'TCK-0398', name: 'Flaky Sidebar', category: 'Bug', amount: 615450 },
  { id: 'TCK-0399', name: 'Wrong Upload', category: 'Incident', amount: 64121 },
  { id: 'TCK-0400', name: 'Wrong Dashboard', category: 'Question', amount: 673272 },
  { id: 'TCK-0401', name: 'Blank Webhook', category: 'Incident', amount: 784093 },
  { id: 'TCK-0402', name: 'Flaky Login', category: 'Bug', amount: 378809 },
  { id: 'TCK-0403', name: 'Blank Dashboard', category: 'Incident', amount: 998797 },
  { id: 'TCK-0404', name: 'Blank Sidebar', category: 'Bug', amount: 123688 },
  { id: 'TCK-0405', name: 'Hidden Search', category: 'Question', amount: 875739 },
  { id: 'TCK-0406', name: 'Stale Search', category: 'Bug', amount: 209092 },
  { id: 'TCK-0407', name: 'Wrong Invoice', category: 'Chore', amount: 38260 },
  { id: 'TCK-0408', name: 'Missing Invoice', category: 'Bug', amount: 575946 },
  { id: 'TCK-0409', name: 'Broken Sidebar', category: 'Incident', amount: 514602 },
  { id: 'TCK-0410', name: 'Stuck Search', category: 'Bug', amount: 293600 },
  { id: 'TCK-0411', name: 'Blank Report', category: 'Incident', amount: 20206 },
  { id: 'TCK-0412', name: 'Slow Invoice', category: 'Bug', amount: 161020 },
  { id: 'TCK-0413', name: 'Broken Invoice', category: 'Chore', amount: 990416 },
];

describe('TicketTable pagination', () => {
  it('filters, sorts and pages through 19 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0395');
    cy.get('input[name=filter]').clear().type('TCK-0406');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('Dup');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('Bla');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
  });
});
