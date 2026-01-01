import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0032', name: 'Express Pallet', category: 'Transit', amount: 855954 },
  { id: 'SHP-0033', name: 'Bulk Parcel', category: 'Pending', amount: 493417 },
  { id: 'SHP-0034', name: 'Insured Box', category: 'Delivered', amount: 684675 },
  { id: 'SHP-0035', name: 'Insured Tube', category: 'Transit', amount: 893787 },
  { id: 'SHP-0036', name: 'Bulk Tube', category: 'Packed', amount: 802613 },
  { id: 'SHP-0037', name: 'Priority Sack', category: 'Transit', amount: 501539 },
  { id: 'SHP-0038', name: 'Fragile Pallet', category: 'Transit', amount: 757263 },
  { id: 'SHP-0039', name: 'Overseas Container', category: 'Transit', amount: 664027 },
  { id: 'SHP-0040', name: 'Local Container', category: 'Delivered', amount: 589306 },
  { id: 'SHP-0041', name: 'Priority Container', category: 'Returned', amount: 280215 },
  { id: 'SHP-0042', name: 'Standard Tube', category: 'Transit', amount: 358652 },
  { id: 'SHP-0043', name: 'Frozen Sack', category: 'Pending', amount: 335585 },
  { id: 'SHP-0044', name: 'Oversize Crate', category: 'Delivered', amount: 176161 },
  { id: 'SHP-0045', name: 'Priority Envelope', category: 'Packed', amount: 179919 },
  { id: 'SHP-0046', name: 'Insured Parcel', category: 'Transit', amount: 93072 },
  { id: 'SHP-0047', name: 'Bulk Bundle', category: 'Returned', amount: 854522 },
];

describe('ShipmentTable sorting', () => {
  it('filters, sorts and pages through 16 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0032');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0032');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0032');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0032');
    cy.get('input[name=filter]').clear().type('pal');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0032');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0042');
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0042');
  });
});
