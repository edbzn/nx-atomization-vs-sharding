import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0346', name: 'Manual Hosting', category: 'Void', amount: 231236 },
  { id: 'INV-0347', name: 'Final Upgrade', category: 'Void', amount: 244960 },
  { id: 'INV-0348', name: 'Interim Hosting', category: 'Paid', amount: 682167 },
  { id: 'INV-0349', name: 'Quarterly Setup', category: 'Paid', amount: 311291 },
  { id: 'INV-0350', name: 'Final Training', category: 'Draft', amount: 965006 },
  { id: 'INV-0351', name: 'Partial Retainer', category: 'Overdue', amount: 785740 },
  { id: 'INV-0352', name: 'Final Upgrade', category: 'Sent', amount: 595378 },
  { id: 'INV-0353', name: 'Monthly Support', category: 'Overdue', amount: 156721 },
  { id: 'INV-0354', name: 'Partial Training', category: 'Draft', amount: 482523 },
  { id: 'INV-0355', name: 'Deferred Consulting', category: 'Void', amount: 288781 },
  { id: 'INV-0356', name: 'Monthly Consulting', category: 'Sent', amount: 47018 },
  { id: 'INV-0357', name: 'Recurring Training', category: 'Overdue', amount: 459262 },
  { id: 'INV-0358', name: 'Manual Support', category: 'Overdue', amount: 14613 },
  { id: 'INV-0359', name: 'Urgent License', category: 'Draft', amount: 42098 },
];

describe('InvoiceTable columns', () => {
  it('filters, sorts and pages through 14 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0356');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0356');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0356');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0346');
    cy.get('input[name=filter]').clear().type('paid');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });
});
