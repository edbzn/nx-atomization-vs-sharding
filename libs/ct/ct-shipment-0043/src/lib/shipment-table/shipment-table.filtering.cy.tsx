import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0176', name: 'Express Crate', category: 'Packed', amount: 208534 },
  { id: 'SHP-0177', name: 'Insured Bundle', category: 'Transit', amount: 432897 },
  { id: 'SHP-0178', name: 'Oversize Container', category: 'Pending', amount: 166045 },
  { id: 'SHP-0179', name: 'Oversize Envelope', category: 'Transit', amount: 959049 },
  { id: 'SHP-0180', name: 'Fragile Crate', category: 'Packed', amount: 577387 },
  { id: 'SHP-0181', name: 'Oversize Tube', category: 'Returned', amount: 454057 },
  { id: 'SHP-0182', name: 'Local Box', category: 'Pending', amount: 187639 },
  { id: 'SHP-0183', name: 'Express Sack', category: 'Pending', amount: 950585 },
  { id: 'SHP-0184', name: 'Oversize Bundle', category: 'Pending', amount: 907348 },
  { id: 'SHP-0185', name: 'Overseas Parcel', category: 'Transit', amount: 735760 },
  { id: 'SHP-0186', name: 'Insured Container', category: 'Transit', amount: 900587 },
  { id: 'SHP-0187', name: 'Express Tube', category: 'Pending', amount: 882852 },
];

describe('ShipmentTable filtering', () => {
  it('filters, sorts and pages through 12 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0176');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0187');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0177');
  });
});
