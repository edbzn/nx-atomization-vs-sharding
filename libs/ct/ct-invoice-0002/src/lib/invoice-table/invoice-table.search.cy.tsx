import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0088', name: 'Urgent Audit', category: 'Sent', amount: 970964 },
  { id: 'INV-0089', name: 'Recurring Setup', category: 'Sent', amount: 258657 },
  { id: 'INV-0090', name: 'Partial Hosting', category: 'Paid', amount: 444300 },
  { id: 'INV-0091', name: 'Recurring Setup', category: 'Paid', amount: 361519 },
  { id: 'INV-0092', name: 'Urgent Upgrade', category: 'Overdue', amount: 100226 },
  { id: 'INV-0093', name: 'Final Upgrade', category: 'Void', amount: 979629 },
  { id: 'INV-0094', name: 'Annual Renewal', category: 'Paid', amount: 782677 },
  { id: 'INV-0095', name: 'Monthly Consulting', category: 'Overdue', amount: 920525 },
  { id: 'INV-0096', name: 'Partial Consulting', category: 'Paid', amount: 506540 },
  { id: 'INV-0097', name: 'Deferred Upgrade', category: 'Paid', amount: 980156 },
  { id: 'INV-0098', name: 'Monthly Support', category: 'Sent', amount: 518490 },
  { id: 'INV-0099', name: 'Annual Setup', category: 'Void', amount: 650009 },
  { id: 'INV-0100', name: 'Monthly Consulting', category: 'Paid', amount: 522390 },
  { id: 'INV-0101', name: 'Manual Training', category: 'Overdue', amount: 670295 },
  { id: 'INV-0102', name: 'Recurring Hosting', category: 'Void', amount: 736665 },
  { id: 'INV-0103', name: 'Urgent Audit', category: 'Draft', amount: 219113 },
  { id: 'INV-0104', name: 'Deferred Training', category: 'Overdue', amount: 421030 },
  { id: 'INV-0105', name: 'Recurring Consulting', category: 'Overdue', amount: 655189 },
];

describe('InvoiceTable search', () => {
  it('filters, sorts and pages through 18 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0098');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0088');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0088');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0088');
    cy.get('input[name=filter]').clear().type('setup');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });

  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0094');
  });
});
