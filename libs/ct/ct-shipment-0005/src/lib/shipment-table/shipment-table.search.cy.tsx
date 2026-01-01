import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0272', name: 'Express Crate', category: 'Returned', amount: 903402 },
  { id: 'SHP-0273', name: 'Fragile Container', category: 'Returned', amount: 458229 },
  { id: 'SHP-0274', name: 'Oversize Box', category: 'Packed', amount: 443184 },
  { id: 'SHP-0275', name: 'Bulk Sack', category: 'Delivered', amount: 866476 },
  { id: 'SHP-0276', name: 'Express Pallet', category: 'Returned', amount: 514017 },
  { id: 'SHP-0277', name: 'Insured Bundle', category: 'Returned', amount: 920023 },
  { id: 'SHP-0278', name: 'Oversize Bundle', category: 'Packed', amount: 514237 },
  { id: 'SHP-0279', name: 'Local Tube', category: 'Delivered', amount: 896972 },
  { id: 'SHP-0280', name: 'Priority Drum', category: 'Transit', amount: 359196 },
  { id: 'SHP-0281', name: 'Standard Sack', category: 'Transit', amount: 988995 },
  { id: 'SHP-0282', name: 'Fragile Container', category: 'Returned', amount: 638691 },
  { id: 'SHP-0283', name: 'Local Tube', category: 'Delivered', amount: 839733 },
  { id: 'SHP-0284', name: 'Fragile Pallet', category: 'Returned', amount: 770773 },
  { id: 'SHP-0285', name: 'Oversize Drum', category: 'Pending', amount: 925784 },
  { id: 'SHP-0286', name: 'Insured Sack', category: 'Delivered', amount: 768516 },
  { id: 'SHP-0287', name: 'Insured Crate', category: 'Returned', amount: 353954 },
  { id: 'SHP-0288', name: 'Overseas Envelope', category: 'Delivered', amount: 914260 },
  { id: 'SHP-0289', name: 'Insured Envelope', category: 'Transit', amount: 198790 },
  { id: 'SHP-0290', name: 'Insured Crate', category: 'Transit', amount: 267154 },
  { id: 'SHP-0291', name: 'Bulk Tube', category: 'Packed', amount: 559890 },
];

describe('ShipmentTable search', () => {
  it('filters, sorts and pages through 20 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0282');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0282');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0272');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0289');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0286');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0272');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0289');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0289');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0272');
    cy.get('input[name=filter]').clear().type('SHP-0282');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
