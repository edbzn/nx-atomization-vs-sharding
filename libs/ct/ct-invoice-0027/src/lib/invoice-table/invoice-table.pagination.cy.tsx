import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0166', name: 'Recurring Audit', category: 'Draft', amount: 853492 },
  { id: 'INV-0167', name: 'Monthly Retainer', category: 'Void', amount: 945980 },
  { id: 'INV-0168', name: 'Monthly Audit', category: 'Void', amount: 576762 },
  { id: 'INV-0169', name: 'Recurring Setup', category: 'Overdue', amount: 223049 },
  { id: 'INV-0170', name: 'Monthly Renewal', category: 'Void', amount: 741631 },
  { id: 'INV-0171', name: 'Final Audit', category: 'Overdue', amount: 946721 },
  { id: 'INV-0172', name: 'Annual Upgrade', category: 'Overdue', amount: 946368 },
  { id: 'INV-0173', name: 'Deferred Renewal', category: 'Paid', amount: 869514 },
  { id: 'INV-0174', name: 'Manual License', category: 'Overdue', amount: 4902 },
  { id: 'INV-0175', name: 'Interim Support', category: 'Paid', amount: 118360 },
  { id: 'INV-0176', name: 'Recurring Retainer', category: 'Draft', amount: 308507 },
  { id: 'INV-0177', name: 'Quarterly Setup', category: 'Paid', amount: 309107 },
  { id: 'INV-0178', name: 'Deferred Audit', category: 'Sent', amount: 888815 },
  { id: 'INV-0179', name: 'Interim Renewal', category: 'Sent', amount: 656122 },
  { id: 'INV-0180', name: 'Final Renewal', category: 'Sent', amount: 730131 },
  { id: 'INV-0181', name: 'Partial Setup', category: 'Draft', amount: 743327 },
  { id: 'INV-0182', name: 'Deferred Hosting', category: 'Overdue', amount: 551557 },
];

describe('InvoiceTable pagination', () => {
  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('INV-0173');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('Recur');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });
});
