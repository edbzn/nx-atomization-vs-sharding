import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0292', name: 'Overseas Drum', category: 'Returned', amount: 516529 },
  { id: 'SHP-0293', name: 'Overseas Parcel', category: 'Pending', amount: 693454 },
  { id: 'SHP-0294', name: 'Insured Crate', category: 'Returned', amount: 844828 },
  { id: 'SHP-0295', name: 'Express Crate', category: 'Transit', amount: 872052 },
  { id: 'SHP-0296', name: 'Bulk Envelope', category: 'Pending', amount: 476938 },
  { id: 'SHP-0297', name: 'Local Parcel', category: 'Packed', amount: 624247 },
  { id: 'SHP-0298', name: 'Local Container', category: 'Transit', amount: 569697 },
  { id: 'SHP-0299', name: 'Frozen Pallet', category: 'Delivered', amount: 998068 },
  { id: 'SHP-0300', name: 'Standard Box', category: 'Pending', amount: 220330 },
  { id: 'SHP-0301', name: 'Priority Crate', category: 'Pending', amount: 287981 },
  { id: 'SHP-0302', name: 'Oversize Crate', category: 'Delivered', amount: 144862 },
  { id: 'SHP-0303', name: 'Priority Tube', category: 'Pending', amount: 432286 },
  { id: 'SHP-0304', name: 'Fragile Bundle', category: 'Transit', amount: 419071 },
  { id: 'SHP-0305', name: 'Express Sack', category: 'Packed', amount: 969810 },
  { id: 'SHP-0306', name: 'Bulk Drum', category: 'Delivered', amount: 142658 },
  { id: 'SHP-0307', name: 'Insured Container', category: 'Packed', amount: 228560 },
];

describe('ShipmentTable pagination', () => {
  it('filters, sorts and pages through 16 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0306');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0292');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0306');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0292');
  });

  it('filters, sorts and pages through 16 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0306');
  });
});
