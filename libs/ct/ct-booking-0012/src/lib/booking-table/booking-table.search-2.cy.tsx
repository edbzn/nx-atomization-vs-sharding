import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0050', name: 'Business Turin', category: 'Train', amount: 177696 },
  { id: 'BKG-0051', name: 'Premium Tallinn', category: 'Tour', amount: 92164 },
  { id: 'BKG-0052', name: 'Flexible Ghent', category: 'Train', amount: 885437 },
  { id: 'BKG-0053', name: 'Business Bergen', category: 'Car', amount: 694594 },
  { id: 'BKG-0054', name: 'Family Ghent', category: 'Tour', amount: 204382 },
  { id: 'BKG-0055', name: 'Family Lyon', category: 'Car', amount: 771491 },
  { id: 'BKG-0056', name: 'Solo Bruges', category: 'Flight', amount: 583006 },
  { id: 'BKG-0057', name: 'Family Bruges', category: 'Hotel', amount: 871557 },
  { id: 'BKG-0058', name: 'Weekend Bruges', category: 'Flight', amount: 880105 },
  { id: 'BKG-0059', name: 'Early Lyon', category: 'Tour', amount: 179188 },
  { id: 'BKG-0060', name: 'Family Krakow', category: 'Hotel', amount: 854610 },
  { id: 'BKG-0061', name: 'Solo Seville', category: 'Tour', amount: 921621 },
  { id: 'BKG-0062', name: 'Budget Lyon', category: 'Tour', amount: 259422 },
  { id: 'BKG-0063', name: 'Solo Lisbon', category: 'Tour', amount: 803593 },
  { id: 'BKG-0064', name: 'Premium Lyon', category: 'Tour', amount: 123085 },
  { id: 'BKG-0065', name: 'Early Lisbon', category: 'Tour', amount: 69767 },
  { id: 'BKG-0066', name: 'Late Krakow', category: 'Train', amount: 125632 },
];

describe('BookingTable search 2', () => {
  it('filters, sorts and pages through 17 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0050');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0060');
    cy.get('input[name=filter]').clear().type('BKG-0050');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
