import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0063', name: 'Fragile Pallet', category: 'Packed', amount: 282319 },
  { id: 'SHP-0064', name: 'Bulk Parcel', category: 'Transit', amount: 227001 },
  { id: 'SHP-0065', name: 'Bulk Parcel', category: 'Packed', amount: 984589 },
  { id: 'SHP-0066', name: 'Bulk Pallet', category: 'Transit', amount: 274633 },
  { id: 'SHP-0067', name: 'Priority Drum', category: 'Pending', amount: 501510 },
  { id: 'SHP-0068', name: 'Overseas Parcel', category: 'Pending', amount: 800712 },
  { id: 'SHP-0069', name: 'Express Container', category: 'Transit', amount: 405365 },
  { id: 'SHP-0070', name: 'Bulk Crate', category: 'Packed', amount: 737847 },
  { id: 'SHP-0071', name: 'Frozen Envelope', category: 'Transit', amount: 831463 },
  { id: 'SHP-0072', name: 'Express Pallet', category: 'Delivered', amount: 569788 },
  { id: 'SHP-0073', name: 'Bulk Box', category: 'Returned', amount: 688070 },
  { id: 'SHP-0074', name: 'Priority Sack', category: 'Transit', amount: 946794 },
  { id: 'SHP-0075', name: 'Insured Tube', category: 'Transit', amount: 534988 },
  { id: 'SHP-0076', name: 'Express Sack', category: 'Pending', amount: 257881 },
  { id: 'SHP-0077', name: 'Local Parcel', category: 'Pending', amount: 394993 },
];

describe('ShipmentTable search', () => {
  it('filters, sorts and pages through 15 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0063');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0063');
    cy.get('input[name=filter]').clear().type('SHP-0068');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0068');
    cy.get('input[name=filter]').clear().type('SHP-0077');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 15 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0063');
  });
});
