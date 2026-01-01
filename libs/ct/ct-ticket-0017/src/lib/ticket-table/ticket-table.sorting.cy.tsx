import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0193', name: 'Duplicate Dashboard', category: 'Chore', amount: 731351 },
  { id: 'TCK-0194', name: 'Stuck Search', category: 'Feature', amount: 548081 },
  { id: 'TCK-0195', name: 'Broken Upload', category: 'Bug', amount: 617733 },
  { id: 'TCK-0196', name: 'Blank Invoice', category: 'Question', amount: 822004 },
  { id: 'TCK-0197', name: 'Stuck Webhook', category: 'Feature', amount: 696046 },
  { id: 'TCK-0198', name: 'Slow Upload', category: 'Question', amount: 379774 },
  { id: 'TCK-0199', name: 'Slow Search', category: 'Incident', amount: 29682 },
  { id: 'TCK-0200', name: 'Broken Login', category: 'Bug', amount: 422368 },
  { id: 'TCK-0201', name: 'Blank Upload', category: 'Bug', amount: 124551 },
  { id: 'TCK-0202', name: 'Missing Upload', category: 'Feature', amount: 136910 },
  { id: 'TCK-0203', name: 'Wrong Search', category: 'Question', amount: 385922 },
  { id: 'TCK-0204', name: 'Stuck Payment', category: 'Bug', amount: 179153 },
  { id: 'TCK-0205', name: 'Wrong Export', category: 'Chore', amount: 432293 },
];

describe('TicketTable sorting', () => {
  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0203');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0193');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0193');
  });

  it('filters, sorts and pages through 13 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0203');
  });
});
