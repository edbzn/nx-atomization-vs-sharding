import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0217', name: 'Budget Krakow', category: 'Tour', amount: 992854 },
  { id: 'BKG-0218', name: 'Flexible Turin', category: 'Hotel', amount: 519098 },
  { id: 'BKG-0219', name: 'Group Porto', category: 'Flight', amount: 508340 },
  { id: 'BKG-0220', name: 'Budget Tallinn', category: 'Car', amount: 385019 },
  { id: 'BKG-0221', name: 'Business Porto', category: 'Car', amount: 291234 },
  { id: 'BKG-0222', name: 'Budget Bergen', category: 'Train', amount: 468297 },
  { id: 'BKG-0223', name: 'Flexible Seville', category: 'Car', amount: 170645 },
  { id: 'BKG-0224', name: 'Budget Porto', category: 'Flight', amount: 543393 },
  { id: 'BKG-0225', name: 'Group Tallinn', category: 'Flight', amount: 761409 },
  { id: 'BKG-0226', name: 'Group Bruges', category: 'Hotel', amount: 486793 },
  { id: 'BKG-0227', name: 'Weekend Lyon', category: 'Flight', amount: 166911 },
  { id: 'BKG-0228', name: 'Budget Lisbon', category: 'Car', amount: 696341 },
];

describe('BookingTable sorting', () => {
  it('filters, sorts and pages through 12 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('BKG-0223');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0217');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0227');
    cy.get('input[name=filter]').clear().type('bkg-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0217');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0227');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0222');
  });
});
