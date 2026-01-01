import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0106', name: 'Insured Box', category: 'Delivered', amount: 647897 },
  { id: 'SHP-0107', name: 'Bulk Envelope', category: 'Returned', amount: 371976 },
  { id: 'SHP-0108', name: 'Oversize Sack', category: 'Packed', amount: 189341 },
  { id: 'SHP-0109', name: 'Priority Drum', category: 'Delivered', amount: 224106 },
  { id: 'SHP-0110', name: 'Fragile Pallet', category: 'Packed', amount: 438982 },
  { id: 'SHP-0111', name: 'Bulk Envelope', category: 'Pending', amount: 529189 },
  { id: 'SHP-0112', name: 'Bulk Parcel', category: 'Pending', amount: 18251 },
  { id: 'SHP-0113', name: 'Overseas Container', category: 'Returned', amount: 57621 },
  { id: 'SHP-0114', name: 'Priority Envelope', category: 'Packed', amount: 492034 },
  { id: 'SHP-0115', name: 'Bulk Envelope', category: 'Pending', amount: 685913 },
  { id: 'SHP-0116', name: 'Local Sack', category: 'Packed', amount: 451710 },
  { id: 'SHP-0117', name: 'Fragile Parcel', category: 'Packed', amount: 146643 },
];

describe('ShipmentTable empty results', () => {
  it('filters, sorts and pages through 12 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0112');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0106');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0112');
    cy.get('input[name=filter]').clear().type('pall');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
