import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0133', name: 'Partial Retainer', category: 'Overdue', amount: 263562 },
  { id: 'INV-0134', name: 'Recurring Hosting', category: 'Paid', amount: 703270 },
  { id: 'INV-0135', name: 'Interim License', category: 'Sent', amount: 944949 },
  { id: 'INV-0136', name: 'Recurring Setup', category: 'Overdue', amount: 383173 },
  { id: 'INV-0137', name: 'Interim Setup', category: 'Overdue', amount: 989755 },
  { id: 'INV-0138', name: 'Monthly Support', category: 'Paid', amount: 245894 },
  { id: 'INV-0139', name: 'Monthly Support', category: 'Paid', amount: 768423 },
  { id: 'INV-0140', name: 'Final Consulting', category: 'Overdue', amount: 29675 },
  { id: 'INV-0141', name: 'Quarterly Upgrade', category: 'Void', amount: 14080 },
  { id: 'INV-0142', name: 'Recurring Renewal', category: 'Void', amount: 555539 },
  { id: 'INV-0143', name: 'Manual License', category: 'Overdue', amount: 436315 },
  { id: 'INV-0144', name: 'Interim Training', category: 'Void', amount: 518409 },
  { id: 'INV-0145', name: 'Monthly Audit', category: 'Void', amount: 316888 },
  { id: 'INV-0146', name: 'Partial Consulting', category: 'Overdue', amount: 766894 },
  { id: 'INV-0147', name: 'Urgent Retainer', category: 'Void', amount: 534777 },
  { id: 'INV-0148', name: 'Partial Setup', category: 'Paid', amount: 339352 },
  { id: 'INV-0149', name: 'Partial Support', category: 'Paid', amount: 428967 },
  { id: 'INV-0150', name: 'Quarterly Audit', category: 'Overdue', amount: 302748 },
];

describe('InvoiceTable pagination', () => {
  it('filters, sorts and pages through 18 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0143');
    cy.get('input[name=filter]').clear().type('Part');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0133');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0140');
    cy.get('input[name=filter]').clear().type('Fin');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 14 invoices', () => {
    const rows = ROWS.slice(0, 14);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('ren');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
