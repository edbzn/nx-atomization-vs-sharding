import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0199', name: 'Annual Hosting', category: 'Paid', amount: 396633 },
  { id: 'INV-0200', name: 'Monthly Consulting', category: 'Void', amount: 666566 },
  { id: 'INV-0201', name: 'Annual Training', category: 'Draft', amount: 933164 },
  { id: 'INV-0202', name: 'Manual Audit', category: 'Paid', amount: 838201 },
  { id: 'INV-0203', name: 'Annual Hosting', category: 'Overdue', amount: 273671 },
  { id: 'INV-0204', name: 'Manual Hosting', category: 'Void', amount: 30333 },
  { id: 'INV-0205', name: 'Quarterly License', category: 'Draft', amount: 493614 },
  { id: 'INV-0206', name: 'Annual Consulting', category: 'Sent', amount: 609006 },
  { id: 'INV-0207', name: 'Monthly Upgrade', category: 'Sent', amount: 349035 },
  { id: 'INV-0208', name: 'Annual Setup', category: 'Sent', amount: 461895 },
  { id: 'INV-0209', name: 'Monthly Support', category: 'Paid', amount: 925998 },
  { id: 'INV-0210', name: 'Partial Support', category: 'Draft', amount: 913293 },
  { id: 'INV-0211', name: 'Monthly Consulting', category: 'Sent', amount: 537891 },
  { id: 'INV-0212', name: 'Quarterly License', category: 'Void', amount: 147733 },
  { id: 'INV-0213', name: 'Recurring Setup', category: 'Overdue', amount: 915653 },
  { id: 'INV-0214', name: 'Manual Upgrade', category: 'Draft', amount: 591967 },
  { id: 'INV-0215', name: 'Annual Training', category: 'Draft', amount: 481808 },
  { id: 'INV-0216', name: 'Urgent Upgrade', category: 'Paid', amount: 432423 },
  { id: 'INV-0217', name: 'Interim Renewal', category: 'Overdue', amount: 42504 },
];

describe('InvoiceTable sorting', () => {
  it('filters, sorts and pages through 19 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('void');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('draft');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('input[name=filter]').clear().type('retain');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 18 invoices', () => {
    const rows = ROWS.slice(0, 18);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0199');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0209');
  });

  it('filters, sorts and pages through 16 invoices', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0209');
  });
});
