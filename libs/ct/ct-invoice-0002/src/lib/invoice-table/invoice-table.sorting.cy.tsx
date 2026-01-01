import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0265', name: 'Deferred Renewal', category: 'Void', amount: 991786 },
  { id: 'INV-0266', name: 'Interim Audit', category: 'Overdue', amount: 574209 },
  { id: 'INV-0267', name: 'Quarterly Hosting', category: 'Overdue', amount: 623577 },
  { id: 'INV-0268', name: 'Annual Audit', category: 'Paid', amount: 238695 },
  { id: 'INV-0269', name: 'Interim License', category: 'Overdue', amount: 971384 },
  { id: 'INV-0270', name: 'Recurring Hosting', category: 'Sent', amount: 312159 },
  { id: 'INV-0271', name: 'Deferred Audit', category: 'Paid', amount: 340815 },
  { id: 'INV-0272', name: 'Partial Renewal', category: 'Paid', amount: 538459 },
  { id: 'INV-0273', name: 'Interim Training', category: 'Draft', amount: 610385 },
  { id: 'INV-0274', name: 'Interim License', category: 'Paid', amount: 682950 },
  { id: 'INV-0275', name: 'Recurring Retainer', category: 'Void', amount: 729948 },
  { id: 'INV-0276', name: 'Monthly Renewal', category: 'Void', amount: 560872 },
  { id: 'INV-0277', name: 'Deferred Upgrade', category: 'Draft', amount: 338790 },
  { id: 'INV-0278', name: 'Annual Consulting', category: 'Sent', amount: 999008 },
  { id: 'INV-0279', name: 'Partial Retainer', category: 'Void', amount: 563372 },
  { id: 'INV-0280', name: 'Annual License', category: 'Void', amount: 793537 },
  { id: 'INV-0281', name: 'Interim Setup', category: 'Overdue', amount: 567999 },
  { id: 'INV-0282', name: 'Quarterly Upgrade', category: 'Void', amount: 636518 },
  { id: 'INV-0283', name: 'Urgent Consulting', category: 'Sent', amount: 732453 },
  { id: 'INV-0284', name: 'Interim Setup', category: 'Void', amount: 493900 },
];

describe('InvoiceTable sorting', () => {
  it('filters, sorts and pages through 20 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('audit');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('INV-0279');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0265');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0265');
  });
});
