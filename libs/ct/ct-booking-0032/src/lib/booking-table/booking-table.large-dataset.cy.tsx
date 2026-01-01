import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0194', name: 'Early Lyon', category: 'Flight', amount: 117526 },
  { id: 'BKG-0195', name: 'Flexible Ghent', category: 'Tour', amount: 628220 },
  { id: 'BKG-0196', name: 'Late Tallinn', category: 'Tour', amount: 852269 },
  { id: 'BKG-0197', name: 'Weekend Tallinn', category: 'Tour', amount: 637063 },
  { id: 'BKG-0198', name: 'Early Porto', category: 'Flight', amount: 802651 },
  { id: 'BKG-0199', name: 'Budget Krakow', category: 'Car', amount: 844345 },
  { id: 'BKG-0200', name: 'Solo Bergen', category: 'Train', amount: 46181 },
  { id: 'BKG-0201', name: 'Flexible Bruges', category: 'Train', amount: 902047 },
  { id: 'BKG-0202', name: 'Solo Krakow', category: 'Flight', amount: 130787 },
  { id: 'BKG-0203', name: 'Budget Lisbon', category: 'Flight', amount: 311686 },
  { id: 'BKG-0204', name: 'Early Ghent', category: 'Hotel', amount: 246581 },
  { id: 'BKG-0205', name: 'Early Porto', category: 'Hotel', amount: 831918 },
  { id: 'BKG-0206', name: 'Solo Lyon', category: 'Hotel', amount: 592528 },
  { id: 'BKG-0207', name: 'Family Bruges', category: 'Car', amount: 433807 },
  { id: 'BKG-0208', name: 'Solo Lyon', category: 'Hotel', amount: 698122 },
  { id: 'BKG-0209', name: 'Flexible Porto', category: 'Train', amount: 906837 },
];

describe('BookingTable large dataset', () => {
  it('filters, sorts and pages through 16 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('port');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0198');
  });
});
