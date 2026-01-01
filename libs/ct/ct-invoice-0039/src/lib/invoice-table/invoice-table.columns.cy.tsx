import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0150', name: 'Recurring Hosting', category: 'Void', amount: 983084 },
  { id: 'INV-0151', name: 'Manual Setup', category: 'Sent', amount: 61545 },
  { id: 'INV-0152', name: 'Recurring Hosting', category: 'Sent', amount: 423250 },
  { id: 'INV-0153', name: 'Quarterly Consulting', category: 'Paid', amount: 127188 },
  { id: 'INV-0154', name: 'Monthly Audit', category: 'Overdue', amount: 175434 },
  { id: 'INV-0155', name: 'Partial Audit', category: 'Draft', amount: 882375 },
  { id: 'INV-0156', name: 'Monthly Training', category: 'Sent', amount: 486629 },
  { id: 'INV-0157', name: 'Urgent Retainer', category: 'Paid', amount: 960444 },
  { id: 'INV-0158', name: 'Manual Consulting', category: 'Overdue', amount: 848653 },
  { id: 'INV-0159', name: 'Urgent Upgrade', category: 'Void', amount: 573009 },
  { id: 'INV-0160', name: 'Deferred Retainer', category: 'Sent', amount: 370060 },
  { id: 'INV-0161', name: 'Urgent License', category: 'Void', amount: 33406 },
  { id: 'INV-0162', name: 'Quarterly Support', category: 'Overdue', amount: 796707 },
  { id: 'INV-0163', name: 'Urgent Support', category: 'Paid', amount: 944661 },
  { id: 'INV-0164', name: 'Final Setup', category: 'Overdue', amount: 350891 },
  { id: 'INV-0165', name: 'Partial Setup', category: 'Draft', amount: 191183 },
  { id: 'INV-0166', name: 'Monthly Setup', category: 'Sent', amount: 330695 },
];

describe('InvoiceTable columns', () => {
  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0150');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0160');
    cy.get('input[name=filter]').clear().type('inv-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0150');
    cy.get('input[name=filter]').clear().type('traini');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0150');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0150');
  });
});
