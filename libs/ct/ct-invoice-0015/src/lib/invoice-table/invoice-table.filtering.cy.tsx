import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0372', name: 'Quarterly Support', category: 'Paid', amount: 415517 },
  { id: 'INV-0373', name: 'Recurring License', category: 'Overdue', amount: 940479 },
  { id: 'INV-0374', name: 'Final Hosting', category: 'Sent', amount: 593533 },
  { id: 'INV-0375', name: 'Annual Setup', category: 'Void', amount: 272765 },
  { id: 'INV-0376', name: 'Recurring Renewal', category: 'Overdue', amount: 349132 },
  { id: 'INV-0377', name: 'Interim Support', category: 'Overdue', amount: 701473 },
  { id: 'INV-0378', name: 'Interim Consulting', category: 'Sent', amount: 163973 },
  { id: 'INV-0379', name: 'Urgent Audit', category: 'Paid', amount: 856827 },
  { id: 'INV-0380', name: 'Urgent Upgrade', category: 'Sent', amount: 361953 },
  { id: 'INV-0381', name: 'Partial Training', category: 'Paid', amount: 437779 },
  { id: 'INV-0382', name: 'Quarterly Training', category: 'Paid', amount: 354834 },
  { id: 'INV-0383', name: 'Partial Renewal', category: 'Draft', amount: 27593 },
  { id: 'INV-0384', name: 'Final Support', category: 'Overdue', amount: 498815 },
  { id: 'INV-0385', name: 'Urgent Training', category: 'Paid', amount: 660145 },
  { id: 'INV-0386', name: 'Final Setup', category: 'Draft', amount: 103594 },
  { id: 'INV-0387', name: 'Quarterly License', category: 'Overdue', amount: 665270 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 16 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0382');
    cy.get('input[name=filter]').clear().type('sent');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0372');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0372');
  });

  it('filters, sorts and pages through 16 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0382');
  });
});
