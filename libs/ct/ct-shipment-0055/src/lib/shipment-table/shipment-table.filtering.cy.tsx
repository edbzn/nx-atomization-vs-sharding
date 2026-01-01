import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0298', name: 'Standard Crate', category: 'Pending', amount: 432373 },
  { id: 'SHP-0299', name: 'Priority Tube', category: 'Returned', amount: 499870 },
  { id: 'SHP-0300', name: 'Fragile Tube', category: 'Returned', amount: 705896 },
  { id: 'SHP-0301', name: 'Express Container', category: 'Delivered', amount: 895908 },
  { id: 'SHP-0302', name: 'Fragile Drum', category: 'Transit', amount: 220460 },
  { id: 'SHP-0303', name: 'Overseas Drum', category: 'Returned', amount: 659226 },
  { id: 'SHP-0304', name: 'Priority Tube', category: 'Pending', amount: 179494 },
  { id: 'SHP-0305', name: 'Bulk Parcel', category: 'Returned', amount: 116163 },
  { id: 'SHP-0306', name: 'Priority Parcel', category: 'Delivered', amount: 161858 },
  { id: 'SHP-0307', name: 'Bulk Tube', category: 'Pending', amount: 646658 },
  { id: 'SHP-0308', name: 'Fragile Crate', category: 'Delivered', amount: 930292 },
  { id: 'SHP-0309', name: 'Bulk Drum', category: 'Packed', amount: 459180 },
  { id: 'SHP-0310', name: 'Fragile Drum', category: 'Returned', amount: 855879 },
];

describe('ShipmentTable filtering', () => {
  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0309');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0299');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0309');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0299');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0309');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0299');
    cy.get('input[name=filter]').clear().type('Insu');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0309');
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0298');
  });
});
