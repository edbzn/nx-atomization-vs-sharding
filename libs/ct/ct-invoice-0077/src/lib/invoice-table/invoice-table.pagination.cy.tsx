import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0205', name: 'Manual Training', category: 'Void', amount: 821566 },
  { id: 'INV-0206', name: 'Deferred Retainer', category: 'Sent', amount: 787764 },
  { id: 'INV-0207', name: 'Final Training', category: 'Draft', amount: 808687 },
  { id: 'INV-0208', name: 'Manual License', category: 'Sent', amount: 888543 },
  { id: 'INV-0209', name: 'Manual Audit', category: 'Paid', amount: 737410 },
  { id: 'INV-0210', name: 'Monthly Consulting', category: 'Overdue', amount: 974914 },
  { id: 'INV-0211', name: 'Manual Audit', category: 'Paid', amount: 140478 },
  { id: 'INV-0212', name: 'Urgent Hosting', category: 'Paid', amount: 936682 },
  { id: 'INV-0213', name: 'Final Retainer', category: 'Draft', amount: 928524 },
  { id: 'INV-0214', name: 'Monthly Retainer', category: 'Void', amount: 722804 },
  { id: 'INV-0215', name: 'Recurring Upgrade', category: 'Draft', amount: 557267 },
  { id: 'INV-0216', name: 'Partial Retainer', category: 'Draft', amount: 740884 },
  { id: 'INV-0217', name: 'Recurring Audit', category: 'Sent', amount: 433976 },
  { id: 'INV-0218', name: 'Monthly Consulting', category: 'Draft', amount: 700099 },
];

describe('InvoiceTable pagination', () => {
  it('filters, sorts and pages through 14 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0205');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0211');
    cy.get('input[name=filter]').clear().type('inv-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0205');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0206');
    cy.get('input[name=filter]').clear().type('inv-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0205');
  });
});
