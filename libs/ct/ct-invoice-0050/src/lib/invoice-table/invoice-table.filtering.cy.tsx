import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0263', name: 'Quarterly Support', category: 'Draft', amount: 236607 },
  { id: 'INV-0264', name: 'Deferred Setup', category: 'Draft', amount: 473602 },
  { id: 'INV-0265', name: 'Monthly Upgrade', category: 'Draft', amount: 536925 },
  { id: 'INV-0266', name: 'Monthly Training', category: 'Void', amount: 359044 },
  { id: 'INV-0267', name: 'Deferred Hosting', category: 'Overdue', amount: 872440 },
  { id: 'INV-0268', name: 'Final Consulting', category: 'Draft', amount: 183215 },
  { id: 'INV-0269', name: 'Partial Consulting', category: 'Void', amount: 964442 },
  { id: 'INV-0270', name: 'Recurring Training', category: 'Paid', amount: 535666 },
  { id: 'INV-0271', name: 'Annual Renewal', category: 'Void', amount: 472750 },
  { id: 'INV-0272', name: 'Manual Consulting', category: 'Draft', amount: 161258 },
  { id: 'INV-0273', name: 'Manual Support', category: 'Void', amount: 367648 },
  { id: 'INV-0274', name: 'Final Consulting', category: 'Sent', amount: 309112 },
  { id: 'INV-0275', name: 'Urgent Upgrade', category: 'Sent', amount: 116783 },
  { id: 'INV-0276', name: 'Recurring Consulting', category: 'Void', amount: 328567 },
  { id: 'INV-0277', name: 'Recurring Audit', category: 'Sent', amount: 125043 },
  { id: 'INV-0278', name: 'Recurring Renewal', category: 'Draft', amount: 96880 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 16 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('inv-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0263');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0271');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0275');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0272');
  });
});
