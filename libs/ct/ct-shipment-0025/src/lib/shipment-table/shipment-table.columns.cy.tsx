import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0097', name: 'Overseas Sack', category: 'Returned', amount: 150171 },
  { id: 'SHP-0098', name: 'Priority Parcel', category: 'Pending', amount: 822706 },
  { id: 'SHP-0099', name: 'Fragile Bundle', category: 'Transit', amount: 251108 },
  { id: 'SHP-0100', name: 'Bulk Crate', category: 'Transit', amount: 37734 },
  { id: 'SHP-0101', name: 'Fragile Envelope', category: 'Delivered', amount: 947594 },
  { id: 'SHP-0102', name: 'Priority Crate', category: 'Returned', amount: 832123 },
  { id: 'SHP-0103', name: 'Standard Tube', category: 'Pending', amount: 742795 },
  { id: 'SHP-0104', name: 'Standard Container', category: 'Delivered', amount: 178366 },
  { id: 'SHP-0105', name: 'Oversize Crate', category: 'Transit', amount: 913835 },
  { id: 'SHP-0106', name: 'Insured Pallet', category: 'Returned', amount: 871260 },
  { id: 'SHP-0107', name: 'Overseas Sack', category: 'Returned', amount: 772886 },
  { id: 'SHP-0108', name: 'Bulk Sack', category: 'Packed', amount: 766923 },
  { id: 'SHP-0109', name: 'Standard Tube', category: 'Pending', amount: 562140 },
  { id: 'SHP-0110', name: 'Frozen Sack', category: 'Packed', amount: 106415 },
  { id: 'SHP-0111', name: 'Express Bundle', category: 'Returned', amount: 396155 },
  { id: 'SHP-0112', name: 'Frozen Pallet', category: 'Delivered', amount: 589573 },
];

describe('ShipmentTable columns', () => {
  it('filters, sorts and pages through 16 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0097');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0097');
  });

  it('filters, sorts and pages through 16 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0107');
  });
});
