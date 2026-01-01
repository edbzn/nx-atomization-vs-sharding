import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0180', name: 'Local Tube', category: 'Returned', amount: 310358 },
  { id: 'SHP-0181', name: 'Overseas Box', category: 'Delivered', amount: 912464 },
  { id: 'SHP-0182', name: 'Frozen Envelope', category: 'Packed', amount: 940805 },
  { id: 'SHP-0183', name: 'Fragile Bundle', category: 'Transit', amount: 639100 },
  { id: 'SHP-0184', name: 'Bulk Envelope', category: 'Delivered', amount: 818872 },
  { id: 'SHP-0185', name: 'Local Crate', category: 'Transit', amount: 47375 },
  { id: 'SHP-0186', name: 'Overseas Drum', category: 'Packed', amount: 919813 },
  { id: 'SHP-0187', name: 'Overseas Pallet', category: 'Returned', amount: 594571 },
  { id: 'SHP-0188', name: 'Overseas Sack', category: 'Transit', amount: 924709 },
  { id: 'SHP-0189', name: 'Overseas Tube', category: 'Packed', amount: 305036 },
  { id: 'SHP-0190', name: 'Local Parcel', category: 'Packed', amount: 355659 },
  { id: 'SHP-0191', name: 'Bulk Pallet', category: 'Transit', amount: 320411 },
  { id: 'SHP-0192', name: 'Oversize Envelope', category: 'Packed', amount: 192038 },
  { id: 'SHP-0193', name: 'Overseas Tube', category: 'Transit', amount: 271504 },
  { id: 'SHP-0194', name: 'Express Crate', category: 'Returned', amount: 500794 },
];

describe('ShipmentTable large dataset', () => {
  it('filters, sorts and pages through 15 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0190');
    cy.get('input[name=filter]').clear().type('Froz');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('packed');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0180');
    cy.get('input[name=filter]').clear().type('Froze');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
