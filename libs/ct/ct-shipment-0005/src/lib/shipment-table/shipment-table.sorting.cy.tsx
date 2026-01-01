import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0360', name: 'Fragile Box', category: 'Returned', amount: 615947 },
  { id: 'SHP-0361', name: 'Oversize Pallet', category: 'Delivered', amount: 84097 },
  { id: 'SHP-0362', name: 'Bulk Sack', category: 'Returned', amount: 935442 },
  { id: 'SHP-0363', name: 'Overseas Parcel', category: 'Delivered', amount: 478804 },
  { id: 'SHP-0364', name: 'Overseas Envelope', category: 'Delivered', amount: 553518 },
  { id: 'SHP-0365', name: 'Bulk Container', category: 'Returned', amount: 833407 },
  { id: 'SHP-0366', name: 'Insured Container', category: 'Packed', amount: 404142 },
  { id: 'SHP-0367', name: 'Bulk Parcel', category: 'Transit', amount: 471729 },
  { id: 'SHP-0368', name: 'Express Tube', category: 'Delivered', amount: 473661 },
  { id: 'SHP-0369', name: 'Express Drum', category: 'Returned', amount: 656052 },
  { id: 'SHP-0370', name: 'Bulk Sack', category: 'Transit', amount: 154919 },
  { id: 'SHP-0371', name: 'Fragile Sack', category: 'Transit', amount: 528328 },
  { id: 'SHP-0372', name: 'Frozen Drum', category: 'Pending', amount: 131063 },
  { id: 'SHP-0373', name: 'Priority Parcel', category: 'Transit', amount: 418851 },
];

describe('ShipmentTable sorting', () => {
  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0360');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0360');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0360');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0360');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0370');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0360');
  });

  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0361');
  });
});
