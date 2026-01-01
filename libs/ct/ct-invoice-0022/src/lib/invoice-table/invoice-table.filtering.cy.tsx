import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0192', name: 'Manual Support', category: 'Void', amount: 126416 },
  { id: 'INV-0193', name: 'Final Consulting', category: 'Paid', amount: 722781 },
  { id: 'INV-0194', name: 'Annual Renewal', category: 'Sent', amount: 436490 },
  { id: 'INV-0195', name: 'Final Training', category: 'Sent', amount: 797475 },
  { id: 'INV-0196', name: 'Final Audit', category: 'Overdue', amount: 208985 },
  { id: 'INV-0197', name: 'Recurring Consulting', category: 'Sent', amount: 530271 },
  { id: 'INV-0198', name: 'Monthly Setup', category: 'Sent', amount: 117636 },
  { id: 'INV-0199', name: 'Final Retainer', category: 'Overdue', amount: 449120 },
  { id: 'INV-0200', name: 'Partial Upgrade', category: 'Sent', amount: 561170 },
  { id: 'INV-0201', name: 'Recurring Upgrade', category: 'Paid', amount: 393779 },
  { id: 'INV-0202', name: 'Manual Consulting', category: 'Paid', amount: 853205 },
  { id: 'INV-0203', name: 'Monthly License', category: 'Overdue', amount: 668279 },
  { id: 'INV-0204', name: 'Interim Training', category: 'Void', amount: 452611 },
  { id: 'INV-0205', name: 'Monthly Consulting', category: 'Overdue', amount: 678732 },
  { id: 'INV-0206', name: 'Deferred Hosting', category: 'Void', amount: 966352 },
  { id: 'INV-0207', name: 'Quarterly Support', category: 'Sent', amount: 979863 },
  { id: 'INV-0208', name: 'Quarterly Consulting', category: 'Void', amount: 331940 },
  { id: 'INV-0209', name: 'Monthly Consulting', category: 'Overdue', amount: 786796 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 18 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0202');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0192');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0192');
  });

  it('filters, sorts and pages through 18 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0194');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0209');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0198');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0203');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0192');
    cy.get('input[name=filter]').clear().type('Annua');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('inv-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0192');
  });

  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0192');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0192');
  });
});
