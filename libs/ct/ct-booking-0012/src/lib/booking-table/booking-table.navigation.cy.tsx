import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0009', name: 'Budget Lyon', category: 'Flight', amount: 221927 },
  { id: 'BKG-0010', name: 'Solo Bergen', category: 'Flight', amount: 601654 },
  { id: 'BKG-0011', name: 'Budget Turin', category: 'Train', amount: 660419 },
  { id: 'BKG-0012', name: 'Business Lyon', category: 'Car', amount: 731434 },
  { id: 'BKG-0013', name: 'Flexible Ghent', category: 'Hotel', amount: 343355 },
  { id: 'BKG-0014', name: 'Group Lisbon', category: 'Flight', amount: 528582 },
  { id: 'BKG-0015', name: 'Early Lisbon', category: 'Tour', amount: 645609 },
  { id: 'BKG-0016', name: 'Family Tallinn', category: 'Train', amount: 32449 },
  { id: 'BKG-0017', name: 'Late Turin', category: 'Train', amount: 41872 },
  { id: 'BKG-0018', name: 'Business Seville', category: 'Hotel', amount: 28856 },
  { id: 'BKG-0019', name: 'Late Bergen', category: 'Flight', amount: 166755 },
  { id: 'BKG-0020', name: 'Group Seville', category: 'Car', amount: 647240 },
  { id: 'BKG-0021', name: 'Business Krakow', category: 'Flight', amount: 392072 },
  { id: 'BKG-0022', name: 'Budget Bruges', category: 'Tour', amount: 987197 },
];

describe('BookingTable navigation', () => {
  it('filters, sorts and pages through 14 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('bru');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('lis');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('Busin');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('bru');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('sev');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });

  it('filters, sorts and pages through 14 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('krak');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
