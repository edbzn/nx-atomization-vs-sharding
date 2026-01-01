import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0241', name: 'Stuck Dashboard', category: 'Chore', amount: 374706 },
  { id: 'TCK-0242', name: 'Wrong Search', category: 'Chore', amount: 126559 },
  { id: 'TCK-0243', name: 'Flaky Payment', category: 'Question', amount: 224144 },
  { id: 'TCK-0244', name: 'Stale Export', category: 'Feature', amount: 964855 },
  { id: 'TCK-0245', name: 'Slow Search', category: 'Incident', amount: 910658 },
  { id: 'TCK-0246', name: 'Stale Dashboard', category: 'Chore', amount: 501128 },
  { id: 'TCK-0247', name: 'Broken Sidebar', category: 'Question', amount: 599779 },
  { id: 'TCK-0248', name: 'Blank Sidebar', category: 'Chore', amount: 403357 },
  { id: 'TCK-0249', name: 'Slow Invoice', category: 'Feature', amount: 689751 },
  { id: 'TCK-0250', name: 'Hidden Payment', category: 'Incident', amount: 186403 },
  { id: 'TCK-0251', name: 'Slow Sidebar', category: 'Chore', amount: 989880 },
  { id: 'TCK-0252', name: 'Stuck Dashboard', category: 'Feature', amount: 806175 },
  { id: 'TCK-0253', name: 'Blank Sidebar', category: 'Incident', amount: 352672 },
  { id: 'TCK-0254', name: 'Missing Payment', category: 'Chore', amount: 3556 },
  { id: 'TCK-0255', name: 'Stale Search', category: 'Incident', amount: 525330 },
];

describe('TicketTable filtering', () => {
  it('filters, sorts and pages through 15 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0251');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0241');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0241');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0251');
  });

  it('filters, sorts and pages through 14 tickets', () => {
    const rows = ROWS.slice(0, 14);
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('feature');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });
});
