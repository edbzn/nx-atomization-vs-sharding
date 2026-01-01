import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0173', name: 'Priority Container', category: 'Returned', amount: 134723 },
  { id: 'SHP-0174', name: 'Express Pallet', category: 'Transit', amount: 764733 },
  { id: 'SHP-0175', name: 'Bulk Drum', category: 'Packed', amount: 549374 },
  { id: 'SHP-0176', name: 'Bulk Pallet', category: 'Pending', amount: 372898 },
  { id: 'SHP-0177', name: 'Priority Pallet', category: 'Packed', amount: 34398 },
  { id: 'SHP-0178', name: 'Local Drum', category: 'Returned', amount: 865769 },
  { id: 'SHP-0179', name: 'Frozen Pallet', category: 'Delivered', amount: 519951 },
  { id: 'SHP-0180', name: 'Overseas Parcel', category: 'Pending', amount: 810408 },
  { id: 'SHP-0181', name: 'Fragile Container', category: 'Transit', amount: 163624 },
  { id: 'SHP-0182', name: 'Standard Tube', category: 'Delivered', amount: 692434 },
  { id: 'SHP-0183', name: 'Oversize Bundle', category: 'Returned', amount: 934014 },
  { id: 'SHP-0184', name: 'Bulk Envelope', category: 'Returned', amount: 279192 },
  { id: 'SHP-0185', name: 'Bulk Crate', category: 'Transit', amount: 69728 },
  { id: 'SHP-0186', name: 'Priority Bundle', category: 'Pending', amount: 507032 },
  { id: 'SHP-0187', name: 'Standard Tube', category: 'Returned', amount: 678487 },
  { id: 'SHP-0188', name: 'Frozen Sack', category: 'Pending', amount: 22615 },
  { id: 'SHP-0189', name: 'Express Crate', category: 'Returned', amount: 550044 },
];

describe('ShipmentTable filtering', () => {
  it('filters, sorts and pages through 17 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('packed');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('bundl');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });
});
