import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0001', name: 'Deferred Support', category: 'Void', amount: 517948 },
  { id: 'INV-0002', name: 'Final Upgrade', category: 'Void', amount: 357481 },
  { id: 'INV-0003', name: 'Monthly Setup', category: 'Void', amount: 802663 },
  { id: 'INV-0004', name: 'Partial Retainer', category: 'Paid', amount: 288358 },
  { id: 'INV-0005', name: 'Deferred Training', category: 'Void', amount: 370095 },
  { id: 'INV-0006', name: 'Final Consulting', category: 'Void', amount: 568436 },
  { id: 'INV-0007', name: 'Manual Hosting', category: 'Sent', amount: 641055 },
  { id: 'INV-0008', name: 'Deferred Support', category: 'Paid', amount: 815786 },
  { id: 'INV-0009', name: 'Manual Hosting', category: 'Paid', amount: 401496 },
  { id: 'INV-0010', name: 'Deferred Audit', category: 'Draft', amount: 944568 },
  { id: 'INV-0011', name: 'Interim Hosting', category: 'Void', amount: 826805 },
  { id: 'INV-0012', name: 'Recurring License', category: 'Draft', amount: 926987 },
  { id: 'INV-0013', name: 'Interim License', category: 'Void', amount: 372371 },
];

describe('InvoiceTable empty results', () => {
  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0011');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0001');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0004');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0010');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0010');
    cy.get('input[name=filter]').clear().type('INV-0003');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Urgen');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
