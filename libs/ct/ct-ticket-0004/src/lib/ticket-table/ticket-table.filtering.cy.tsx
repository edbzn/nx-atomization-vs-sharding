import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0022', name: 'Slow Export', category: 'Incident', amount: 841162 },
  { id: 'TCK-0023', name: 'Missing Search', category: 'Question', amount: 896281 },
  { id: 'TCK-0024', name: 'Hidden Sidebar', category: 'Incident', amount: 758684 },
  { id: 'TCK-0025', name: 'Broken Login', category: 'Bug', amount: 950528 },
  { id: 'TCK-0026', name: 'Stuck Sidebar', category: 'Chore', amount: 682246 },
  { id: 'TCK-0027', name: 'Blank Payment', category: 'Bug', amount: 466859 },
  { id: 'TCK-0028', name: 'Hidden Login', category: 'Bug', amount: 481233 },
  { id: 'TCK-0029', name: 'Blank Payment', category: 'Question', amount: 764299 },
  { id: 'TCK-0030', name: 'Hidden Search', category: 'Incident', amount: 953179 },
  { id: 'TCK-0031', name: 'Stale Login', category: 'Question', amount: 868500 },
  { id: 'TCK-0032', name: 'Stale Export', category: 'Question', amount: 229388 },
  { id: 'TCK-0033', name: 'Missing Report', category: 'Incident', amount: 573544 },
  { id: 'TCK-0034', name: 'Stuck Search', category: 'Feature', amount: 929817 },
  { id: 'TCK-0035', name: 'Stuck Report', category: 'Incident', amount: 416675 },
  { id: 'TCK-0036', name: 'Stale Dashboard', category: 'Question', amount: 366721 },
  { id: 'TCK-0037', name: 'Hidden Login', category: 'Feature', amount: 399988 },
  { id: 'TCK-0038', name: 'Hidden Webhook', category: 'Incident', amount: 802773 },
  { id: 'TCK-0039', name: 'Hidden Login', category: 'Chore', amount: 243914 },
  { id: 'TCK-0040', name: 'Duplicate Login', category: 'Question', amount: 903710 },
];

describe('TicketTable filtering', () => {
  it('filters, sorts and pages through 19 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('question');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-6 of 6');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0022');
    cy.get('input[name=filter]').clear().type('incident');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-6 of 6');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-6 of 6');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0035');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0032');
    cy.get('input[name=filter]').clear().type('TCK-0028');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
