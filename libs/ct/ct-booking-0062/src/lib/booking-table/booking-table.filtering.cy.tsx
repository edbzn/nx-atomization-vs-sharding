import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0349', name: 'Family Bergen', category: 'Train', amount: 14344 },
  { id: 'BKG-0350', name: 'Budget Ghent', category: 'Tour', amount: 151141 },
  { id: 'BKG-0351', name: 'Premium Bergen', category: 'Flight', amount: 535644 },
  { id: 'BKG-0352', name: 'Solo Tallinn', category: 'Flight', amount: 154110 },
  { id: 'BKG-0353', name: 'Budget Tallinn', category: 'Tour', amount: 676831 },
  { id: 'BKG-0354', name: 'Flexible Seville', category: 'Car', amount: 716485 },
  { id: 'BKG-0355', name: 'Budget Tallinn', category: 'Tour', amount: 109414 },
  { id: 'BKG-0356', name: 'Late Turin', category: 'Car', amount: 990059 },
  { id: 'BKG-0357', name: 'Late Ghent', category: 'Flight', amount: 845443 },
  { id: 'BKG-0358', name: 'Flexible Lyon', category: 'Car', amount: 312793 },
  { id: 'BKG-0359', name: 'Late Lisbon', category: 'Flight', amount: 846471 },
  { id: 'BKG-0360', name: 'Weekend Bergen', category: 'Flight', amount: 684016 },
  { id: 'BKG-0361', name: 'Budget Krakow', category: 'Hotel', amount: 918636 },
  { id: 'BKG-0362', name: 'Budget Bruges', category: 'Train', amount: 776502 },
  { id: 'BKG-0363', name: 'Premium Porto', category: 'Flight', amount: 68836 },
  { id: 'BKG-0364', name: 'Group Krakow', category: 'Hotel', amount: 830866 },
  { id: 'BKG-0365', name: 'Solo Turin', category: 'Hotel', amount: 814883 },
];

describe('BookingTable filtering', () => {
  it('filters, sorts and pages through 17 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0359');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0349');
  });

  it('filters, sorts and pages through 17 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('bkg-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
