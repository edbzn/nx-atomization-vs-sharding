import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0105', name: 'Solo Porto', category: 'Hotel', amount: 105828 },
  { id: 'BKG-0106', name: 'Late Porto', category: 'Car', amount: 153980 },
  { id: 'BKG-0107', name: 'Late Lyon', category: 'Hotel', amount: 409052 },
  { id: 'BKG-0108', name: 'Solo Krakow', category: 'Flight', amount: 870927 },
  { id: 'BKG-0109', name: 'Late Ghent', category: 'Train', amount: 349125 },
  { id: 'BKG-0110', name: 'Business Bruges', category: 'Train', amount: 233891 },
  { id: 'BKG-0111', name: 'Group Tallinn', category: 'Hotel', amount: 794635 },
  { id: 'BKG-0112', name: 'Family Lisbon', category: 'Tour', amount: 426132 },
  { id: 'BKG-0113', name: 'Family Lisbon', category: 'Flight', amount: 191110 },
  { id: 'BKG-0114', name: 'Group Lisbon', category: 'Flight', amount: 462932 },
  { id: 'BKG-0115', name: 'Weekend Ghent', category: 'Hotel', amount: 610154 },
  { id: 'BKG-0116', name: 'Family Turin', category: 'Flight', amount: 993777 },
  { id: 'BKG-0117', name: 'Premium Seville', category: 'Car', amount: 847472 },
  { id: 'BKG-0118', name: 'Early Porto', category: 'Flight', amount: 927272 },
  { id: 'BKG-0119', name: 'Budget Turin', category: 'Tour', amount: 320655 },
  { id: 'BKG-0120', name: 'Solo Turin', category: 'Car', amount: 551524 },
  { id: 'BKG-0121', name: 'Business Ghent', category: 'Train', amount: 177269 },
  { id: 'BKG-0122', name: 'Flexible Bergen', category: 'Car', amount: 195037 },
  { id: 'BKG-0123', name: 'Family Tallinn', category: 'Flight', amount: 620428 },
  { id: 'BKG-0124', name: 'Budget Seville', category: 'Train', amount: 462781 },
];

describe('BookingTable sorting', () => {
  it('filters, sorts and pages through 20 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('hotel');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0105');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0115');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0124');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0105');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0115');
  });
});
