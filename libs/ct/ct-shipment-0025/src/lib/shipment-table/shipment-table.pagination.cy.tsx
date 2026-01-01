import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0098', name: 'Local Tube', category: 'Returned', amount: 735950 },
  { id: 'SHP-0099', name: 'Local Crate', category: 'Packed', amount: 520308 },
  { id: 'SHP-0100', name: 'Standard Sack', category: 'Transit', amount: 206297 },
  { id: 'SHP-0101', name: 'Express Envelope', category: 'Returned', amount: 566025 },
  { id: 'SHP-0102', name: 'Overseas Tube', category: 'Packed', amount: 670896 },
  { id: 'SHP-0103', name: 'Frozen Box', category: 'Pending', amount: 760393 },
  { id: 'SHP-0104', name: 'Express Envelope', category: 'Pending', amount: 755536 },
  { id: 'SHP-0105', name: 'Express Sack', category: 'Pending', amount: 447809 },
  { id: 'SHP-0106', name: 'Fragile Parcel', category: 'Transit', amount: 67503 },
  { id: 'SHP-0107', name: 'Local Bundle', category: 'Delivered', amount: 845894 },
  { id: 'SHP-0108', name: 'Standard Crate', category: 'Delivered', amount: 379045 },
  { id: 'SHP-0109', name: 'Oversize Bundle', category: 'Delivered', amount: 834206 },
  { id: 'SHP-0110', name: 'Bulk Container', category: 'Pending', amount: 292132 },
  { id: 'SHP-0111', name: 'Overseas Sack', category: 'Packed', amount: 568576 },
  { id: 'SHP-0112', name: 'Bulk Bundle', category: 'Packed', amount: 875916 },
  { id: 'SHP-0113', name: 'Fragile Container', category: 'Delivered', amount: 963090 },
  { id: 'SHP-0114', name: 'Standard Pallet', category: 'Returned', amount: 776262 },
];

describe('ShipmentTable pagination', () => {
  it('filters, sorts and pages through 17 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0098');
    cy.get('input[name=filter]').clear().type('shp-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0110');
  });
});
