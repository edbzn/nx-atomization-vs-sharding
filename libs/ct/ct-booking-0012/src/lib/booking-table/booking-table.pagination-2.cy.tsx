import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0323', name: 'Late Bruges', category: 'Car', amount: 763925 },
  { id: 'BKG-0324', name: 'Family Bergen', category: 'Hotel', amount: 565671 },
  { id: 'BKG-0325', name: 'Budget Ghent', category: 'Train', amount: 845769 },
  { id: 'BKG-0326', name: 'Family Bergen', category: 'Train', amount: 705416 },
  { id: 'BKG-0327', name: 'Late Porto', category: 'Flight', amount: 571623 },
  { id: 'BKG-0328', name: 'Premium Krakow', category: 'Tour', amount: 226147 },
  { id: 'BKG-0329', name: 'Group Lyon', category: 'Tour', amount: 806184 },
  { id: 'BKG-0330', name: 'Premium Bergen', category: 'Car', amount: 38313 },
  { id: 'BKG-0331', name: 'Family Krakow', category: 'Flight', amount: 809395 },
  { id: 'BKG-0332', name: 'Business Porto', category: 'Tour', amount: 863655 },
  { id: 'BKG-0333', name: 'Business Ghent', category: 'Flight', amount: 716465 },
  { id: 'BKG-0334', name: 'Premium Bergen', category: 'Car', amount: 365115 },
  { id: 'BKG-0335', name: 'Family Ghent', category: 'Tour', amount: 345114 },
  { id: 'BKG-0336', name: 'Family Lisbon', category: 'Car', amount: 333280 },
  { id: 'BKG-0337', name: 'Weekend Bergen', category: 'Car', amount: 320942 },
  { id: 'BKG-0338', name: 'Family Lisbon', category: 'Tour', amount: 560076 },
  { id: 'BKG-0339', name: 'Family Lyon', category: 'Hotel', amount: 633150 },
  { id: 'BKG-0340', name: 'Early Tallinn', category: 'Flight', amount: 445011 },
];

describe('BookingTable pagination 2', () => {
  it('filters, sorts and pages through 18 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0333');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0333');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0323');
    cy.get('input[name=filter]').clear().type('BKG-0327');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('BKG-0333');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
