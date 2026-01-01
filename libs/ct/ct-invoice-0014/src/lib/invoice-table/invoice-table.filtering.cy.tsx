import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0036', name: 'Partial License', category: 'Overdue', amount: 896484 },
  { id: 'INV-0037', name: 'Interim Hosting', category: 'Overdue', amount: 601270 },
  { id: 'INV-0038', name: 'Urgent Consulting', category: 'Sent', amount: 159673 },
  { id: 'INV-0039', name: 'Monthly Upgrade', category: 'Overdue', amount: 786659 },
  { id: 'INV-0040', name: 'Final Audit', category: 'Paid', amount: 339003 },
  { id: 'INV-0041', name: 'Final Retainer', category: 'Overdue', amount: 782718 },
  { id: 'INV-0042', name: 'Final Consulting', category: 'Paid', amount: 568643 },
  { id: 'INV-0043', name: 'Annual Support', category: 'Paid', amount: 509248 },
  { id: 'INV-0044', name: 'Partial Renewal', category: 'Void', amount: 437832 },
  { id: 'INV-0045', name: 'Urgent Support', category: 'Paid', amount: 598805 },
  { id: 'INV-0046', name: 'Final Audit', category: 'Draft', amount: 802245 },
  { id: 'INV-0047', name: 'Annual Consulting', category: 'Void', amount: 424840 },
  { id: 'INV-0048', name: 'Deferred Support', category: 'Void', amount: 263722 },
  { id: 'INV-0049', name: 'Annual Retainer', category: 'Void', amount: 819003 },
  { id: 'INV-0050', name: 'Monthly Renewal', category: 'Paid', amount: 465369 },
  { id: 'INV-0051', name: 'Partial Upgrade', category: 'Sent', amount: 292137 },
  { id: 'INV-0052', name: 'Deferred Upgrade', category: 'Overdue', amount: 2332 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0036');
    cy.get('input[name=filter]').clear().type('Ann');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0036');
    cy.get('input[name=filter]').clear().type('Urge');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0036');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0052');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0052');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0047');
  });

  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0038');
  });

  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0046');
  });
});
