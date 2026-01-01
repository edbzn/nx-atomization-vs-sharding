import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0398', name: 'Quarterly Hosting', category: 'Void', amount: 4872 },
  { id: 'INV-0399', name: 'Manual License', category: 'Overdue', amount: 529129 },
  { id: 'INV-0400', name: 'Urgent Renewal', category: 'Overdue', amount: 378460 },
  { id: 'INV-0401', name: 'Recurring Hosting', category: 'Sent', amount: 578803 },
  { id: 'INV-0402', name: 'Quarterly Setup', category: 'Void', amount: 312415 },
  { id: 'INV-0403', name: 'Annual Renewal', category: 'Paid', amount: 226249 },
  { id: 'INV-0404', name: 'Final Consulting', category: 'Void', amount: 996629 },
  { id: 'INV-0405', name: 'Final Upgrade', category: 'Void', amount: 712849 },
  { id: 'INV-0406', name: 'Manual Support', category: 'Paid', amount: 259812 },
  { id: 'INV-0407', name: 'Monthly Hosting', category: 'Void', amount: 640382 },
  { id: 'INV-0408', name: 'Manual Upgrade', category: 'Draft', amount: 807198 },
  { id: 'INV-0409', name: 'Interim Retainer', category: 'Sent', amount: 949251 },
  { id: 'INV-0410', name: 'Recurring Setup', category: 'Draft', amount: 605298 },
  { id: 'INV-0411', name: 'Interim Renewal', category: 'Draft', amount: 124737 },
  { id: 'INV-0412', name: 'Deferred Setup', category: 'Paid', amount: 568866 },
  { id: 'INV-0413', name: 'Deferred Training', category: 'Overdue', amount: 739945 },
  { id: 'INV-0414', name: 'Urgent Hosting', category: 'Void', amount: 973367 },
  { id: 'INV-0415', name: 'Recurring Retainer', category: 'Sent', amount: 581746 },
  { id: 'INV-0416', name: 'Quarterly Setup', category: 'Sent', amount: 487642 },
];

describe('InvoiceTable large dataset', () => {
  it('filters, sorts and pages through 19 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0408');
    cy.get('input[name=filter]').clear().type('INV-0398');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('supp');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0398');
  });
});
