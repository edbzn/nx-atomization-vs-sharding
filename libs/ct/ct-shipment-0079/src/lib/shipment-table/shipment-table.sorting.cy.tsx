import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0305', name: 'Bulk Sack', category: 'Packed', amount: 20346 },
  { id: 'SHP-0306', name: 'Overseas Drum', category: 'Transit', amount: 428409 },
  { id: 'SHP-0307', name: 'Local Sack', category: 'Delivered', amount: 998657 },
  { id: 'SHP-0308', name: 'Local Parcel', category: 'Pending', amount: 143096 },
  { id: 'SHP-0309', name: 'Express Pallet', category: 'Packed', amount: 664303 },
  { id: 'SHP-0310', name: 'Frozen Box', category: 'Pending', amount: 234640 },
  { id: 'SHP-0311', name: 'Oversize Box', category: 'Transit', amount: 544838 },
  { id: 'SHP-0312', name: 'Express Bundle', category: 'Delivered', amount: 685041 },
  { id: 'SHP-0313', name: 'Bulk Pallet', category: 'Transit', amount: 248527 },
  { id: 'SHP-0314', name: 'Priority Envelope', category: 'Packed', amount: 298441 },
  { id: 'SHP-0315', name: 'Bulk Pallet', category: 'Pending', amount: 210716 },
  { id: 'SHP-0316', name: 'Standard Container', category: 'Transit', amount: 810673 },
  { id: 'SHP-0317', name: 'Frozen Envelope', category: 'Delivered', amount: 97930 },
  { id: 'SHP-0318', name: 'Bulk Sack', category: 'Returned', amount: 373608 },
];

describe('ShipmentTable sorting', () => {
  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Expr');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0309');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0305');
    cy.get('input[name=filter]').clear().type('shp-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0305');
    cy.get('input[name=filter]').clear().type('SHP-0311');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0313');
    cy.get('input[name=filter]').clear().type('shp-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0313');
  });

  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0305');
  });
});
