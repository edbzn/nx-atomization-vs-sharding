import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0325', name: 'Insured Drum', category: 'Returned', amount: 33384 },
  { id: 'SHP-0326', name: 'Priority Crate', category: 'Delivered', amount: 92750 },
  { id: 'SHP-0327', name: 'Oversize Parcel', category: 'Delivered', amount: 229027 },
  { id: 'SHP-0328', name: 'Local Bundle', category: 'Pending', amount: 685215 },
  { id: 'SHP-0329', name: 'Local Sack', category: 'Returned', amount: 749594 },
  { id: 'SHP-0330', name: 'Overseas Parcel', category: 'Returned', amount: 360297 },
  { id: 'SHP-0331', name: 'Overseas Pallet', category: 'Delivered', amount: 87293 },
  { id: 'SHP-0332', name: 'Local Bundle', category: 'Returned', amount: 673029 },
  { id: 'SHP-0333', name: 'Frozen Parcel', category: 'Transit', amount: 994084 },
  { id: 'SHP-0334', name: 'Bulk Pallet', category: 'Delivered', amount: 246966 },
  { id: 'SHP-0335', name: 'Frozen Envelope', category: 'Packed', amount: 863972 },
  { id: 'SHP-0336', name: 'Frozen Parcel', category: 'Delivered', amount: 890590 },
  { id: 'SHP-0337', name: 'Fragile Crate', category: 'Delivered', amount: 989348 },
  { id: 'SHP-0338', name: 'Fragile Sack', category: 'Delivered', amount: 740533 },
  { id: 'SHP-0339', name: 'Overseas Tube', category: 'Pending', amount: 997161 },
  { id: 'SHP-0340', name: 'Standard Crate', category: 'Returned', amount: 623949 },
];

describe('ShipmentTable filtering', () => {
  it('filters, sorts and pages through 16 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0325');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0325');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0335');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0334');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0334');
    cy.get('input[name=filter]').clear().type('packed');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 16 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('sac');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('tub');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0325');
    cy.get('input[name=filter]').clear().type('SHP-0339');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0325');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0325');
    cy.get('input[name=filter]').clear().type('tub');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
