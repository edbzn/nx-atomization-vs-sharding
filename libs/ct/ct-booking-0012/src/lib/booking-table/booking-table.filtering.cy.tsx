import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0054', name: 'Group Lisbon', category: 'Tour', amount: 843767 },
  { id: 'BKG-0055', name: 'Late Krakow', category: 'Car', amount: 528703 },
  { id: 'BKG-0056', name: 'Solo Lyon', category: 'Flight', amount: 998055 },
  { id: 'BKG-0057', name: 'Group Ghent', category: 'Car', amount: 493512 },
  { id: 'BKG-0058', name: 'Flexible Bruges', category: 'Car', amount: 977858 },
  { id: 'BKG-0059', name: 'Early Bruges', category: 'Hotel', amount: 948793 },
  { id: 'BKG-0060', name: 'Budget Ghent', category: 'Tour', amount: 672034 },
  { id: 'BKG-0061', name: 'Group Turin', category: 'Flight', amount: 841903 },
  { id: 'BKG-0062', name: 'Premium Bruges', category: 'Tour', amount: 965372 },
  { id: 'BKG-0063', name: 'Flexible Turin', category: 'Train', amount: 256062 },
  { id: 'BKG-0064', name: 'Business Ghent', category: 'Train', amount: 300832 },
  { id: 'BKG-0065', name: 'Group Bruges', category: 'Flight', amount: 23111 },
];

describe('BookingTable filtering', () => {
  it('filters, sorts and pages through 12 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('bruge');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear().type('Budge');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0060');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0060');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0060');
    cy.get('input[name=filter]').clear().type('BKG-0063');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('Sol');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
