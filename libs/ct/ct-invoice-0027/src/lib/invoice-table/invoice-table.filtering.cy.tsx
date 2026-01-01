import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0034', name: 'Partial Consulting', category: 'Draft', amount: 202758 },
  { id: 'INV-0035', name: 'Recurring Consulting', category: 'Paid', amount: 465149 },
  { id: 'INV-0036', name: 'Manual Training', category: 'Overdue', amount: 341344 },
  { id: 'INV-0037', name: 'Recurring License', category: 'Paid', amount: 270410 },
  { id: 'INV-0038', name: 'Quarterly Setup', category: 'Draft', amount: 338090 },
  { id: 'INV-0039', name: 'Partial Setup', category: 'Paid', amount: 933496 },
  { id: 'INV-0040', name: 'Final Upgrade', category: 'Sent', amount: 991498 },
  { id: 'INV-0041', name: 'Urgent Upgrade', category: 'Overdue', amount: 72605 },
  { id: 'INV-0042', name: 'Quarterly License', category: 'Void', amount: 752087 },
  { id: 'INV-0043', name: 'Deferred Upgrade', category: 'Sent', amount: 248987 },
  { id: 'INV-0044', name: 'Manual License', category: 'Void', amount: 360784 },
  { id: 'INV-0045', name: 'Final Consulting', category: 'Draft', amount: 863435 },
  { id: 'INV-0046', name: 'Partial License', category: 'Draft', amount: 393377 },
  { id: 'INV-0047', name: 'Interim Support', category: 'Overdue', amount: 93475 },
  { id: 'INV-0048', name: 'Quarterly License', category: 'Overdue', amount: 332669 },
  { id: 'INV-0049', name: 'Annual Upgrade', category: 'Draft', amount: 272620 },
  { id: 'INV-0050', name: 'Final Retainer', category: 'Draft', amount: 785030 },
  { id: 'INV-0051', name: 'Monthly Consulting', category: 'Paid', amount: 732920 },
  { id: 'INV-0052', name: 'Partial Audit', category: 'Overdue', amount: 906710 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 19 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0041');
    cy.get('input[name=filter]').clear().type('Recur');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0041');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0041');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0034');
  });
});
