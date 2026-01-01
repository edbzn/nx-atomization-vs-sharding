import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0110', name: 'Family Turin', category: 'Flight', amount: 313585 },
  { id: 'BKG-0111', name: 'Solo Turin', category: 'Car', amount: 393145 },
  { id: 'BKG-0112', name: 'Late Bergen', category: 'Flight', amount: 379116 },
  { id: 'BKG-0113', name: 'Flexible Ghent', category: 'Tour', amount: 64630 },
  { id: 'BKG-0114', name: 'Family Lyon', category: 'Tour', amount: 653792 },
  { id: 'BKG-0115', name: 'Solo Bergen', category: 'Car', amount: 109913 },
  { id: 'BKG-0116', name: 'Business Turin', category: 'Flight', amount: 722484 },
  { id: 'BKG-0117', name: 'Flexible Turin', category: 'Tour', amount: 715955 },
  { id: 'BKG-0118', name: 'Premium Turin', category: 'Car', amount: 916280 },
  { id: 'BKG-0119', name: 'Late Bergen', category: 'Hotel', amount: 92082 },
  { id: 'BKG-0120', name: 'Group Porto', category: 'Hotel', amount: 14025 },
  { id: 'BKG-0121', name: 'Early Tallinn', category: 'Tour', amount: 780720 },
  { id: 'BKG-0122', name: 'Budget Lisbon', category: 'Flight', amount: 202461 },
];

describe('BookingTable filtering', () => {
  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0110');
    cy.get('input[name=filter]').clear().type('train');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0122');
    cy.get('input[name=filter]').clear().type('BKG-0111');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
