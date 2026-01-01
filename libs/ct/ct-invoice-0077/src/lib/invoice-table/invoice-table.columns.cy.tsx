import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0086', name: 'Manual Renewal', category: 'Draft', amount: 871326 },
  { id: 'INV-0087', name: 'Final License', category: 'Paid', amount: 132471 },
  { id: 'INV-0088', name: 'Manual Upgrade', category: 'Paid', amount: 324933 },
  { id: 'INV-0089', name: 'Quarterly Retainer', category: 'Overdue', amount: 12049 },
  { id: 'INV-0090', name: 'Urgent Setup', category: 'Sent', amount: 927808 },
  { id: 'INV-0091', name: 'Deferred Consulting', category: 'Paid', amount: 580321 },
  { id: 'INV-0092', name: 'Monthly Training', category: 'Overdue', amount: 140212 },
  { id: 'INV-0093', name: 'Quarterly Training', category: 'Overdue', amount: 399597 },
  { id: 'INV-0094', name: 'Deferred Support', category: 'Draft', amount: 859988 },
  { id: 'INV-0095', name: 'Urgent Upgrade', category: 'Draft', amount: 329093 },
  { id: 'INV-0096', name: 'Quarterly Audit', category: 'Overdue', amount: 277727 },
  { id: 'INV-0097', name: 'Monthly Consulting', category: 'Draft', amount: 494039 },
  { id: 'INV-0098', name: 'Monthly Renewal', category: 'Sent', amount: 244614 },
  { id: 'INV-0099', name: 'Urgent Renewal', category: 'Paid', amount: 774066 },
  { id: 'INV-0100', name: 'Recurring Hosting', category: 'Paid', amount: 985474 },
];

describe('InvoiceTable columns', () => {
  it('filters, sorts and pages through 15 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0086');
    cy.get('input[name=filter]').clear().type('Fina');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('INV-0100');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
