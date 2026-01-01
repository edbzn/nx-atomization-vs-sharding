import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0259', name: 'Partial Upgrade', category: 'Void', amount: 337333 },
  { id: 'INV-0260', name: 'Partial Training', category: 'Sent', amount: 783955 },
  { id: 'INV-0261', name: 'Quarterly Renewal', category: 'Paid', amount: 592172 },
  { id: 'INV-0262', name: 'Recurring Support', category: 'Paid', amount: 526662 },
  { id: 'INV-0263', name: 'Deferred License', category: 'Void', amount: 497107 },
  { id: 'INV-0264', name: 'Urgent Support', category: 'Overdue', amount: 463039 },
  { id: 'INV-0265', name: 'Quarterly Training', category: 'Draft', amount: 62364 },
  { id: 'INV-0266', name: 'Final Support', category: 'Draft', amount: 521342 },
  { id: 'INV-0267', name: 'Urgent Consulting', category: 'Paid', amount: 664181 },
  { id: 'INV-0268', name: 'Manual Retainer', category: 'Sent', amount: 462672 },
  { id: 'INV-0269', name: 'Manual Upgrade', category: 'Overdue', amount: 930967 },
  { id: 'INV-0270', name: 'Recurring Setup', category: 'Void', amount: 915445 },
];

describe('InvoiceTable search', () => {
  it('filters, sorts and pages through 12 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0259');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0269');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0263');
    cy.get('input[name=filter]').clear().type('void');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0270');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0259');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0265');
  });

  it('filters, sorts and pages through 12 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0259');
  });

  it('filters, sorts and pages through 12 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0269');
  });
});
