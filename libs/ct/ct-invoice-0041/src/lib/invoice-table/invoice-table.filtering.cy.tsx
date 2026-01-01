import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0163', name: 'Partial Setup', category: 'Draft', amount: 899550 },
  { id: 'INV-0164', name: 'Manual Training', category: 'Paid', amount: 241714 },
  { id: 'INV-0165', name: 'Quarterly Consulting', category: 'Sent', amount: 694732 },
  { id: 'INV-0166', name: 'Interim Renewal', category: 'Paid', amount: 560994 },
  { id: 'INV-0167', name: 'Partial Hosting', category: 'Draft', amount: 772487 },
  { id: 'INV-0168', name: 'Annual Consulting', category: 'Draft', amount: 622680 },
  { id: 'INV-0169', name: 'Quarterly Upgrade', category: 'Paid', amount: 696130 },
  { id: 'INV-0170', name: 'Deferred Renewal', category: 'Void', amount: 889284 },
  { id: 'INV-0171', name: 'Monthly Upgrade', category: 'Paid', amount: 966222 },
  { id: 'INV-0172', name: 'Manual License', category: 'Overdue', amount: 350425 },
  { id: 'INV-0173', name: 'Recurring License', category: 'Void', amount: 259079 },
  { id: 'INV-0174', name: 'Quarterly Audit', category: 'Paid', amount: 165894 },
  { id: 'INV-0175', name: 'Annual Upgrade', category: 'Draft', amount: 190484 },
];

describe('InvoiceTable filtering', () => {
  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0174');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0163');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0173');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0163');
  });

  it('filters, sorts and pages through 13 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('INV-0175');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0163');
  });
});
