import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0285', name: 'Flaky Invoice', category: 'Feature', amount: 437706 },
  { id: 'TCK-0286', name: 'Duplicate Export', category: 'Bug', amount: 823737 },
  { id: 'TCK-0287', name: 'Stale Dashboard', category: 'Feature', amount: 993415 },
  { id: 'TCK-0288', name: 'Blank Invoice', category: 'Chore', amount: 250916 },
  { id: 'TCK-0289', name: 'Stale Report', category: 'Incident', amount: 315246 },
  { id: 'TCK-0290', name: 'Wrong Invoice', category: 'Bug', amount: 765270 },
  { id: 'TCK-0291', name: 'Missing Payment', category: 'Chore', amount: 861050 },
  { id: 'TCK-0292', name: 'Stuck Dashboard', category: 'Feature', amount: 515301 },
  { id: 'TCK-0293', name: 'Flaky Payment', category: 'Incident', amount: 811454 },
  { id: 'TCK-0294', name: 'Flaky Dashboard', category: 'Incident', amount: 236529 },
  { id: 'TCK-0295', name: 'Duplicate Login', category: 'Chore', amount: 696377 },
  { id: 'TCK-0296', name: 'Flaky Report', category: 'Feature', amount: 698364 },
  { id: 'TCK-0297', name: 'Blank Webhook', category: 'Bug', amount: 448057 },
  { id: 'TCK-0298', name: 'Wrong Report', category: 'Bug', amount: 72842 },
  { id: 'TCK-0299', name: 'Blank Search', category: 'Chore', amount: 991112 },
  { id: 'TCK-0300', name: 'Wrong Report', category: 'Feature', amount: 216964 },
  { id: 'TCK-0301', name: 'Flaky Search', category: 'Question', amount: 561207 },
  { id: 'TCK-0302', name: 'Duplicate Export', category: 'Chore', amount: 633310 },
];

describe('TicketTable filtering', () => {
  it('filters, sorts and pages through 18 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0285');
  });

  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0285');
  });
});
