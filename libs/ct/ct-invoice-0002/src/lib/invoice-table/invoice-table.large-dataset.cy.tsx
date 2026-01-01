import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0134', name: 'Manual Support', category: 'Paid', amount: 691408 },
  { id: 'INV-0135', name: 'Deferred Training', category: 'Overdue', amount: 443286 },
  { id: 'INV-0136', name: 'Urgent Support', category: 'Paid', amount: 617782 },
  { id: 'INV-0137', name: 'Recurring Setup', category: 'Overdue', amount: 786776 },
  { id: 'INV-0138', name: 'Manual Support', category: 'Draft', amount: 394276 },
  { id: 'INV-0139', name: 'Partial Retainer', category: 'Draft', amount: 691552 },
  { id: 'INV-0140', name: 'Deferred License', category: 'Void', amount: 218959 },
  { id: 'INV-0141', name: 'Interim Audit', category: 'Overdue', amount: 465382 },
  { id: 'INV-0142', name: 'Recurring Audit', category: 'Void', amount: 265871 },
  { id: 'INV-0143', name: 'Manual Hosting', category: 'Overdue', amount: 37886 },
  { id: 'INV-0144', name: 'Deferred Consulting', category: 'Draft', amount: 459389 },
  { id: 'INV-0145', name: 'Interim License', category: 'Draft', amount: 372013 },
  { id: 'INV-0146', name: 'Manual Retainer', category: 'Draft', amount: 320653 },
  { id: 'INV-0147', name: 'Annual Setup', category: 'Void', amount: 3261 },
  { id: 'INV-0148', name: 'Monthly Retainer', category: 'Draft', amount: 366225 },
  { id: 'INV-0149', name: 'Recurring Support', category: 'Sent', amount: 939553 },
  { id: 'INV-0150', name: 'Recurring Hosting', category: 'Overdue', amount: 293968 },
  { id: 'INV-0151', name: 'Manual License', category: 'Overdue', amount: 155218 },
];

describe('InvoiceTable large dataset', () => {
  it('filters, sorts and pages through 18 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0147');
    cy.get('input[name=filter]').clear().type('consu');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('inv-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0134');
  });
});
