import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0191', name: 'Bulk Tube', category: 'Delivered', amount: 931538 },
  { id: 'SHP-0192', name: 'Priority Box', category: 'Delivered', amount: 125388 },
  { id: 'SHP-0193', name: 'Frozen Sack', category: 'Returned', amount: 361439 },
  { id: 'SHP-0194', name: 'Bulk Tube', category: 'Returned', amount: 870572 },
  { id: 'SHP-0195', name: 'Fragile Sack', category: 'Returned', amount: 143389 },
  { id: 'SHP-0196', name: 'Bulk Sack', category: 'Transit', amount: 346747 },
  { id: 'SHP-0197', name: 'Priority Box', category: 'Returned', amount: 266195 },
  { id: 'SHP-0198', name: 'Local Crate', category: 'Returned', amount: 727142 },
  { id: 'SHP-0199', name: 'Express Bundle', category: 'Returned', amount: 656567 },
  { id: 'SHP-0200', name: 'Oversize Bundle', category: 'Packed', amount: 564059 },
  { id: 'SHP-0201', name: 'Priority Drum', category: 'Returned', amount: 696510 },
  { id: 'SHP-0202', name: 'Bulk Bundle', category: 'Returned', amount: 55771 },
];

describe('ShipmentTable columns', () => {
  it('filters, sorts and pages through 12 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0202');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0202');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0197');
    cy.get('input[name=filter]').clear().type('SHP-0196');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
