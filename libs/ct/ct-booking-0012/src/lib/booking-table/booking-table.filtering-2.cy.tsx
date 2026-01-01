import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0230', name: 'Weekend Lisbon', category: 'Tour', amount: 144161 },
  { id: 'BKG-0231', name: 'Flexible Tallinn', category: 'Hotel', amount: 466844 },
  { id: 'BKG-0232', name: 'Budget Tallinn', category: 'Train', amount: 763587 },
  { id: 'BKG-0233', name: 'Premium Bruges', category: 'Train', amount: 540980 },
  { id: 'BKG-0234', name: 'Budget Bergen', category: 'Flight', amount: 460179 },
  { id: 'BKG-0235', name: 'Family Seville', category: 'Hotel', amount: 584792 },
  { id: 'BKG-0236', name: 'Family Krakow', category: 'Tour', amount: 376087 },
  { id: 'BKG-0237', name: 'Weekend Lisbon', category: 'Car', amount: 375195 },
  { id: 'BKG-0238', name: 'Premium Ghent', category: 'Tour', amount: 288428 },
  { id: 'BKG-0239', name: 'Family Ghent', category: 'Hotel', amount: 110478 },
  { id: 'BKG-0240', name: 'Budget Seville', category: 'Car', amount: 550764 },
  { id: 'BKG-0241', name: 'Premium Porto', category: 'Tour', amount: 73318 },
  { id: 'BKG-0242', name: 'Early Ghent', category: 'Tour', amount: 473343 },
];

describe('BookingTable filtering 2', () => {
  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0240');
    cy.get('input[name=filter]').clear().type('bkg-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0230');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0240');
  });
});
