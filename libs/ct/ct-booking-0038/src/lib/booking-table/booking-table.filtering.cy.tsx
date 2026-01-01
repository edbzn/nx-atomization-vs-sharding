import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0086', name: 'Late Bergen', category: 'Tour', amount: 753181 },
  { id: 'BKG-0087', name: 'Weekend Lisbon', category: 'Tour', amount: 862055 },
  { id: 'BKG-0088', name: 'Late Lisbon', category: 'Train', amount: 266793 },
  { id: 'BKG-0089', name: 'Late Bergen', category: 'Tour', amount: 166893 },
  { id: 'BKG-0090', name: 'Business Lisbon', category: 'Flight', amount: 174117 },
  { id: 'BKG-0091', name: 'Flexible Krakow', category: 'Car', amount: 279470 },
  { id: 'BKG-0092', name: 'Group Krakow', category: 'Train', amount: 759879 },
  { id: 'BKG-0093', name: 'Business Lisbon', category: 'Hotel', amount: 434354 },
  { id: 'BKG-0094', name: 'Group Lyon', category: 'Train', amount: 143065 },
  { id: 'BKG-0095', name: 'Flexible Bruges', category: 'Car', amount: 509361 },
  { id: 'BKG-0096', name: 'Weekend Krakow', category: 'Car', amount: 613761 },
  { id: 'BKG-0097', name: 'Flexible Tallinn', category: 'Car', amount: 765232 },
  { id: 'BKG-0098', name: 'Premium Bergen', category: 'Tour', amount: 582256 },
];

describe('BookingTable filtering', () => {
  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('BKG-0093');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0086');
    cy.get('input[name=filter]').clear().type('bruge');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0095');
  });

  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0086');
  });
});
