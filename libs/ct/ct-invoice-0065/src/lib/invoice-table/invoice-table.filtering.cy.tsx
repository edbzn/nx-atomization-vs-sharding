import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0366', name: 'Quarterly Audit', category: 'Sent', amount: 92706 },
  { id: 'INV-0367', name: 'Interim Audit', category: 'Overdue', amount: 918727 },
  { id: 'INV-0368', name: 'Urgent Hosting', category: 'Overdue', amount: 900469 },
  { id: 'INV-0369', name: 'Interim Consulting', category: 'Sent', amount: 471091 },
  { id: 'INV-0370', name: 'Quarterly Support', category: 'Sent', amount: 734656 },
  { id: 'INV-0371', name: 'Annual Audit', category: 'Paid', amount: 483221 },
  { id: 'INV-0372', name: 'Final Audit', category: 'Overdue', amount: 575614 },
  { id: 'INV-0373', name: 'Interim Setup', category: 'Overdue', amount: 764955 },
  { id: 'INV-0374', name: 'Recurring License', category: 'Paid', amount: 267818 },
  { id: 'INV-0375', name: 'Recurring Upgrade', category: 'Draft', amount: 601828 },
  { id: 'INV-0376', name: 'Monthly Renewal', category: 'Paid', amount: 153112 },
  { id: 'INV-0377', name: 'Final Support', category: 'Paid', amount: 682979 },
  { id: 'INV-0378', name: 'Annual Retainer', category: 'Overdue', amount: 952784 },
  { id: 'INV-0379', name: 'Deferred Setup', category: 'Void', amount: 755052 },
  { id: 'INV-0380', name: 'Monthly Hosting', category: 'Overdue', amount: 39193 },
  { id: 'INV-0381', name: 'Annual Audit', category: 'Void', amount: 760993 },
  { id: 'INV-0382', name: 'Manual Renewal', category: 'Overdue', amount: 917898 },
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
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0366');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0376');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0366');
  });

  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Mont');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0366');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0366');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0371');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0380');
    cy.get('input[name=filter]').clear().type('overdue');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-7 of 7');
    cy.get('[data-testid=row]').should('have.length', 7);
  });
});
