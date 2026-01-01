import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0326', name: 'Early Bruges', category: 'Car', amount: 892119 },
  { id: 'BKG-0327', name: 'Solo Turin', category: 'Tour', amount: 404152 },
  { id: 'BKG-0328', name: 'Premium Lyon', category: 'Hotel', amount: 489504 },
  { id: 'BKG-0329', name: 'Premium Bergen', category: 'Tour', amount: 318892 },
  { id: 'BKG-0330', name: 'Business Ghent', category: 'Flight', amount: 161757 },
  { id: 'BKG-0331', name: 'Flexible Krakow', category: 'Flight', amount: 186777 },
  { id: 'BKG-0332', name: 'Business Bergen', category: 'Train', amount: 144380 },
  { id: 'BKG-0333', name: 'Early Lisbon', category: 'Train', amount: 479133 },
  { id: 'BKG-0334', name: 'Flexible Seville', category: 'Tour', amount: 107386 },
  { id: 'BKG-0335', name: 'Budget Bruges', category: 'Flight', amount: 171183 },
  { id: 'BKG-0336', name: 'Budget Seville', category: 'Tour', amount: 437155 },
  { id: 'BKG-0337', name: 'Early Lisbon', category: 'Car', amount: 47168 },
  { id: 'BKG-0338', name: 'Early Turin', category: 'Hotel', amount: 213178 },
  { id: 'BKG-0339', name: 'Solo Lisbon', category: 'Tour', amount: 789271 },
  { id: 'BKG-0340', name: 'Early Lyon', category: 'Hotel', amount: 935248 },
  { id: 'BKG-0341', name: 'Weekend Bergen', category: 'Car', amount: 160885 },
];

describe('BookingTable filtering', () => {
  it('filters, sorts and pages through 16 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('bru');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0326');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0337');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0335');
    cy.get('input[name=filter]').clear().type('bkg-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
