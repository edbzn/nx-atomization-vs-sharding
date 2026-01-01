import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0059', name: 'Partial Support', category: 'Paid', amount: 538243 },
  { id: 'INV-0060', name: 'Final Hosting', category: 'Sent', amount: 540904 },
  { id: 'INV-0061', name: 'Partial Training', category: 'Draft', amount: 39254 },
  { id: 'INV-0062', name: 'Partial Hosting', category: 'Paid', amount: 435323 },
  { id: 'INV-0063', name: 'Final License', category: 'Draft', amount: 103423 },
  { id: 'INV-0064', name: 'Quarterly Audit', category: 'Sent', amount: 293758 },
  { id: 'INV-0065', name: 'Monthly Support', category: 'Draft', amount: 375819 },
  { id: 'INV-0066', name: 'Recurring Renewal', category: 'Sent', amount: 95819 },
  { id: 'INV-0067', name: 'Monthly Audit', category: 'Sent', amount: 923917 },
  { id: 'INV-0068', name: 'Partial Retainer', category: 'Paid', amount: 706225 },
  { id: 'INV-0069', name: 'Partial Audit', category: 'Paid', amount: 500734 },
  { id: 'INV-0070', name: 'Final License', category: 'Void', amount: 629532 },
  { id: 'INV-0071', name: 'Urgent Hosting', category: 'Overdue', amount: 323065 },
  { id: 'INV-0072', name: 'Recurring Retainer', category: 'Sent', amount: 698477 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 14 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0060');
    cy.get('input[name=filter]').clear().type('void');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('void');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0060');
  });
});
