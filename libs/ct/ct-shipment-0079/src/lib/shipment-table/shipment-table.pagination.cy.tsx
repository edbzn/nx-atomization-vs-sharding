import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0110', name: 'Insured Parcel', category: 'Returned', amount: 89644 },
  { id: 'SHP-0111', name: 'Insured Parcel', category: 'Packed', amount: 679630 },
  { id: 'SHP-0112', name: 'Priority Box', category: 'Returned', amount: 190864 },
  { id: 'SHP-0113', name: 'Insured Parcel', category: 'Pending', amount: 202991 },
  { id: 'SHP-0114', name: 'Local Box', category: 'Pending', amount: 484289 },
  { id: 'SHP-0115', name: 'Oversize Tube', category: 'Delivered', amount: 837533 },
  { id: 'SHP-0116', name: 'Overseas Sack', category: 'Delivered', amount: 923329 },
  { id: 'SHP-0117', name: 'Frozen Envelope', category: 'Returned', amount: 43471 },
  { id: 'SHP-0118', name: 'Oversize Bundle', category: 'Delivered', amount: 787916 },
  { id: 'SHP-0119', name: 'Express Crate', category: 'Packed', amount: 561542 },
  { id: 'SHP-0120', name: 'Bulk Box', category: 'Transit', amount: 343405 },
  { id: 'SHP-0121', name: 'Insured Box', category: 'Transit', amount: 414264 },
  { id: 'SHP-0122', name: 'Bulk Tube', category: 'Transit', amount: 549113 },
];

describe('ShipmentTable pagination', () => {
  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0120');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0110');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0120');
    cy.get('input[name=filter]').clear().type('returned');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0120');
  });
});
