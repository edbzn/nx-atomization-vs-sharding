import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0357', name: 'Monthly Upgrade', category: 'Sent', amount: 767435 },
  { id: 'INV-0358', name: 'Urgent License', category: 'Void', amount: 136394 },
  { id: 'INV-0359', name: 'Urgent Support', category: 'Paid', amount: 612741 },
  { id: 'INV-0360', name: 'Interim Audit', category: 'Overdue', amount: 592240 },
  { id: 'INV-0361', name: 'Monthly Support', category: 'Sent', amount: 229393 },
  { id: 'INV-0362', name: 'Quarterly Hosting', category: 'Draft', amount: 206920 },
  { id: 'INV-0363', name: 'Monthly Hosting', category: 'Paid', amount: 521479 },
  { id: 'INV-0364', name: 'Urgent Hosting', category: 'Overdue', amount: 645975 },
  { id: 'INV-0365', name: 'Annual Setup', category: 'Draft', amount: 362401 },
  { id: 'INV-0366', name: 'Recurring Renewal', category: 'Paid', amount: 974441 },
  { id: 'INV-0367', name: 'Recurring Setup', category: 'Overdue', amount: 249271 },
  { id: 'INV-0368', name: 'Manual Setup', category: 'Sent', amount: 584218 },
  { id: 'INV-0369', name: 'Partial Consulting', category: 'Draft', amount: 601594 },
  { id: 'INV-0370', name: 'Partial Consulting', category: 'Draft', amount: 724236 },
  { id: 'INV-0371', name: 'Final License', category: 'Void', amount: 917114 },
  { id: 'INV-0372', name: 'Annual Retainer', category: 'Sent', amount: 233078 },
  { id: 'INV-0373', name: 'Urgent Setup', category: 'Sent', amount: 937879 },
  { id: 'INV-0374', name: 'Monthly License', category: 'Sent', amount: 927060 },
  { id: 'INV-0375', name: 'Final License', category: 'Paid', amount: 600609 },
];

describe('InvoiceTable sorting', () => {
  it('filters, sorts and pages through 19 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0372');
    cy.get('input[name=filter]').clear().type('INV-0369');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0372');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0369');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0372');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0372');
  });

  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0367');
  });
});
