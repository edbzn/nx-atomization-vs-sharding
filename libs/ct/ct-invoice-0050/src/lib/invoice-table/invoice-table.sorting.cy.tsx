import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0334', name: 'Annual License', category: 'Void', amount: 793580 },
  { id: 'INV-0335', name: 'Partial Consulting', category: 'Void', amount: 410147 },
  { id: 'INV-0336', name: 'Manual License', category: 'Draft', amount: 994065 },
  { id: 'INV-0337', name: 'Quarterly Training', category: 'Overdue', amount: 987038 },
  { id: 'INV-0338', name: 'Monthly Audit', category: 'Overdue', amount: 293991 },
  { id: 'INV-0339', name: 'Urgent Retainer', category: 'Overdue', amount: 187043 },
  { id: 'INV-0340', name: 'Quarterly Consulting', category: 'Draft', amount: 794687 },
  { id: 'INV-0341', name: 'Manual Hosting', category: 'Sent', amount: 318054 },
  { id: 'INV-0342', name: 'Urgent License', category: 'Sent', amount: 90581 },
  { id: 'INV-0343', name: 'Final Consulting', category: 'Void', amount: 807794 },
  { id: 'INV-0344', name: 'Partial Upgrade', category: 'Void', amount: 897550 },
  { id: 'INV-0345', name: 'Urgent Training', category: 'Sent', amount: 435786 },
  { id: 'INV-0346', name: 'Recurring License', category: 'Draft', amount: 503845 },
  { id: 'INV-0347', name: 'Partial Training', category: 'Void', amount: 537466 },
  { id: 'INV-0348', name: 'Recurring Training', category: 'Overdue', amount: 396614 },
];

describe('InvoiceTable sorting', () => {
  it('filters, sorts and pages through 15 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0344');
    cy.get('input[name=filter]').clear().type('inv-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
