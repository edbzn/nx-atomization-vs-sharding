import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0056', name: 'Slow Invoice', category: 'Bug', amount: 73625 },
  { id: 'TCK-0057', name: 'Wrong Sidebar', category: 'Incident', amount: 187110 },
  { id: 'TCK-0058', name: 'Duplicate Webhook', category: 'Feature', amount: 776355 },
  { id: 'TCK-0059', name: 'Hidden Invoice', category: 'Chore', amount: 217947 },
  { id: 'TCK-0060', name: 'Broken Export', category: 'Question', amount: 946686 },
  { id: 'TCK-0061', name: 'Missing Export', category: 'Incident', amount: 229277 },
  { id: 'TCK-0062', name: 'Wrong Payment', category: 'Chore', amount: 998823 },
  { id: 'TCK-0063', name: 'Stuck Search', category: 'Incident', amount: 806585 },
  { id: 'TCK-0064', name: 'Blank Export', category: 'Bug', amount: 537810 },
  { id: 'TCK-0065', name: 'Duplicate Payment', category: 'Incident', amount: 397638 },
  { id: 'TCK-0066', name: 'Slow Sidebar', category: 'Feature', amount: 13309 },
  { id: 'TCK-0067', name: 'Stale Payment', category: 'Feature', amount: 297986 },
  { id: 'TCK-0068', name: 'Stuck Payment', category: 'Feature', amount: 431624 },
  { id: 'TCK-0069', name: 'Broken Upload', category: 'Incident', amount: 622393 },
];

describe('TicketTable navigation', () => {
  it('filters, sorts and pages through 14 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('TCK-0061');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0061');
  });
});
