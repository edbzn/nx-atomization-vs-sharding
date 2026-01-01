import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0103', name: 'Annual Training', category: 'Sent', amount: 279986 },
  { id: 'INV-0104', name: 'Partial Audit', category: 'Draft', amount: 221099 },
  { id: 'INV-0105', name: 'Partial Audit', category: 'Paid', amount: 314871 },
  { id: 'INV-0106', name: 'Final Support', category: 'Draft', amount: 966126 },
  { id: 'INV-0107', name: 'Urgent License', category: 'Sent', amount: 47771 },
  { id: 'INV-0108', name: 'Monthly Support', category: 'Void', amount: 608146 },
  { id: 'INV-0109', name: 'Deferred Renewal', category: 'Draft', amount: 899810 },
  { id: 'INV-0110', name: 'Partial Consulting', category: 'Void', amount: 445760 },
  { id: 'INV-0111', name: 'Manual Training', category: 'Void', amount: 614788 },
  { id: 'INV-0112', name: 'Final Retainer', category: 'Overdue', amount: 549152 },
  { id: 'INV-0113', name: 'Annual Retainer', category: 'Void', amount: 934773 },
  { id: 'INV-0114', name: 'Interim Training', category: 'Sent', amount: 183208 },
  { id: 'INV-0115', name: 'Manual Upgrade', category: 'Draft', amount: 776318 },
  { id: 'INV-0116', name: 'Urgent Renewal', category: 'Overdue', amount: 248511 },
  { id: 'INV-0117', name: 'Final Consulting', category: 'Draft', amount: 723552 },
  { id: 'INV-0118', name: 'Interim Training', category: 'Draft', amount: 506187 },
  { id: 'INV-0119', name: 'Recurring Audit', category: 'Overdue', amount: 38250 },
];

describe('InvoiceTable large dataset', () => {
  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0113');
    cy.get('input[name=filter]').clear().type('audit');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('Manua');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('inv-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 15 invoices', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0113');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0103');
  });

  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('train');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
  });
});
