import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0273', name: 'Annual Audit', category: 'Void', amount: 80517 },
  { id: 'INV-0274', name: 'Interim Setup', category: 'Sent', amount: 575240 },
  { id: 'INV-0275', name: 'Quarterly Upgrade', category: 'Sent', amount: 440245 },
  { id: 'INV-0276', name: 'Final Hosting', category: 'Overdue', amount: 288329 },
  { id: 'INV-0277', name: 'Partial Hosting', category: 'Paid', amount: 258325 },
  { id: 'INV-0278', name: 'Monthly Training', category: 'Draft', amount: 172789 },
  { id: 'INV-0279', name: 'Quarterly Training', category: 'Paid', amount: 672308 },
  { id: 'INV-0280', name: 'Partial Training', category: 'Draft', amount: 452798 },
  { id: 'INV-0281', name: 'Deferred Consulting', category: 'Paid', amount: 618105 },
  { id: 'INV-0282', name: 'Partial Retainer', category: 'Paid', amount: 157179 },
  { id: 'INV-0283', name: 'Partial Setup', category: 'Paid', amount: 589062 },
  { id: 'INV-0284', name: 'Deferred Renewal', category: 'Void', amount: 540365 },
  { id: 'INV-0285', name: 'Interim Consulting', category: 'Overdue', amount: 494469 },
  { id: 'INV-0286', name: 'Partial Consulting', category: 'Void', amount: 745929 },
];

describe('InvoiceTable navigation', () => {
  it('filters, sorts and pages through 14 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('lic');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('inv-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0273');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0273');
  });
});
