import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0370', name: 'Urgent Consulting', category: 'Draft', amount: 271185 },
  { id: 'INV-0371', name: 'Monthly Training', category: 'Void', amount: 868693 },
  { id: 'INV-0372', name: 'Manual Setup', category: 'Void', amount: 111008 },
  { id: 'INV-0373', name: 'Monthly Hosting', category: 'Draft', amount: 407299 },
  { id: 'INV-0374', name: 'Partial Upgrade', category: 'Sent', amount: 779936 },
  { id: 'INV-0375', name: 'Interim Training', category: 'Overdue', amount: 993878 },
  { id: 'INV-0376', name: 'Manual Training', category: 'Paid', amount: 917621 },
  { id: 'INV-0377', name: 'Interim Setup', category: 'Overdue', amount: 426176 },
  { id: 'INV-0378', name: 'Quarterly Setup', category: 'Paid', amount: 671411 },
  { id: 'INV-0379', name: 'Partial License', category: 'Paid', amount: 294019 },
  { id: 'INV-0380', name: 'Manual Hosting', category: 'Paid', amount: 490092 },
  { id: 'INV-0381', name: 'Quarterly Support', category: 'Overdue', amount: 948206 },
  { id: 'INV-0382', name: 'Deferred Support', category: 'Paid', amount: 732809 },
  { id: 'INV-0383', name: 'Annual Renewal', category: 'Sent', amount: 166554 },
  { id: 'INV-0384', name: 'Interim License', category: 'Sent', amount: 203945 },
];

describe('InvoiceTable columns', () => {
  it('filters, sorts and pages through 15 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('INV-0372');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0370');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0380');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0370');
    cy.get('input[name=filter]').clear().type('INV-0372');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0370');
  });
});
