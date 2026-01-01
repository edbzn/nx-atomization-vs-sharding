import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0218', name: 'Insured Sack', category: 'Packed', amount: 87270 },
  { id: 'SHP-0219', name: 'Fragile Sack', category: 'Transit', amount: 295896 },
  { id: 'SHP-0220', name: 'Standard Sack', category: 'Delivered', amount: 33851 },
  { id: 'SHP-0221', name: 'Express Drum', category: 'Returned', amount: 699080 },
  { id: 'SHP-0222', name: 'Priority Crate', category: 'Returned', amount: 608527 },
  { id: 'SHP-0223', name: 'Bulk Bundle', category: 'Transit', amount: 167484 },
  { id: 'SHP-0224', name: 'Standard Box', category: 'Transit', amount: 456352 },
  { id: 'SHP-0225', name: 'Express Box', category: 'Transit', amount: 844025 },
  { id: 'SHP-0226', name: 'Priority Box', category: 'Transit', amount: 460864 },
  { id: 'SHP-0227', name: 'Fragile Container', category: 'Returned', amount: 1453 },
  { id: 'SHP-0228', name: 'Bulk Drum', category: 'Delivered', amount: 998665 },
  { id: 'SHP-0229', name: 'Oversize Bundle', category: 'Delivered', amount: 623144 },
  { id: 'SHP-0230', name: 'Priority Drum', category: 'Returned', amount: 958479 },
  { id: 'SHP-0231', name: 'Express Sack', category: 'Pending', amount: 862694 },
];

describe('ShipmentTable sorting', () => {
  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('shp-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0218');
    cy.get('input[name=filter]').clear().type('SHP-0224');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
