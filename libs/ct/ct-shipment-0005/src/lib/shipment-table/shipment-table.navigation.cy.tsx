import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0205', name: 'Standard Container', category: 'Returned', amount: 624831 },
  { id: 'SHP-0206', name: 'Overseas Container', category: 'Delivered', amount: 435987 },
  { id: 'SHP-0207', name: 'Frozen Tube', category: 'Returned', amount: 579406 },
  { id: 'SHP-0208', name: 'Fragile Tube', category: 'Pending', amount: 996425 },
  { id: 'SHP-0209', name: 'Express Container', category: 'Transit', amount: 974448 },
  { id: 'SHP-0210', name: 'Insured Crate', category: 'Returned', amount: 929628 },
  { id: 'SHP-0211', name: 'Express Bundle', category: 'Pending', amount: 884984 },
  { id: 'SHP-0212', name: 'Standard Tube', category: 'Transit', amount: 409290 },
  { id: 'SHP-0213', name: 'Fragile Bundle', category: 'Pending', amount: 496427 },
  { id: 'SHP-0214', name: 'Fragile Container', category: 'Pending', amount: 455975 },
  { id: 'SHP-0215', name: 'Overseas Pallet', category: 'Returned', amount: 677429 },
  { id: 'SHP-0216', name: 'Frozen Envelope', category: 'Returned', amount: 563025 },
  { id: 'SHP-0217', name: 'Standard Parcel', category: 'Delivered', amount: 258775 },
];

describe('ShipmentTable navigation', () => {
  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0217');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0210');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0208');
    cy.get('input[name=filter]').clear().type('shp-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0208');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0206');
    cy.get('input[name=filter]').clear().type('pal');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
