import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0308', name: 'Group Krakow', category: 'Train', amount: 279355 },
  { id: 'BKG-0309', name: 'Flexible Seville', category: 'Flight', amount: 965856 },
  { id: 'BKG-0310', name: 'Premium Seville', category: 'Hotel', amount: 817297 },
  { id: 'BKG-0311', name: 'Late Porto', category: 'Tour', amount: 116705 },
  { id: 'BKG-0312', name: 'Group Porto', category: 'Train', amount: 621888 },
  { id: 'BKG-0313', name: 'Solo Lyon', category: 'Tour', amount: 221912 },
  { id: 'BKG-0314', name: 'Premium Lisbon', category: 'Train', amount: 159480 },
  { id: 'BKG-0315', name: 'Premium Ghent', category: 'Tour', amount: 918394 },
  { id: 'BKG-0316', name: 'Premium Seville', category: 'Hotel', amount: 277885 },
  { id: 'BKG-0317', name: 'Late Krakow', category: 'Car', amount: 500169 },
  { id: 'BKG-0318', name: 'Group Bruges', category: 'Hotel', amount: 898892 },
  { id: 'BKG-0319', name: 'Premium Lisbon', category: 'Train', amount: 416832 },
  { id: 'BKG-0320', name: 'Flexible Bergen', category: 'Hotel', amount: 496686 },
  { id: 'BKG-0321', name: 'Budget Turin', category: 'Flight', amount: 834284 },
  { id: 'BKG-0322', name: 'Flexible Porto', category: 'Train', amount: 649186 },
  { id: 'BKG-0323', name: 'Family Lisbon', category: 'Car', amount: 540803 },
];

describe('BookingTable sorting', () => {
  it('filters, sorts and pages through 16 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0318');
    cy.get('input[name=filter]').clear().type('bkg-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
