import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0104', name: 'Bulk Box', category: 'Packed', amount: 992214 },
  { id: 'SHP-0105', name: 'Insured Container', category: 'Pending', amount: 62576 },
  { id: 'SHP-0106', name: 'Overseas Tube', category: 'Transit', amount: 618577 },
  { id: 'SHP-0107', name: 'Local Tube', category: 'Transit', amount: 790419 },
  { id: 'SHP-0108', name: 'Oversize Box', category: 'Delivered', amount: 23098 },
  { id: 'SHP-0109', name: 'Standard Envelope', category: 'Returned', amount: 613757 },
  { id: 'SHP-0110', name: 'Oversize Bundle', category: 'Packed', amount: 49505 },
  { id: 'SHP-0111', name: 'Priority Bundle', category: 'Transit', amount: 81304 },
  { id: 'SHP-0112', name: 'Overseas Tube', category: 'Pending', amount: 479882 },
  { id: 'SHP-0113', name: 'Fragile Drum', category: 'Pending', amount: 606194 },
  { id: 'SHP-0114', name: 'Overseas Box', category: 'Packed', amount: 548196 },
  { id: 'SHP-0115', name: 'Bulk Bundle', category: 'Returned', amount: 595107 },
  { id: 'SHP-0116', name: 'Bulk Tube', category: 'Packed', amount: 302652 },
  { id: 'SHP-0117', name: 'Oversize Tube', category: 'Pending', amount: 215609 },
  { id: 'SHP-0118', name: 'Fragile Crate', category: 'Transit', amount: 184167 },
  { id: 'SHP-0119', name: 'Insured Envelope', category: 'Packed', amount: 283251 },
  { id: 'SHP-0120', name: 'Insured Bundle', category: 'Returned', amount: 976272 },
  { id: 'SHP-0121', name: 'Insured Envelope', category: 'Returned', amount: 865874 },
  { id: 'SHP-0122', name: 'Bulk Drum', category: 'Packed', amount: 530589 },
];

describe('ShipmentTable search', () => {
  it('filters, sorts and pages through 19 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0114');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0114');
    cy.get('input[name=filter]').clear().type('shp-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('box');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });
});
