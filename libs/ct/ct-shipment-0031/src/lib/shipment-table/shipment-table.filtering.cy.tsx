import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0075', name: 'Standard Parcel', category: 'Packed', amount: 785131 },
  { id: 'SHP-0076', name: 'Insured Container', category: 'Transit', amount: 704561 },
  { id: 'SHP-0077', name: 'Frozen Envelope', category: 'Returned', amount: 311041 },
  { id: 'SHP-0078', name: 'Insured Box', category: 'Pending', amount: 818132 },
  { id: 'SHP-0079', name: 'Fragile Pallet', category: 'Returned', amount: 994344 },
  { id: 'SHP-0080', name: 'Insured Tube', category: 'Pending', amount: 280691 },
  { id: 'SHP-0081', name: 'Overseas Container', category: 'Packed', amount: 643556 },
  { id: 'SHP-0082', name: 'Oversize Pallet', category: 'Transit', amount: 985068 },
  { id: 'SHP-0083', name: 'Bulk Box', category: 'Delivered', amount: 72952 },
  { id: 'SHP-0084', name: 'Insured Tube', category: 'Transit', amount: 775110 },
  { id: 'SHP-0085', name: 'Frozen Container', category: 'Returned', amount: 843000 },
  { id: 'SHP-0086', name: 'Priority Bundle', category: 'Delivered', amount: 124553 },
  { id: 'SHP-0087', name: 'Overseas Drum', category: 'Packed', amount: 540037 },
  { id: 'SHP-0088', name: 'Insured Drum', category: 'Returned', amount: 431192 },
  { id: 'SHP-0089', name: 'Fragile Crate', category: 'Packed', amount: 101461 },
  { id: 'SHP-0090', name: 'Express Crate', category: 'Delivered', amount: 101185 },
  { id: 'SHP-0091', name: 'Priority Bundle', category: 'Returned', amount: 984727 },
  { id: 'SHP-0092', name: 'Local Envelope', category: 'Returned', amount: 857266 },
];

describe('ShipmentTable filtering', () => {
  it('filters, sorts and pages through 18 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0085');
    cy.get('input[name=filter]').clear().type('SHP-0077');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0075');
  });
});
