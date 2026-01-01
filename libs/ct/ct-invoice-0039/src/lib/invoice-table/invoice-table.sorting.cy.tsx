import { InvoiceTable } from './InvoiceTable';
import type { InvoiceRow } from '../types';

const ROWS: InvoiceRow[] = [
  { id: 'INV-0307', name: 'Final Consulting', category: 'Paid', amount: 276725 },
  { id: 'INV-0308', name: 'Deferred Hosting', category: 'Overdue', amount: 170391 },
  { id: 'INV-0309', name: 'Monthly Upgrade', category: 'Draft', amount: 869014 },
  { id: 'INV-0310', name: 'Recurring License', category: 'Paid', amount: 102885 },
  { id: 'INV-0311', name: 'Deferred Upgrade', category: 'Paid', amount: 151095 },
  { id: 'INV-0312', name: 'Quarterly Hosting', category: 'Overdue', amount: 411586 },
  { id: 'INV-0313', name: 'Monthly Training', category: 'Sent', amount: 969077 },
  { id: 'INV-0314', name: 'Deferred Audit', category: 'Overdue', amount: 856626 },
  { id: 'INV-0315', name: 'Recurring Renewal', category: 'Draft', amount: 372390 },
  { id: 'INV-0316', name: 'Final Retainer', category: 'Overdue', amount: 354983 },
  { id: 'INV-0317', name: 'Manual Renewal', category: 'Paid', amount: 523029 },
  { id: 'INV-0318', name: 'Final Hosting', category: 'Paid', amount: 493980 },
  { id: 'INV-0319', name: 'Deferred Consulting', category: 'Overdue', amount: 319448 },
  { id: 'INV-0320', name: 'Manual Setup', category: 'Void', amount: 310194 },
];

describe('InvoiceTable sorting', () => {
  it('filters, sorts and pages through 14 invoices', () => {
    const rows = ROWS;
    cy.mount(<InvoiceTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('INV-0316');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('inv-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('aud');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'INV-0314');
    cy.get('input[name=filter]').clear().type('overdue');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
  });
});
