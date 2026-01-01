import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0256', name: 'Insured Bundle', category: 'Returned', amount: 325814 },
  { id: 'SHP-0257', name: 'Frozen Envelope', category: 'Delivered', amount: 912787 },
  { id: 'SHP-0258', name: 'Fragile Parcel', category: 'Returned', amount: 838924 },
  { id: 'SHP-0259', name: 'Priority Drum', category: 'Transit', amount: 525088 },
  { id: 'SHP-0260', name: 'Oversize Parcel', category: 'Returned', amount: 323684 },
  { id: 'SHP-0261', name: 'Standard Parcel', category: 'Pending', amount: 918201 },
  { id: 'SHP-0262', name: 'Bulk Parcel', category: 'Delivered', amount: 656359 },
  { id: 'SHP-0263', name: 'Standard Drum', category: 'Pending', amount: 521372 },
  { id: 'SHP-0264', name: 'Local Box', category: 'Returned', amount: 492904 },
  { id: 'SHP-0265', name: 'Express Drum', category: 'Pending', amount: 363120 },
  { id: 'SHP-0266', name: 'Fragile Drum', category: 'Packed', amount: 561286 },
  { id: 'SHP-0267', name: 'Priority Pallet', category: 'Transit', amount: 955707 },
  { id: 'SHP-0268', name: 'Express Box', category: 'Transit', amount: 211531 },
  { id: 'SHP-0269', name: 'Express Pallet', category: 'Pending', amount: 220841 },
  { id: 'SHP-0270', name: 'Local Container', category: 'Delivered', amount: 236031 },
];

describe('ShipmentTable search', () => {
  it('filters, sorts and pages through 15 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0256');
    cy.get('input[name=filter]').clear().type('SHP-0270');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0256');
  });

  it('filters, sorts and pages through 15 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0256');
    cy.get('input[name=filter]').clear().type('pending');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
  });
});
