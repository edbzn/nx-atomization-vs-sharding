import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0231', name: 'Quarterly License', category: 'Sent', amount: 797366 },
  { id: 'INV-0232', name: 'Manual License', category: 'Paid', amount: 994137 },
  { id: 'INV-0233', name: 'Manual Hosting', category: 'Overdue', amount: 305849 },
  { id: 'INV-0234', name: 'Quarterly Training', category: 'Draft', amount: 250165 },
  { id: 'INV-0235', name: 'Annual Upgrade', category: 'Sent', amount: 913320 },
  { id: 'INV-0236', name: 'Annual Consulting', category: 'Paid', amount: 405098 },
  { id: 'INV-0237', name: 'Deferred Support', category: 'Void', amount: 582133 },
  { id: 'INV-0238', name: 'Annual Audit', category: 'Void', amount: 341337 },
  { id: 'INV-0239', name: 'Annual Audit', category: 'Paid', amount: 373965 },
  { id: 'INV-0240', name: 'Annual Setup', category: 'Overdue', amount: 951404 },
  { id: 'INV-0241', name: 'Urgent Renewal', category: 'Draft', amount: 978728 },
  { id: 'INV-0242', name: 'Partial Support', category: 'Overdue', amount: 411416 },
  { id: 'INV-0243', name: 'Recurring Audit', category: 'Void', amount: 779700 },
];

describe('InvoiceTable empty results', () => {
  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0234');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0240');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0234');
    cy.get('input[name=filter]').clear().type('paid');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('inv-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
