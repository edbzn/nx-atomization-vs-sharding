import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0046', name: 'Blank Report', category: 'Incident', amount: 35056 },
  { id: 'TCK-0047', name: 'Stuck Webhook', category: 'Bug', amount: 680131 },
  { id: 'TCK-0048', name: 'Duplicate Webhook', category: 'Incident', amount: 977218 },
  { id: 'TCK-0049', name: 'Stale Search', category: 'Chore', amount: 329741 },
  { id: 'TCK-0050', name: 'Hidden Sidebar', category: 'Incident', amount: 590042 },
  { id: 'TCK-0051', name: 'Blank Login', category: 'Bug', amount: 919286 },
  { id: 'TCK-0052', name: 'Slow Payment', category: 'Feature', amount: 538944 },
  { id: 'TCK-0053', name: 'Slow Payment', category: 'Bug', amount: 309125 },
  { id: 'TCK-0054', name: 'Missing Invoice', category: 'Bug', amount: 331911 },
  { id: 'TCK-0055', name: 'Hidden Upload', category: 'Question', amount: 918996 },
  { id: 'TCK-0056', name: 'Flaky Payment', category: 'Chore', amount: 830846 },
  { id: 'TCK-0057', name: 'Stuck Dashboard', category: 'Chore', amount: 165947 },
  { id: 'TCK-0058', name: 'Duplicate Payment', category: 'Bug', amount: 146065 },
  { id: 'TCK-0059', name: 'Broken Search', category: 'Bug', amount: 361457 },
  { id: 'TCK-0060', name: 'Stale Invoice', category: 'Question', amount: 552156 },
  { id: 'TCK-0061', name: 'Duplicate Webhook', category: 'Chore', amount: 481027 },
  { id: 'TCK-0062', name: 'Duplicate Invoice', category: 'Incident', amount: 718700 },
];

describe('TicketTable sorting', () => {
  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('chore');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0057');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0046');
  });

  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0056');
    cy.get('input[name=filter]').clear().type('tck-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0046');
    cy.get('input[name=filter]').clear().type('rep');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0046');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0046');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0050');
    cy.get('input[name=filter]').clear().type('incident');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear().type('Sta');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });

  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0056');
  });
});
