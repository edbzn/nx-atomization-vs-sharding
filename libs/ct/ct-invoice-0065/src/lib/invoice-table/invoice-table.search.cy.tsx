import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0304', name: 'Final Hosting', category: 'Paid', amount: 264639 },
  { id: 'INV-0305', name: 'Interim Training', category: 'Draft', amount: 568527 },
  { id: 'INV-0306', name: 'Deferred Setup', category: 'Draft', amount: 309873 },
  { id: 'INV-0307', name: 'Quarterly Consulting', category: 'Sent', amount: 45819 },
  { id: 'INV-0308', name: 'Deferred Audit', category: 'Void', amount: 938866 },
  { id: 'INV-0309', name: 'Final Setup', category: 'Void', amount: 556005 },
  { id: 'INV-0310', name: 'Deferred Upgrade', category: 'Sent', amount: 144409 },
  { id: 'INV-0311', name: 'Recurring License', category: 'Draft', amount: 499792 },
  { id: 'INV-0312', name: 'Annual Audit', category: 'Overdue', amount: 653174 },
  { id: 'INV-0313', name: 'Annual Setup', category: 'Draft', amount: 796078 },
  { id: 'INV-0314', name: 'Partial Upgrade', category: 'Void', amount: 61058 },
  { id: 'INV-0315', name: 'Urgent Support', category: 'Paid', amount: 284591 },
  { id: 'INV-0316', name: 'Final Training', category: 'Void', amount: 654261 },
  { id: 'INV-0317', name: 'Partial Audit', category: 'Sent', amount: 118125 },
  { id: 'INV-0318', name: 'Annual Retainer', category: 'Overdue', amount: 107810 },
  { id: 'INV-0319', name: 'Monthly Retainer', category: 'Sent', amount: 467508 },
  { id: 'INV-0320', name: 'Deferred Training', category: 'Draft', amount: 417460 },
];

describe('InvoiceTable search', () => {
  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('void');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0304');
    cy.get('input[name=filter]').clear().type('INV-0318');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0318');
  });
});
