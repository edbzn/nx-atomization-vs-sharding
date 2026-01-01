import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0070', name: 'Late Lyon', category: 'Hotel', amount: 260391 },
  { id: 'BKG-0071', name: 'Solo Krakow', category: 'Tour', amount: 711560 },
  { id: 'BKG-0072', name: 'Budget Lisbon', category: 'Flight', amount: 228669 },
  { id: 'BKG-0073', name: 'Weekend Tallinn', category: 'Tour', amount: 983362 },
  { id: 'BKG-0074', name: 'Budget Bruges', category: 'Car', amount: 541805 },
  { id: 'BKG-0075', name: 'Flexible Ghent', category: 'Tour', amount: 96808 },
  { id: 'BKG-0076', name: 'Business Bruges', category: 'Hotel', amount: 887252 },
  { id: 'BKG-0077', name: 'Group Turin', category: 'Hotel', amount: 349228 },
  { id: 'BKG-0078', name: 'Flexible Lyon', category: 'Car', amount: 245431 },
  { id: 'BKG-0079', name: 'Early Krakow', category: 'Tour', amount: 598324 },
  { id: 'BKG-0080', name: 'Solo Tallinn', category: 'Flight', amount: 732694 },
  { id: 'BKG-0081', name: 'Family Bergen', category: 'Hotel', amount: 758756 },
  { id: 'BKG-0082', name: 'Weekend Lisbon', category: 'Flight', amount: 31378 },
  { id: 'BKG-0083', name: 'Budget Tallinn', category: 'Train', amount: 571842 },
  { id: 'BKG-0084', name: 'Late Porto', category: 'Tour', amount: 161156 },
  { id: 'BKG-0085', name: 'Early Seville', category: 'Tour', amount: 938213 },
  { id: 'BKG-0086', name: 'Flexible Lyon', category: 'Tour', amount: 800980 },
  { id: 'BKG-0087', name: 'Solo Seville', category: 'Flight', amount: 313996 },
];

describe('BookingTable filtering', () => {
  it('filters, sorts and pages through 18 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0070');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0080');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0070');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0080');
  });

  it('filters, sorts and pages through 14 bookings', () => {
    const rows = ROWS.slice(0, 14);
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('flight');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });
});
