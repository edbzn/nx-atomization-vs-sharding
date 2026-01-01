import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0024', name: 'Standard Crate', category: 'Packed', amount: 345893 },
  { id: 'SHP-0025', name: 'Bulk Tube', category: 'Delivered', amount: 406049 },
  { id: 'SHP-0026', name: 'Express Crate', category: 'Delivered', amount: 902442 },
  { id: 'SHP-0027', name: 'Express Envelope', category: 'Returned', amount: 729404 },
  { id: 'SHP-0028', name: 'Overseas Parcel', category: 'Pending', amount: 525721 },
  { id: 'SHP-0029', name: 'Bulk Container', category: 'Returned', amount: 918284 },
  { id: 'SHP-0030', name: 'Bulk Box', category: 'Returned', amount: 875711 },
  { id: 'SHP-0031', name: 'Priority Parcel', category: 'Returned', amount: 848245 },
  { id: 'SHP-0032', name: 'Fragile Envelope', category: 'Returned', amount: 952446 },
  { id: 'SHP-0033', name: 'Insured Pallet', category: 'Transit', amount: 210099 },
  { id: 'SHP-0034', name: 'Frozen Crate', category: 'Pending', amount: 555374 },
  { id: 'SHP-0035', name: 'Express Sack', category: 'Transit', amount: 910506 },
  { id: 'SHP-0036', name: 'Oversize Sack', category: 'Delivered', amount: 581330 },
  { id: 'SHP-0037', name: 'Priority Sack', category: 'Packed', amount: 734927 },
  { id: 'SHP-0038', name: 'Insured Envelope', category: 'Delivered', amount: 581697 },
  { id: 'SHP-0039', name: 'Express Drum', category: 'Transit', amount: 876831 },
];

describe('ShipmentTable filtering', () => {
  it('filters, sorts and pages through 16 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0034');
    cy.get('input[name=filter]').clear().type('shp-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0024');
    cy.get('input[name=filter]').clear().type('returned');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0024');
    cy.get('input[name=filter]').clear().type('sack');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0024');
  });
});
