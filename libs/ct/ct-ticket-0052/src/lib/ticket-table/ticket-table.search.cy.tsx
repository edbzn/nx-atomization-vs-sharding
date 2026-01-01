import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0071', name: 'Slow Export', category: 'Bug', amount: 8193 },
  { id: 'TCK-0072', name: 'Broken Upload', category: 'Feature', amount: 735762 },
  { id: 'TCK-0073', name: 'Wrong Webhook', category: 'Bug', amount: 591948 },
  { id: 'TCK-0074', name: 'Wrong Search', category: 'Question', amount: 729040 },
  { id: 'TCK-0075', name: 'Blank Webhook', category: 'Incident', amount: 118859 },
  { id: 'TCK-0076', name: 'Broken Sidebar', category: 'Question', amount: 993964 },
  { id: 'TCK-0077', name: 'Wrong Export', category: 'Feature', amount: 988551 },
  { id: 'TCK-0078', name: 'Broken Login', category: 'Question', amount: 816175 },
  { id: 'TCK-0079', name: 'Flaky Login', category: 'Bug', amount: 762218 },
  { id: 'TCK-0080', name: 'Missing Invoice', category: 'Incident', amount: 248576 },
  { id: 'TCK-0081', name: 'Missing Search', category: 'Question', amount: 175778 },
  { id: 'TCK-0082', name: 'Slow Invoice', category: 'Feature', amount: 854924 },
  { id: 'TCK-0083', name: 'Broken Report', category: 'Bug', amount: 397702 },
  { id: 'TCK-0084', name: 'Slow Dashboard', category: 'Feature', amount: 416704 },
  { id: 'TCK-0085', name: 'Flaky Report', category: 'Question', amount: 448727 },
  { id: 'TCK-0086', name: 'Slow Login', category: 'Bug', amount: 239452 },
  { id: 'TCK-0087', name: 'Stuck Payment', category: 'Feature', amount: 755786 },
  { id: 'TCK-0088', name: 'Missing Payment', category: 'Bug', amount: 629776 },
];

describe('TicketTable search', () => {
  it('filters, sorts and pages through 18 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('TCK-0075');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0071');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0081');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0075');
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('dashbo');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('tck-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
