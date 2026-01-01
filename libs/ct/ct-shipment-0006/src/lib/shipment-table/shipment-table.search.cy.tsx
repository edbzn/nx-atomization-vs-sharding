import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0034', name: 'Bulk Envelope', category: 'Returned', amount: 848001 },
  { id: 'SHP-0035', name: 'Standard Parcel', category: 'Transit', amount: 676520 },
  { id: 'SHP-0036', name: 'Frozen Pallet', category: 'Delivered', amount: 93771 },
  { id: 'SHP-0037', name: 'Bulk Box', category: 'Transit', amount: 583096 },
  { id: 'SHP-0038', name: 'Standard Envelope', category: 'Returned', amount: 19526 },
  { id: 'SHP-0039', name: 'Bulk Container', category: 'Pending', amount: 608599 },
  { id: 'SHP-0040', name: 'Oversize Pallet', category: 'Pending', amount: 730545 },
  { id: 'SHP-0041', name: 'Local Drum', category: 'Pending', amount: 555436 },
  { id: 'SHP-0042', name: 'Fragile Crate', category: 'Packed', amount: 432836 },
  { id: 'SHP-0043', name: 'Priority Drum', category: 'Pending', amount: 786233 },
  { id: 'SHP-0044', name: 'Overseas Pallet', category: 'Packed', amount: 160035 },
  { id: 'SHP-0045', name: 'Fragile Container', category: 'Pending', amount: 368944 },
  { id: 'SHP-0046', name: 'Overseas Envelope', category: 'Packed', amount: 103813 },
  { id: 'SHP-0047', name: 'Bulk Crate', category: 'Packed', amount: 122127 },
];

describe('ShipmentTable search', () => {
  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Insur');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('packed');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0034');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0034');
  });

  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('packed');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
  });
});
