import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0182', name: 'Standard Box', category: 'Pending', amount: 20055 },
  { id: 'SHP-0183', name: 'Express Crate', category: 'Returned', amount: 476897 },
  { id: 'SHP-0184', name: 'Bulk Tube', category: 'Transit', amount: 657386 },
  { id: 'SHP-0185', name: 'Bulk Box', category: 'Transit', amount: 793661 },
  { id: 'SHP-0186', name: 'Bulk Crate', category: 'Pending', amount: 440463 },
  { id: 'SHP-0187', name: 'Local Pallet', category: 'Transit', amount: 197 },
  { id: 'SHP-0188', name: 'Fragile Container', category: 'Pending', amount: 199757 },
  { id: 'SHP-0189', name: 'Oversize Parcel', category: 'Pending', amount: 119875 },
  { id: 'SHP-0190', name: 'Bulk Tube', category: 'Transit', amount: 659736 },
  { id: 'SHP-0191', name: 'Insured Parcel', category: 'Delivered', amount: 478733 },
  { id: 'SHP-0192', name: 'Priority Tube', category: 'Delivered', amount: 755173 },
  { id: 'SHP-0193', name: 'Frozen Box', category: 'Returned', amount: 743792 },
  { id: 'SHP-0194', name: 'Local Sack', category: 'Pending', amount: 261249 },
  { id: 'SHP-0195', name: 'Express Drum', category: 'Pending', amount: 181963 },
];

describe('ShipmentTable filtering', () => {
  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0192');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0182');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0192');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0182');
    cy.get('input[name=filter]').clear().type('SHP-0195');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0182');
  });
});
