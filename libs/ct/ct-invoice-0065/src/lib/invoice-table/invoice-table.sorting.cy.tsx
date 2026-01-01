import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0024', name: 'Manual Retainer', category: 'Draft', amount: 841101 },
  { id: 'INV-0025', name: 'Interim Training', category: 'Draft', amount: 799419 },
  { id: 'INV-0026', name: 'Monthly Training', category: 'Draft', amount: 61171 },
  { id: 'INV-0027', name: 'Monthly License', category: 'Draft', amount: 949785 },
  { id: 'INV-0028', name: 'Manual License', category: 'Sent', amount: 80235 },
  { id: 'INV-0029', name: 'Annual Renewal', category: 'Draft', amount: 916124 },
  { id: 'INV-0030', name: 'Recurring Retainer', category: 'Paid', amount: 640474 },
  { id: 'INV-0031', name: 'Interim Training', category: 'Void', amount: 336890 },
  { id: 'INV-0032', name: 'Partial Renewal', category: 'Overdue', amount: 785707 },
  { id: 'INV-0033', name: 'Annual Training', category: 'Draft', amount: 617409 },
  { id: 'INV-0034', name: 'Annual Support', category: 'Draft', amount: 333160 },
  { id: 'INV-0035', name: 'Manual Renewal', category: 'Overdue', amount: 721732 },
  { id: 'INV-0036', name: 'Deferred Upgrade', category: 'Draft', amount: 300071 },
  { id: 'INV-0037', name: 'Partial Support', category: 'Overdue', amount: 376722 },
  { id: 'INV-0038', name: 'Quarterly Consulting', category: 'Overdue', amount: 767187 },
];

describe('InvoiceTable sorting', () => {
  it('filters, sorts and pages through 15 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0029');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0026');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0029');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0026');
  });

  it('filters, sorts and pages through 15 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('draft');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-8 of 8');
    cy.get('[data-testid=row]').should('have.length', 8);
  });
});
