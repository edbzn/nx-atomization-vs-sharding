import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0060', name: 'Premium Tallinn', category: 'Tour', amount: 896414 },
  { id: 'BKG-0061', name: 'Premium Seville', category: 'Train', amount: 513398 },
  { id: 'BKG-0062', name: 'Budget Krakow', category: 'Hotel', amount: 302440 },
  { id: 'BKG-0063', name: 'Late Tallinn', category: 'Tour', amount: 994405 },
  { id: 'BKG-0064', name: 'Early Ghent', category: 'Flight', amount: 927339 },
  { id: 'BKG-0065', name: 'Budget Porto', category: 'Tour', amount: 254025 },
  { id: 'BKG-0066', name: 'Budget Seville', category: 'Tour', amount: 412458 },
  { id: 'BKG-0067', name: 'Early Bruges', category: 'Flight', amount: 797670 },
  { id: 'BKG-0068', name: 'Family Tallinn', category: 'Car', amount: 861126 },
  { id: 'BKG-0069', name: 'Late Ghent', category: 'Car', amount: 994323 },
  { id: 'BKG-0070', name: 'Early Tallinn', category: 'Hotel', amount: 652191 },
  { id: 'BKG-0071', name: 'Business Turin', category: 'Flight', amount: 952320 },
  { id: 'BKG-0072', name: 'Group Lyon', category: 'Tour', amount: 751721 },
  { id: 'BKG-0073', name: 'Flexible Turin', category: 'Flight', amount: 766604 },
  { id: 'BKG-0074', name: 'Late Lisbon', category: 'Flight', amount: 196622 },
  { id: 'BKG-0075', name: 'Early Lisbon', category: 'Flight', amount: 662472 },
];

describe('BookingTable search', () => {
  it('filters, sorts and pages through 16 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0070');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0060');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0060');
  });
});
