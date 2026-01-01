import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0129', name: 'Monthly Audit', category: 'Overdue', amount: 241983 },
  { id: 'INV-0130', name: 'Quarterly Renewal', category: 'Overdue', amount: 100842 },
  { id: 'INV-0131', name: 'Quarterly Support', category: 'Paid', amount: 183493 },
  { id: 'INV-0132', name: 'Urgent Renewal', category: 'Sent', amount: 914715 },
  { id: 'INV-0133', name: 'Partial Support', category: 'Paid', amount: 78529 },
  { id: 'INV-0134', name: 'Recurring Support', category: 'Void', amount: 599114 },
  { id: 'INV-0135', name: 'Monthly Training', category: 'Sent', amount: 911140 },
  { id: 'INV-0136', name: 'Urgent Audit', category: 'Draft', amount: 438981 },
  { id: 'INV-0137', name: 'Interim Support', category: 'Sent', amount: 919335 },
  { id: 'INV-0138', name: 'Urgent Retainer', category: 'Sent', amount: 195321 },
  { id: 'INV-0139', name: 'Urgent Renewal', category: 'Draft', amount: 426130 },
  { id: 'INV-0140', name: 'Quarterly Renewal', category: 'Paid', amount: 719519 },
  { id: 'INV-0141', name: 'Monthly Consulting', category: 'Sent', amount: 337207 },
  { id: 'INV-0142', name: 'Final Audit', category: 'Sent', amount: 398923 },
  { id: 'INV-0143', name: 'Annual Upgrade', category: 'Sent', amount: 254623 },
  { id: 'INV-0144', name: 'Annual Upgrade', category: 'Void', amount: 547664 },
  { id: 'INV-0145', name: 'Interim Audit', category: 'Paid', amount: 276240 },
  { id: 'INV-0146', name: 'Annual Renewal', category: 'Paid', amount: 254978 },
  { id: 'INV-0147', name: 'Urgent Retainer', category: 'Draft', amount: 860194 },
  { id: 'INV-0148', name: 'Partial Support', category: 'Sent', amount: 329612 },
];

describe('InvoiceTable pagination', () => {
  it('filters, sorts and pages through 20 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('INV-0132');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0129');
    cy.get('input[name=filter]').clear().type('suppor');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0133');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0133');
  });
});
