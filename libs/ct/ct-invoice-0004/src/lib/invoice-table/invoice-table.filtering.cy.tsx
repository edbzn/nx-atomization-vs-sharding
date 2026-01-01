import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0059', name: 'Quarterly Support', category: 'Sent', amount: 929621 },
  { id: 'INV-0060', name: 'Recurring Training', category: 'Sent', amount: 751374 },
  { id: 'INV-0061', name: 'Recurring Retainer', category: 'Sent', amount: 849878 },
  { id: 'INV-0062', name: 'Deferred Consulting', category: 'Draft', amount: 34300 },
  { id: 'INV-0063', name: 'Monthly Hosting', category: 'Draft', amount: 804297 },
  { id: 'INV-0064', name: 'Deferred Hosting', category: 'Sent', amount: 714815 },
  { id: 'INV-0065', name: 'Deferred Setup', category: 'Paid', amount: 312645 },
  { id: 'INV-0066', name: 'Annual Training', category: 'Void', amount: 165892 },
  { id: 'INV-0067', name: 'Urgent Support', category: 'Paid', amount: 961867 },
  { id: 'INV-0068', name: 'Interim Hosting', category: 'Paid', amount: 808109 },
  { id: 'INV-0069', name: 'Recurring License', category: 'Paid', amount: 650148 },
  { id: 'INV-0070', name: 'Interim Support', category: 'Sent', amount: 212528 },
  { id: 'INV-0071', name: 'Monthly Audit', category: 'Sent', amount: 723472 },
  { id: 'INV-0072', name: 'Quarterly Hosting', category: 'Overdue', amount: 511587 },
  { id: 'INV-0073', name: 'Annual Renewal', category: 'Draft', amount: 871589 },
  { id: 'INV-0074', name: 'Urgent Audit', category: 'Void', amount: 751663 },
  { id: 'INV-0075', name: 'Partial Consulting', category: 'Overdue', amount: 813872 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('upg');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0059');
  });
});
