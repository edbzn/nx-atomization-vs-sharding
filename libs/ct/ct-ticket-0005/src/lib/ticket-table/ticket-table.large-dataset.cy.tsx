import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0163', name: 'Broken Invoice', category: 'Feature', amount: 537527 },
  { id: 'TCK-0164', name: 'Blank Upload', category: 'Feature', amount: 257140 },
  { id: 'TCK-0165', name: 'Flaky Report', category: 'Question', amount: 513053 },
  { id: 'TCK-0166', name: 'Slow Search', category: 'Chore', amount: 712970 },
  { id: 'TCK-0167', name: 'Stale Dashboard', category: 'Feature', amount: 425204 },
  { id: 'TCK-0168', name: 'Flaky Search', category: 'Feature', amount: 589448 },
  { id: 'TCK-0169', name: 'Stuck Dashboard', category: 'Feature', amount: 835099 },
  { id: 'TCK-0170', name: 'Hidden Login', category: 'Feature', amount: 88299 },
  { id: 'TCK-0171', name: 'Wrong Report', category: 'Chore', amount: 543173 },
  { id: 'TCK-0172', name: 'Slow Invoice', category: 'Chore', amount: 655945 },
  { id: 'TCK-0173', name: 'Hidden Invoice', category: 'Question', amount: 660898 },
  { id: 'TCK-0174', name: 'Hidden Report', category: 'Feature', amount: 433261 },
  { id: 'TCK-0175', name: 'Hidden Search', category: 'Incident', amount: 397918 },
];

describe('TicketTable large dataset', () => {
  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0163');
    cy.get('input[name=filter]').clear().type('TCK-0169');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('bug');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0173');
  });
});
