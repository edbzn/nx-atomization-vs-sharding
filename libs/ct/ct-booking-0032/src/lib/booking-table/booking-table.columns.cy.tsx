import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0229', name: 'Budget Lyon', category: 'Train', amount: 637131 },
  { id: 'BKG-0230', name: 'Flexible Bergen', category: 'Hotel', amount: 140231 },
  { id: 'BKG-0231', name: 'Early Bergen', category: 'Car', amount: 545211 },
  { id: 'BKG-0232', name: 'Solo Lyon', category: 'Train', amount: 148409 },
  { id: 'BKG-0233', name: 'Premium Lisbon', category: 'Tour', amount: 809015 },
  { id: 'BKG-0234', name: 'Business Lyon', category: 'Flight', amount: 89634 },
  { id: 'BKG-0235', name: 'Budget Bruges', category: 'Flight', amount: 105557 },
  { id: 'BKG-0236', name: 'Flexible Seville', category: 'Flight', amount: 804306 },
  { id: 'BKG-0237', name: 'Late Seville', category: 'Hotel', amount: 50221 },
  { id: 'BKG-0238', name: 'Premium Krakow', category: 'Tour', amount: 925332 },
  { id: 'BKG-0239', name: 'Solo Porto', category: 'Train', amount: 370857 },
  { id: 'BKG-0240', name: 'Premium Bergen', category: 'Tour', amount: 267121 },
  { id: 'BKG-0241', name: 'Business Seville', category: 'Hotel', amount: 528970 },
  { id: 'BKG-0242', name: 'Business Krakow', category: 'Car', amount: 500907 },
  { id: 'BKG-0243', name: 'Business Porto', category: 'Car', amount: 995616 },
  { id: 'BKG-0244', name: 'Premium Bruges', category: 'Car', amount: 306962 },
  { id: 'BKG-0245', name: 'Business Porto', category: 'Tour', amount: 406290 },
  { id: 'BKG-0246', name: 'Budget Porto', category: 'Tour', amount: 860268 },
];

describe('BookingTable columns', () => {
  it('filters, sorts and pages through 16 bookings', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0239');
    cy.get('input[name=filter]').clear().type('train');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });

  it('filters, sorts and pages through 18 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0229');
  });
});
