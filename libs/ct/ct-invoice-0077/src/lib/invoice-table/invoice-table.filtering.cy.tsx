import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0191', name: 'Partial Setup', category: 'Sent', amount: 805979 },
  { id: 'INV-0192', name: 'Quarterly Renewal', category: 'Void', amount: 201176 },
  { id: 'INV-0193', name: 'Monthly Hosting', category: 'Overdue', amount: 69028 },
  { id: 'INV-0194', name: 'Recurring Setup', category: 'Draft', amount: 183516 },
  { id: 'INV-0195', name: 'Recurring License', category: 'Draft', amount: 624649 },
  { id: 'INV-0196', name: 'Final Setup', category: 'Overdue', amount: 409862 },
  { id: 'INV-0197', name: 'Final Hosting', category: 'Sent', amount: 329296 },
  { id: 'INV-0198', name: 'Recurring Upgrade', category: 'Void', amount: 461472 },
  { id: 'INV-0199', name: 'Interim Hosting', category: 'Sent', amount: 199684 },
  { id: 'INV-0200', name: 'Manual Setup', category: 'Void', amount: 586581 },
  { id: 'INV-0201', name: 'Quarterly Renewal', category: 'Paid', amount: 881380 },
  { id: 'INV-0202', name: 'Final Support', category: 'Overdue', amount: 283856 },
  { id: 'INV-0203', name: 'Final Audit', category: 'Overdue', amount: 599371 },
  { id: 'INV-0204', name: 'Quarterly Hosting', category: 'Void', amount: 648655 },
  { id: 'INV-0205', name: 'Recurring Hosting', category: 'Void', amount: 106828 },
  { id: 'INV-0206', name: 'Interim Support', category: 'Paid', amount: 157808 },
  { id: 'INV-0207', name: 'Urgent Support', category: 'Overdue', amount: 82760 },
  { id: 'INV-0208', name: 'Urgent Renewal', category: 'Sent', amount: 593336 },
  { id: 'INV-0209', name: 'Manual Support', category: 'Overdue', amount: 683109 },
  { id: 'INV-0210', name: 'Partial Renewal', category: 'Paid', amount: 762077 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 19 invoices', () => {
    const rows = ROWS.slice(0, 19);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0193');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0203');
    cy.get('input[name=filter]').clear().type('INV-0198');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
