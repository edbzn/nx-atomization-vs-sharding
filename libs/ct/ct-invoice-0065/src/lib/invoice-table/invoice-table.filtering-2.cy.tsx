import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0005', name: 'Annual Consulting', category: 'Sent', amount: 548750 },
  { id: 'INV-0006', name: 'Interim Consulting', category: 'Paid', amount: 469233 },
  { id: 'INV-0007', name: 'Deferred Retainer', category: 'Void', amount: 303400 },
  { id: 'INV-0008', name: 'Urgent Audit', category: 'Void', amount: 818445 },
  { id: 'INV-0009', name: 'Deferred Audit', category: 'Void', amount: 531995 },
  { id: 'INV-0010', name: 'Recurring Renewal', category: 'Paid', amount: 460255 },
  { id: 'INV-0011', name: 'Partial Upgrade', category: 'Draft', amount: 330395 },
  { id: 'INV-0012', name: 'Manual Retainer', category: 'Void', amount: 686631 },
  { id: 'INV-0013', name: 'Recurring Renewal', category: 'Overdue', amount: 514433 },
  { id: 'INV-0014', name: 'Deferred Retainer', category: 'Draft', amount: 17621 },
  { id: 'INV-0015', name: 'Interim Support', category: 'Overdue', amount: 741936 },
  { id: 'INV-0016', name: 'Recurring Support', category: 'Sent', amount: 902447 },
  { id: 'INV-0017', name: 'Quarterly License', category: 'Sent', amount: 598177 },
  { id: 'INV-0018', name: 'Quarterly Training', category: 'Paid', amount: 452473 },
  { id: 'INV-0019', name: 'Deferred License', category: 'Overdue', amount: 348521 },
];

describe('InvoiceTable filtering 2', () => {
  it('filters, sorts and pages through 15 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('con');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0006');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0014');
    cy.get('input[name=filter]').clear().type('Fin');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0014');
    cy.get('input[name=filter]').clear().type('consul');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('inv-000');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
  });

  it('filters, sorts and pages through 15 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('traini');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
