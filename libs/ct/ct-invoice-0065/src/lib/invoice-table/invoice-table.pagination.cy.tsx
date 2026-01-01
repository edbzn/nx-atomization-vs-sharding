import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0205', name: 'Manual Hosting', category: 'Void', amount: 99875 },
  { id: 'INV-0206', name: 'Recurring Setup', category: 'Void', amount: 153842 },
  { id: 'INV-0207', name: 'Deferred Hosting', category: 'Sent', amount: 471558 },
  { id: 'INV-0208', name: 'Partial Setup', category: 'Void', amount: 12300 },
  { id: 'INV-0209', name: 'Manual Training', category: 'Paid', amount: 651249 },
  { id: 'INV-0210', name: 'Monthly Hosting', category: 'Overdue', amount: 856538 },
  { id: 'INV-0211', name: 'Final Training', category: 'Sent', amount: 606508 },
  { id: 'INV-0212', name: 'Partial Hosting', category: 'Paid', amount: 468430 },
  { id: 'INV-0213', name: 'Interim Training', category: 'Paid', amount: 651066 },
  { id: 'INV-0214', name: 'Quarterly License', category: 'Draft', amount: 413367 },
  { id: 'INV-0215', name: 'Urgent License', category: 'Void', amount: 658648 },
  { id: 'INV-0216', name: 'Recurring Retainer', category: 'Paid', amount: 616303 },
  { id: 'INV-0217', name: 'Monthly Audit', category: 'Overdue', amount: 352591 },
  { id: 'INV-0218', name: 'Recurring License', category: 'Sent', amount: 572614 },
];

describe('InvoiceTable pagination', () => {
  it('filters, sorts and pages through 14 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Defe');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('inv-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0205');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0215');
  });
});
