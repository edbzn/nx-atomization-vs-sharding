import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0008', name: 'Weekend Bruges', category: 'Train', amount: 682810 },
  { id: 'BKG-0009', name: 'Family Ghent', category: 'Car', amount: 900866 },
  { id: 'BKG-0010', name: 'Late Ghent', category: 'Car', amount: 312876 },
  { id: 'BKG-0011', name: 'Flexible Porto', category: 'Hotel', amount: 358402 },
  { id: 'BKG-0012', name: 'Weekend Bergen', category: 'Flight', amount: 200469 },
  { id: 'BKG-0013', name: 'Late Porto', category: 'Tour', amount: 780413 },
  { id: 'BKG-0014', name: 'Budget Ghent', category: 'Train', amount: 983858 },
  { id: 'BKG-0015', name: 'Premium Bergen', category: 'Hotel', amount: 941707 },
  { id: 'BKG-0016', name: 'Budget Tallinn', category: 'Flight', amount: 560570 },
  { id: 'BKG-0017', name: 'Flexible Lisbon', category: 'Flight', amount: 262152 },
  { id: 'BKG-0018', name: 'Group Tallinn', category: 'Flight', amount: 110237 },
  { id: 'BKG-0019', name: 'Solo Porto', category: 'Train', amount: 615632 },
  { id: 'BKG-0020', name: 'Weekend Krakow', category: 'Flight', amount: 320313 },
];

describe('BookingTable pagination', () => {
  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0014');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0012');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0008');
  });

  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0018');
  });
});
