import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0378', name: 'Late Seville', category: 'Hotel', amount: 204693 },
  { id: 'BKG-0379', name: 'Family Krakow', category: 'Tour', amount: 595767 },
  { id: 'BKG-0380', name: 'Late Bruges', category: 'Hotel', amount: 911849 },
  { id: 'BKG-0381', name: 'Early Bruges', category: 'Flight', amount: 967765 },
  { id: 'BKG-0382', name: 'Solo Bruges', category: 'Train', amount: 164661 },
  { id: 'BKG-0383', name: 'Business Porto', category: 'Tour', amount: 11865 },
  { id: 'BKG-0384', name: 'Flexible Bruges', category: 'Tour', amount: 707729 },
  { id: 'BKG-0385', name: 'Early Lyon', category: 'Hotel', amount: 501297 },
  { id: 'BKG-0386', name: 'Family Turin', category: 'Car', amount: 51895 },
  { id: 'BKG-0387', name: 'Business Turin', category: 'Hotel', amount: 171632 },
  { id: 'BKG-0388', name: 'Weekend Ghent', category: 'Hotel', amount: 898919 },
  { id: 'BKG-0389', name: 'Business Lyon', category: 'Flight', amount: 264757 },
  { id: 'BKG-0390', name: 'Solo Tallinn', category: 'Hotel', amount: 161971 },
  { id: 'BKG-0391', name: 'Group Lisbon', category: 'Flight', amount: 485637 },
  { id: 'BKG-0392', name: 'Early Ghent', category: 'Tour', amount: 449049 },
  { id: 'BKG-0393', name: 'Premium Seville', category: 'Flight', amount: 345229 },
  { id: 'BKG-0394', name: 'Budget Krakow', category: 'Train', amount: 291127 },
];

describe('BookingTable search', () => {
  it('filters, sorts and pages through 17 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0378');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0388');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0388');
  });
});
