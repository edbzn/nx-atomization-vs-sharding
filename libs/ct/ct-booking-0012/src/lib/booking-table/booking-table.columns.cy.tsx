import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0127', name: 'Flexible Tallinn', category: 'Tour', amount: 682331 },
  { id: 'BKG-0128', name: 'Late Krakow', category: 'Train', amount: 43177 },
  { id: 'BKG-0129', name: 'Business Tallinn', category: 'Flight', amount: 147685 },
  { id: 'BKG-0130', name: 'Weekend Seville', category: 'Flight', amount: 704410 },
  { id: 'BKG-0131', name: 'Flexible Tallinn', category: 'Train', amount: 280677 },
  { id: 'BKG-0132', name: 'Group Seville', category: 'Tour', amount: 897703 },
  { id: 'BKG-0133', name: 'Premium Lisbon', category: 'Hotel', amount: 378903 },
  { id: 'BKG-0134', name: 'Business Lyon', category: 'Car', amount: 6364 },
  { id: 'BKG-0135', name: 'Family Porto', category: 'Car', amount: 978506 },
  { id: 'BKG-0136', name: 'Flexible Lyon', category: 'Car', amount: 336001 },
  { id: 'BKG-0137', name: 'Weekend Ghent', category: 'Flight', amount: 323650 },
  { id: 'BKG-0138', name: 'Family Porto', category: 'Car', amount: 671472 },
  { id: 'BKG-0139', name: 'Business Lisbon', category: 'Flight', amount: 780868 },
];

describe('BookingTable columns', () => {
  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0137');
    cy.get('input[name=filter]').clear().type('BKG-0138');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0138');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0138');
  });
});
