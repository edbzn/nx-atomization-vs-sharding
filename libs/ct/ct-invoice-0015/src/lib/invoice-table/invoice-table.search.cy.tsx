import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0287', name: 'Partial Setup', category: 'Paid', amount: 629532 },
  { id: 'INV-0288', name: 'Partial Training', category: 'Paid', amount: 530807 },
  { id: 'INV-0289', name: 'Partial Retainer', category: 'Void', amount: 277737 },
  { id: 'INV-0290', name: 'Final Audit', category: 'Paid', amount: 326027 },
  { id: 'INV-0291', name: 'Partial Renewal', category: 'Void', amount: 420148 },
  { id: 'INV-0292', name: 'Monthly Audit', category: 'Paid', amount: 235336 },
  { id: 'INV-0293', name: 'Interim Consulting', category: 'Paid', amount: 150392 },
  { id: 'INV-0294', name: 'Urgent Audit', category: 'Draft', amount: 797717 },
  { id: 'INV-0295', name: 'Interim Consulting', category: 'Draft', amount: 180415 },
  { id: 'INV-0296', name: 'Urgent Training', category: 'Sent', amount: 433914 },
  { id: 'INV-0297', name: 'Deferred Renewal', category: 'Draft', amount: 405007 },
  { id: 'INV-0298', name: 'Interim Consulting', category: 'Paid', amount: 114551 },
  { id: 'INV-0299', name: 'Urgent License', category: 'Sent', amount: 308076 },
  { id: 'INV-0300', name: 'Urgent Upgrade', category: 'Paid', amount: 352335 },
  { id: 'INV-0301', name: 'Monthly Consulting', category: 'Void', amount: 501815 },
  { id: 'INV-0302', name: 'Recurring Hosting', category: 'Overdue', amount: 968901 },
  { id: 'INV-0303', name: 'Deferred Training', category: 'Draft', amount: 792818 },
  { id: 'INV-0304', name: 'Interim Support', category: 'Sent', amount: 340355 },
  { id: 'INV-0305', name: 'Partial Audit', category: 'Void', amount: 568367 },
  { id: 'INV-0306', name: 'Recurring Upgrade', category: 'Overdue', amount: 918785 },
];

describe('InvoiceTable search', () => {
  it('filters, sorts and pages through 20 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0297');
    cy.get('input[name=filter]').clear().type('sent');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0299');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0298');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0291');
    cy.get('input[name=filter]').clear().type('INV-0294');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
