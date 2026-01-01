import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0276', name: 'Manual Setup', category: 'Draft', amount: 863930 },
  { id: 'INV-0277', name: 'Interim Consulting', category: 'Overdue', amount: 619539 },
  { id: 'INV-0278', name: 'Quarterly License', category: 'Paid', amount: 681934 },
  { id: 'INV-0279', name: 'Interim License', category: 'Paid', amount: 699750 },
  { id: 'INV-0280', name: 'Quarterly Hosting', category: 'Void', amount: 345489 },
  { id: 'INV-0281', name: 'Monthly License', category: 'Draft', amount: 706420 },
  { id: 'INV-0282', name: 'Interim Hosting', category: 'Paid', amount: 467743 },
  { id: 'INV-0283', name: 'Annual Audit', category: 'Paid', amount: 857069 },
  { id: 'INV-0284', name: 'Recurring Training', category: 'Paid', amount: 182223 },
  { id: 'INV-0285', name: 'Quarterly Retainer', category: 'Void', amount: 395647 },
  { id: 'INV-0286', name: 'Recurring License', category: 'Sent', amount: 293953 },
  { id: 'INV-0287', name: 'Annual Hosting', category: 'Overdue', amount: 860397 },
  { id: 'INV-0288', name: 'Final Consulting', category: 'Void', amount: 958073 },
  { id: 'INV-0289', name: 'Annual Renewal', category: 'Void', amount: 253931 },
];

describe('InvoiceTable pagination', () => {
  it('filters, sorts and pages through 14 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0286');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0276');
    cy.get('input[name=filter]').clear().type('overdue');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });

  it('filters, sorts and pages through 14 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0276');
    cy.get('input[name=filter]').clear().type('INV-0283');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
