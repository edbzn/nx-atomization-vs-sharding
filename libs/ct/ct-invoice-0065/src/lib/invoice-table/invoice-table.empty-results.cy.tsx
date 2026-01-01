import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0235', name: 'Deferred License', category: 'Void', amount: 151364 },
  { id: 'INV-0236', name: 'Monthly Hosting', category: 'Draft', amount: 425393 },
  { id: 'INV-0237', name: 'Quarterly Training', category: 'Paid', amount: 986198 },
  { id: 'INV-0238', name: 'Recurring Consulting', category: 'Overdue', amount: 492820 },
  { id: 'INV-0239', name: 'Partial Support', category: 'Void', amount: 309953 },
  { id: 'INV-0240', name: 'Final Retainer', category: 'Draft', amount: 611900 },
  { id: 'INV-0241', name: 'Interim Renewal', category: 'Overdue', amount: 993289 },
  { id: 'INV-0242', name: 'Manual Support', category: 'Draft', amount: 503997 },
  { id: 'INV-0243', name: 'Recurring Renewal', category: 'Draft', amount: 902735 },
  { id: 'INV-0244', name: 'Interim Retainer', category: 'Void', amount: 361633 },
  { id: 'INV-0245', name: 'Manual Consulting', category: 'Paid', amount: 242476 },
  { id: 'INV-0246', name: 'Deferred License', category: 'Draft', amount: 60255 },
  { id: 'INV-0247', name: 'Monthly Audit', category: 'Void', amount: 23371 },
  { id: 'INV-0248', name: 'Interim Training', category: 'Sent', amount: 743176 },
  { id: 'INV-0249', name: 'Recurring Consulting', category: 'Paid', amount: 944033 },
  { id: 'INV-0250', name: 'Deferred Consulting', category: 'Draft', amount: 805212 },
  { id: 'INV-0251', name: 'Urgent Consulting', category: 'Overdue', amount: 140223 },
];

describe('InvoiceTable empty results', () => {
  it('filters, sorts and pages through 17 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Quart');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0235');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0245');
  });
});
