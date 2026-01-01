import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0361', name: 'Express Parcel', category: 'Packed', amount: 84403 },
  { id: 'SHP-0362', name: 'Insured Container', category: 'Returned', amount: 662517 },
  { id: 'SHP-0363', name: 'Bulk Drum', category: 'Transit', amount: 439320 },
  { id: 'SHP-0364', name: 'Bulk Bundle', category: 'Packed', amount: 22191 },
  { id: 'SHP-0365', name: 'Standard Tube', category: 'Delivered', amount: 250082 },
  { id: 'SHP-0366', name: 'Fragile Parcel', category: 'Delivered', amount: 101013 },
  { id: 'SHP-0367', name: 'Express Tube', category: 'Returned', amount: 118073 },
  { id: 'SHP-0368', name: 'Insured Tube', category: 'Pending', amount: 34229 },
  { id: 'SHP-0369', name: 'Standard Box', category: 'Delivered', amount: 481539 },
  { id: 'SHP-0370', name: 'Insured Crate', category: 'Delivered', amount: 921550 },
  { id: 'SHP-0371', name: 'Local Tube', category: 'Delivered', amount: 328888 },
  { id: 'SHP-0372', name: 'Frozen Drum', category: 'Delivered', amount: 627466 },
  { id: 'SHP-0373', name: 'Priority Container', category: 'Delivered', amount: 232522 },
];

describe('ShipmentTable columns', () => {
  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0361');
    cy.get('input[name=filter]').clear().type('Fra');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0361');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0373');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0364');
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0371');
  });
});
