import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0201', name: 'Deferred Retainer', category: 'Void', amount: 301734 },
  { id: 'INV-0202', name: 'Final Upgrade', category: 'Draft', amount: 232679 },
  { id: 'INV-0203', name: 'Manual Retainer', category: 'Sent', amount: 838480 },
  { id: 'INV-0204', name: 'Urgent License', category: 'Sent', amount: 995256 },
  { id: 'INV-0205', name: 'Quarterly Setup', category: 'Overdue', amount: 273924 },
  { id: 'INV-0206', name: 'Final Training', category: 'Draft', amount: 265321 },
  { id: 'INV-0207', name: 'Recurring Support', category: 'Sent', amount: 140396 },
  { id: 'INV-0208', name: 'Monthly Setup', category: 'Overdue', amount: 274276 },
  { id: 'INV-0209', name: 'Deferred Hosting', category: 'Draft', amount: 591782 },
  { id: 'INV-0210', name: 'Interim Renewal', category: 'Draft', amount: 11394 },
  { id: 'INV-0211', name: 'Quarterly Audit', category: 'Paid', amount: 721878 },
  { id: 'INV-0212', name: 'Recurring Renewal', category: 'Paid', amount: 441171 },
  { id: 'INV-0213', name: 'Recurring Training', category: 'Draft', amount: 620151 },
  { id: 'INV-0214', name: 'Annual Consulting', category: 'Overdue', amount: 294970 },
  { id: 'INV-0215', name: 'Urgent Setup', category: 'Void', amount: 365817 },
  { id: 'INV-0216', name: 'Deferred Retainer', category: 'Draft', amount: 235969 },
  { id: 'INV-0217', name: 'Recurring License', category: 'Draft', amount: 249420 },
  { id: 'INV-0218', name: 'Annual Retainer', category: 'Draft', amount: 990887 },
];

describe('InvoiceTable large dataset', () => {
  it('filters, sorts and pages through 18 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0201');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0201');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0201');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0210');
    cy.get('input[name=filter]').clear().type('sup');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 18 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0214');
  });
});
