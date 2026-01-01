import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0322', name: 'Early Tallinn', category: 'Hotel', amount: 91043 },
  { id: 'BKG-0323', name: 'Early Ghent', category: 'Tour', amount: 380104 },
  { id: 'BKG-0324', name: 'Early Lyon', category: 'Train', amount: 242005 },
  { id: 'BKG-0325', name: 'Group Ghent', category: 'Flight', amount: 640592 },
  { id: 'BKG-0326', name: 'Flexible Tallinn', category: 'Hotel', amount: 713873 },
  { id: 'BKG-0327', name: 'Solo Bruges', category: 'Flight', amount: 626223 },
  { id: 'BKG-0328', name: 'Weekend Lyon', category: 'Flight', amount: 726731 },
  { id: 'BKG-0329', name: 'Budget Turin', category: 'Flight', amount: 163223 },
  { id: 'BKG-0330', name: 'Early Krakow', category: 'Car', amount: 461698 },
  { id: 'BKG-0331', name: 'Premium Lyon', category: 'Train', amount: 837821 },
  { id: 'BKG-0332', name: 'Group Bergen', category: 'Train', amount: 853996 },
  { id: 'BKG-0333', name: 'Early Turin', category: 'Hotel', amount: 986440 },
];

describe('BookingTable pagination', () => {
  it('filters, sorts and pages through 12 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0332');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0322');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0322');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0322');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0322');
    cy.get('input[name=filter]').clear().type('Grou');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0322');
    cy.get('input[name=filter]').clear().type('sevill');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 12 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('bkg-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
