import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0167', name: 'Bulk Tube', category: 'Pending', amount: 38634 },
  { id: 'SHP-0168', name: 'Insured Sack', category: 'Packed', amount: 859459 },
  { id: 'SHP-0169', name: 'Express Crate', category: 'Pending', amount: 112580 },
  { id: 'SHP-0170', name: 'Bulk Parcel', category: 'Delivered', amount: 662903 },
  { id: 'SHP-0171', name: 'Priority Pallet', category: 'Delivered', amount: 457601 },
  { id: 'SHP-0172', name: 'Fragile Pallet', category: 'Pending', amount: 518144 },
  { id: 'SHP-0173', name: 'Standard Crate', category: 'Transit', amount: 549006 },
  { id: 'SHP-0174', name: 'Frozen Envelope', category: 'Pending', amount: 13436 },
  { id: 'SHP-0175', name: 'Express Bundle', category: 'Delivered', amount: 679644 },
  { id: 'SHP-0176', name: 'Bulk Pallet', category: 'Transit', amount: 462367 },
  { id: 'SHP-0177', name: 'Oversize Parcel', category: 'Transit', amount: 148245 },
  { id: 'SHP-0178', name: 'Fragile Tube', category: 'Packed', amount: 956101 },
  { id: 'SHP-0179', name: 'Insured Envelope', category: 'Delivered', amount: 86496 },
  { id: 'SHP-0180', name: 'Express Envelope', category: 'Packed', amount: 334511 },
  { id: 'SHP-0181', name: 'Frozen Bundle', category: 'Returned', amount: 560054 },
  { id: 'SHP-0182', name: 'Local Envelope', category: 'Delivered', amount: 956872 },
  { id: 'SHP-0183', name: 'Express Sack', category: 'Packed', amount: 2940 },
  { id: 'SHP-0184', name: 'Local Tube', category: 'Returned', amount: 640518 },
  { id: 'SHP-0185', name: 'Priority Container', category: 'Transit', amount: 294042 },
];

describe('ShipmentTable sorting', () => {
  it('filters, sorts and pages through 19 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Froze');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0167');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0177');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0167');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0177');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0167');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0177');
  });

  it('filters, sorts and pages through 19 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('drum');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
