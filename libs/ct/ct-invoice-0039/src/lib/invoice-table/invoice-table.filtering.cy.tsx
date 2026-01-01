import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0205', name: 'Manual Setup', category: 'Draft', amount: 763281 },
  { id: 'INV-0206', name: 'Recurring License', category: 'Paid', amount: 435512 },
  { id: 'INV-0207', name: 'Deferred Training', category: 'Sent', amount: 577025 },
  { id: 'INV-0208', name: 'Recurring Consulting', category: 'Sent', amount: 2803 },
  { id: 'INV-0209', name: 'Urgent License', category: 'Sent', amount: 531409 },
  { id: 'INV-0210', name: 'Quarterly Hosting', category: 'Void', amount: 726986 },
  { id: 'INV-0211', name: 'Annual Support', category: 'Void', amount: 122344 },
  { id: 'INV-0212', name: 'Recurring License', category: 'Sent', amount: 486560 },
  { id: 'INV-0213', name: 'Monthly Renewal', category: 'Draft', amount: 97179 },
  { id: 'INV-0214', name: 'Deferred License', category: 'Sent', amount: 898654 },
  { id: 'INV-0215', name: 'Partial Training', category: 'Draft', amount: 559139 },
  { id: 'INV-0216', name: 'Manual Hosting', category: 'Void', amount: 99782 },
  { id: 'INV-0217', name: 'Interim License', category: 'Void', amount: 842738 },
  { id: 'INV-0218', name: 'Recurring Upgrade', category: 'Overdue', amount: 912872 },
  { id: 'INV-0219', name: 'Monthly Consulting', category: 'Paid', amount: 488550 },
  { id: 'INV-0220', name: 'Urgent Audit', category: 'Sent', amount: 216697 },
  { id: 'INV-0221', name: 'Interim Retainer', category: 'Draft', amount: 730685 },
  { id: 'INV-0222', name: 'Recurring Support', category: 'Overdue', amount: 209750 },
  { id: 'INV-0223', name: 'Annual Consulting', category: 'Overdue', amount: 281583 },
  { id: 'INV-0224', name: 'Recurring Upgrade', category: 'Sent', amount: 432387 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 20 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('paid');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0206');
  });
});
