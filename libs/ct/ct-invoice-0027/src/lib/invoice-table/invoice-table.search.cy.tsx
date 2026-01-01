import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0219', name: 'Urgent Support', category: 'Draft', amount: 214940 },
  { id: 'INV-0220', name: 'Recurring Training', category: 'Paid', amount: 220197 },
  { id: 'INV-0221', name: 'Annual Setup', category: 'Overdue', amount: 832212 },
  { id: 'INV-0222', name: 'Final Retainer', category: 'Overdue', amount: 209126 },
  { id: 'INV-0223', name: 'Final Hosting', category: 'Paid', amount: 252713 },
  { id: 'INV-0224', name: 'Manual Consulting', category: 'Draft', amount: 163849 },
  { id: 'INV-0225', name: 'Deferred License', category: 'Overdue', amount: 133627 },
  { id: 'INV-0226', name: 'Quarterly Retainer', category: 'Void', amount: 143916 },
  { id: 'INV-0227', name: 'Annual Consulting', category: 'Overdue', amount: 761239 },
  { id: 'INV-0228', name: 'Interim Consulting', category: 'Sent', amount: 983082 },
  { id: 'INV-0229', name: 'Monthly Hosting', category: 'Sent', amount: 236550 },
  { id: 'INV-0230', name: 'Final License', category: 'Paid', amount: 807677 },
  { id: 'INV-0231', name: 'Annual Audit', category: 'Void', amount: 94466 },
  { id: 'INV-0232', name: 'Interim Audit', category: 'Overdue', amount: 682686 },
  { id: 'INV-0233', name: 'Monthly Hosting', category: 'Overdue', amount: 514914 },
  { id: 'INV-0234', name: 'Partial License', category: 'Paid', amount: 612630 },
  { id: 'INV-0235', name: 'Quarterly Support', category: 'Sent', amount: 153016 },
  { id: 'INV-0236', name: 'Partial Retainer', category: 'Paid', amount: 213196 },
  { id: 'INV-0237', name: 'Recurring Hosting', category: 'Overdue', amount: 881967 },
  { id: 'INV-0238', name: 'Final Upgrade', category: 'Draft', amount: 985152 },
];

describe('InvoiceTable search', () => {
  it('filters, sorts and pages through 20 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0231');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0219');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0219');
    cy.get('input[name=filter]').clear().type('inv-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0231');
  });

  it('filters, sorts and pages through 15 invoices', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0229');
  });
});
