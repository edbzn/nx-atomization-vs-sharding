import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0349', name: 'Urgent Audit', category: 'Sent', amount: 819309 },
  { id: 'INV-0350', name: 'Annual Audit', category: 'Overdue', amount: 2365 },
  { id: 'INV-0351', name: 'Quarterly License', category: 'Sent', amount: 125092 },
  { id: 'INV-0352', name: 'Interim Renewal', category: 'Draft', amount: 604891 },
  { id: 'INV-0353', name: 'Final Setup', category: 'Overdue', amount: 131545 },
  { id: 'INV-0354', name: 'Monthly Consulting', category: 'Paid', amount: 650791 },
  { id: 'INV-0355', name: 'Final Training', category: 'Sent', amount: 330446 },
  { id: 'INV-0356', name: 'Final Hosting', category: 'Paid', amount: 38725 },
  { id: 'INV-0357', name: 'Recurring Audit', category: 'Draft', amount: 121200 },
  { id: 'INV-0358', name: 'Monthly Setup', category: 'Void', amount: 388617 },
  { id: 'INV-0359', name: 'Quarterly Renewal', category: 'Draft', amount: 165835 },
  { id: 'INV-0360', name: 'Annual Support', category: 'Paid', amount: 521126 },
  { id: 'INV-0361', name: 'Urgent Setup', category: 'Void', amount: 157592 },
  { id: 'INV-0362', name: 'Annual Retainer', category: 'Overdue', amount: 905853 },
  { id: 'INV-0363', name: 'Interim Training', category: 'Sent', amount: 966427 },
  { id: 'INV-0364', name: 'Quarterly Audit', category: 'Void', amount: 868478 },
];

describe('InvoiceTable columns', () => {
  it('filters, sorts and pages through 16 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('paid');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('draft');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0349');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0359');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0349');
  });
});
