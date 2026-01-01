import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0273', name: 'Partial Upgrade', category: 'Paid', amount: 578098 },
  { id: 'INV-0274', name: 'Urgent Audit', category: 'Void', amount: 232026 },
  { id: 'INV-0275', name: 'Deferred Training', category: 'Draft', amount: 200108 },
  { id: 'INV-0276', name: 'Monthly Support', category: 'Draft', amount: 714681 },
  { id: 'INV-0277', name: 'Deferred Training', category: 'Sent', amount: 739725 },
  { id: 'INV-0278', name: 'Interim Retainer', category: 'Overdue', amount: 231152 },
  { id: 'INV-0279', name: 'Recurring Retainer', category: 'Paid', amount: 324610 },
  { id: 'INV-0280', name: 'Annual License', category: 'Void', amount: 86218 },
  { id: 'INV-0281', name: 'Manual Support', category: 'Paid', amount: 871384 },
  { id: 'INV-0282', name: 'Manual Consulting', category: 'Paid', amount: 696913 },
  { id: 'INV-0283', name: 'Partial Upgrade', category: 'Paid', amount: 631500 },
  { id: 'INV-0284', name: 'Partial Setup', category: 'Sent', amount: 749267 },
  { id: 'INV-0285', name: 'Deferred Retainer', category: 'Void', amount: 337666 },
];

describe('InvoiceTable sorting', () => {
  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0273');
    cy.get('input[name=filter]').clear().type('draft');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0273');
    cy.get('input[name=filter]').clear().type('INV-0277');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
