import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0390', name: 'Deferred Setup', category: 'Sent', amount: 119321 },
  { id: 'INV-0391', name: 'Monthly Retainer', category: 'Sent', amount: 745046 },
  { id: 'INV-0392', name: 'Monthly Retainer', category: 'Overdue', amount: 793966 },
  { id: 'INV-0393', name: 'Monthly Training', category: 'Sent', amount: 770448 },
  { id: 'INV-0394', name: 'Quarterly Audit', category: 'Void', amount: 588883 },
  { id: 'INV-0395', name: 'Annual Consulting', category: 'Void', amount: 587412 },
  { id: 'INV-0396', name: 'Interim Audit', category: 'Paid', amount: 657502 },
  { id: 'INV-0397', name: 'Urgent Consulting', category: 'Void', amount: 947460 },
  { id: 'INV-0398', name: 'Manual Consulting', category: 'Paid', amount: 842663 },
  { id: 'INV-0399', name: 'Manual Upgrade', category: 'Draft', amount: 792400 },
  { id: 'INV-0400', name: 'Urgent Audit', category: 'Paid', amount: 762125 },
  { id: 'INV-0401', name: 'Annual Consulting', category: 'Sent', amount: 636455 },
  { id: 'INV-0402', name: 'Partial License', category: 'Draft', amount: 576535 },
  { id: 'INV-0403', name: 'Interim Consulting', category: 'Paid', amount: 373704 },
  { id: 'INV-0404', name: 'Partial Training', category: 'Sent', amount: 914588 },
  { id: 'INV-0405', name: 'Interim Retainer', category: 'Overdue', amount: 721478 },
  { id: 'INV-0406', name: 'Final Retainer', category: 'Void', amount: 877876 },
  { id: 'INV-0407', name: 'Manual Upgrade', category: 'Sent', amount: 708919 },
  { id: 'INV-0408', name: 'Annual Hosting', category: 'Sent', amount: 102517 },
  { id: 'INV-0409', name: 'Interim License', category: 'Sent', amount: 179707 },
];

describe('InvoiceTable search', () => {
  it('filters, sorts and pages through 16 invoices', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0400');
    cy.get('input[name=filter]').clear().type('INV-0401');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
