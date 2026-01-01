import { TicketTable } from './TicketTable';
import type { TicketRow } from '../types';

const ROWS: TicketRow[] = [
  { id: 'TCK-0340', name: 'Slow Search', category: 'Feature', amount: 888737 },
  { id: 'TCK-0341', name: 'Duplicate Invoice', category: 'Question', amount: 13268 },
  { id: 'TCK-0342', name: 'Wrong Invoice', category: 'Incident', amount: 246582 },
  { id: 'TCK-0343', name: 'Slow Webhook', category: 'Feature', amount: 475182 },
  { id: 'TCK-0344', name: 'Broken Upload', category: 'Bug', amount: 677649 },
  { id: 'TCK-0345', name: 'Broken Dashboard', category: 'Bug', amount: 114642 },
  { id: 'TCK-0346', name: 'Broken Sidebar', category: 'Feature', amount: 728143 },
  { id: 'TCK-0347', name: 'Broken Search', category: 'Chore', amount: 667929 },
  { id: 'TCK-0348', name: 'Hidden Upload', category: 'Question', amount: 342899 },
  { id: 'TCK-0349', name: 'Stale Dashboard', category: 'Question', amount: 367050 },
  { id: 'TCK-0350', name: 'Stuck Invoice', category: 'Chore', amount: 817911 },
  { id: 'TCK-0351', name: 'Flaky Upload', category: 'Question', amount: 502889 },
  { id: 'TCK-0352', name: 'Stuck Export', category: 'Feature', amount: 361804 },
  { id: 'TCK-0353', name: 'Blank Export', category: 'Question', amount: 510520 },
  { id: 'TCK-0354', name: 'Flaky Upload', category: 'Chore', amount: 934273 },
  { id: 'TCK-0355', name: 'Flaky Webhook', category: 'Incident', amount: 540042 },
  { id: 'TCK-0356', name: 'Wrong Search', category: 'Incident', amount: 435008 },
];

describe('TicketTable sorting', () => {
  it('filters, sorts and pages through 17 tickets', () => {
    const rows = ROWS;
    cy.mount(<TicketTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0340');
    cy.get('input[name=filter]').clear().type('TCK-0342');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'TCK-0342');
  });
});
