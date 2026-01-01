import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0267', name: 'Stuck Payment', category: 'Feature', amount: 199710 },
  { id: 'TCK-0268', name: 'Stale Report', category: 'Incident', amount: 146915 },
  { id: 'TCK-0269', name: 'Hidden Login', category: 'Feature', amount: 179295 },
  { id: 'TCK-0270', name: 'Broken Report', category: 'Bug', amount: 173603 },
  { id: 'TCK-0271', name: 'Stuck Invoice', category: 'Feature', amount: 181050 },
  { id: 'TCK-0272', name: 'Hidden Export', category: 'Incident', amount: 114829 },
  { id: 'TCK-0273', name: 'Missing Dashboard', category: 'Question', amount: 760814 },
  { id: 'TCK-0274', name: 'Hidden Sidebar', category: 'Feature', amount: 681207 },
  { id: 'TCK-0275', name: 'Hidden Dashboard', category: 'Bug', amount: 333371 },
  { id: 'TCK-0276', name: 'Blank Payment', category: 'Incident', amount: 183435 },
  { id: 'TCK-0277', name: 'Slow Payment', category: 'Question', amount: 236289 },
  { id: 'TCK-0278', name: 'Missing Invoice', category: 'Incident', amount: 578691 },
  { id: 'TCK-0279', name: 'Flaky Payment', category: 'Bug', amount: 570289 },
  { id: 'TCK-0280', name: 'Stale Dashboard', category: 'Bug', amount: 510158 },
  { id: 'TCK-0281', name: 'Blank Login', category: 'Incident', amount: 506944 },
  { id: 'TCK-0282', name: 'Slow Export', category: 'Chore', amount: 835310 },
  { id: 'TCK-0283', name: 'Missing Login', category: 'Chore', amount: 270785 },
];

describe('TicketTable search', () => {
  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('sideb');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0267');
    cy.get('input[name=filter]').clear().type('incident');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
  });

  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0272');
  });
});
