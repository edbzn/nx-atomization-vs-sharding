import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0146', name: 'Urgent Renewal', category: 'Sent', amount: 471542 },
  { id: 'INV-0147', name: 'Urgent Audit', category: 'Paid', amount: 51447 },
  { id: 'INV-0148', name: 'Interim License', category: 'Overdue', amount: 968099 },
  { id: 'INV-0149', name: 'Annual License', category: 'Void', amount: 733546 },
  { id: 'INV-0150', name: 'Final License', category: 'Paid', amount: 300094 },
  { id: 'INV-0151', name: 'Recurring Audit', category: 'Overdue', amount: 174030 },
  { id: 'INV-0152', name: 'Monthly Audit', category: 'Paid', amount: 145163 },
  { id: 'INV-0153', name: 'Interim License', category: 'Void', amount: 295664 },
  { id: 'INV-0154', name: 'Monthly Training', category: 'Paid', amount: 791846 },
  { id: 'INV-0155', name: 'Deferred Support', category: 'Overdue', amount: 96801 },
  { id: 'INV-0156', name: 'Recurring Hosting', category: 'Overdue', amount: 858558 },
  { id: 'INV-0157', name: 'Annual Support', category: 'Overdue', amount: 9450 },
  { id: 'INV-0158', name: 'Quarterly Upgrade', category: 'Paid', amount: 181931 },
  { id: 'INV-0159', name: 'Final Consulting', category: 'Void', amount: 908218 },
  { id: 'INV-0160', name: 'Partial Consulting', category: 'Sent', amount: 274342 },
  { id: 'INV-0161', name: 'Recurring Support', category: 'Sent', amount: 531986 },
  { id: 'INV-0162', name: 'Annual Renewal', category: 'Overdue', amount: 192477 },
  { id: 'INV-0163', name: 'Urgent Support', category: 'Overdue', amount: 984058 },
];

describe('InvoiceTable sorting', () => {
  it('filters, sorts and pages through 18 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0146');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0149');
    cy.get('input[name=filter]').clear().type('Inter');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0149');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0160');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0149');
    cy.get('input[name=filter]').clear().type('void');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });
});
