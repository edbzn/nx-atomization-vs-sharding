import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0324', name: 'Flexible Bergen', category: 'Car', amount: 664127 },
  { id: 'BKG-0325', name: 'Weekend Ghent', category: 'Hotel', amount: 847488 },
  { id: 'BKG-0326', name: 'Budget Krakow', category: 'Train', amount: 663568 },
  { id: 'BKG-0327', name: 'Business Bruges', category: 'Hotel', amount: 225012 },
  { id: 'BKG-0328', name: 'Late Ghent', category: 'Hotel', amount: 85834 },
  { id: 'BKG-0329', name: 'Group Lisbon', category: 'Hotel', amount: 291410 },
  { id: 'BKG-0330', name: 'Weekend Ghent', category: 'Flight', amount: 377741 },
  { id: 'BKG-0331', name: 'Budget Seville', category: 'Train', amount: 752343 },
  { id: 'BKG-0332', name: 'Early Bruges', category: 'Hotel', amount: 603465 },
  { id: 'BKG-0333', name: 'Late Krakow', category: 'Flight', amount: 82907 },
  { id: 'BKG-0334', name: 'Early Tallinn', category: 'Car', amount: 125501 },
  { id: 'BKG-0335', name: 'Flexible Porto', category: 'Train', amount: 394383 },
  { id: 'BKG-0336', name: 'Premium Bergen', category: 'Tour', amount: 35441 },
];

describe('BookingTable empty results', () => {
  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0336');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0336');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0336');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0324');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0336');
  });
});
