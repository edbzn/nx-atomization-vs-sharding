import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0154', name: 'Group Krakow', category: 'Tour', amount: 944350 },
  { id: 'BKG-0155', name: 'Early Lyon', category: 'Train', amount: 994747 },
  { id: 'BKG-0156', name: 'Weekend Lyon', category: 'Tour', amount: 870001 },
  { id: 'BKG-0157', name: 'Late Bruges', category: 'Car', amount: 712205 },
  { id: 'BKG-0158', name: 'Family Lyon', category: 'Tour', amount: 98473 },
  { id: 'BKG-0159', name: 'Premium Bergen', category: 'Flight', amount: 473544 },
  { id: 'BKG-0160', name: 'Family Turin', category: 'Car', amount: 54780 },
  { id: 'BKG-0161', name: 'Solo Ghent', category: 'Train', amount: 179671 },
  { id: 'BKG-0162', name: 'Solo Lisbon', category: 'Train', amount: 790066 },
  { id: 'BKG-0163', name: 'Budget Ghent', category: 'Hotel', amount: 850259 },
  { id: 'BKG-0164', name: 'Weekend Ghent', category: 'Flight', amount: 786351 },
  { id: 'BKG-0165', name: 'Family Bruges', category: 'Hotel', amount: 618810 },
  { id: 'BKG-0166', name: 'Early Ghent', category: 'Train', amount: 126715 },
];

describe('BookingTable filtering', () => {
  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0164');
    cy.get('input[name=filter]').clear().type('talli');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
