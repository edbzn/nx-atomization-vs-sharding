import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0093', name: 'Wrong Export', category: 'Incident', amount: 547763 },
  { id: 'TCK-0094', name: 'Broken Payment', category: 'Chore', amount: 995697 },
  { id: 'TCK-0095', name: 'Missing Upload', category: 'Feature', amount: 359447 },
  { id: 'TCK-0096', name: 'Missing Webhook', category: 'Bug', amount: 727925 },
  { id: 'TCK-0097', name: 'Stuck Upload', category: 'Bug', amount: 299497 },
  { id: 'TCK-0098', name: 'Missing Login', category: 'Incident', amount: 50300 },
  { id: 'TCK-0099', name: 'Blank Search', category: 'Chore', amount: 921155 },
  { id: 'TCK-0100', name: 'Broken Login', category: 'Chore', amount: 106925 },
  { id: 'TCK-0101', name: 'Flaky Search', category: 'Incident', amount: 933009 },
  { id: 'TCK-0102', name: 'Wrong Export', category: 'Question', amount: 494341 },
  { id: 'TCK-0103', name: 'Slow Webhook', category: 'Feature', amount: 734747 },
  { id: 'TCK-0104', name: 'Stale Export', category: 'Question', amount: 512873 },
  { id: 'TCK-0105', name: 'Flaky Upload', category: 'Chore', amount: 575200 },
  { id: 'TCK-0106', name: 'Duplicate Search', category: 'Question', amount: 213662 },
  { id: 'TCK-0107', name: 'Blank Upload', category: 'Incident', amount: 521027 },
  { id: 'TCK-0108', name: 'Stale Login', category: 'Chore', amount: 273101 },
  { id: 'TCK-0109', name: 'Slow Dashboard', category: 'Chore', amount: 93157 },
  { id: 'TCK-0110', name: 'Hidden Login', category: 'Question', amount: 594287 },
  { id: 'TCK-0111', name: 'Stale Payment', category: 'Feature', amount: 639028 },
];

describe('TicketTable large dataset', () => {
  it('filters, sorts and pages through 19 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0103');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0098');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0093');
  });

  it('filters, sorts and pages through 19 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Bla');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('TCK-0106');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0093');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0093');
    cy.get('input[name=filter]').clear().type('chore');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-6 of 6');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-6 of 6');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0109');
    cy.get('input[name=filter]').clear().type('bug');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });

  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0093');
  });
});
