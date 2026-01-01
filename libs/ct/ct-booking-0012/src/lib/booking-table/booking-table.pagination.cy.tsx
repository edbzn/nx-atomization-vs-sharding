import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0352', name: 'Premium Ghent', category: 'Flight', amount: 711399 },
  { id: 'BKG-0353', name: 'Late Bergen', category: 'Car', amount: 166377 },
  { id: 'BKG-0354', name: 'Premium Bergen', category: 'Tour', amount: 130345 },
  { id: 'BKG-0355', name: 'Family Seville', category: 'Car', amount: 23951 },
  { id: 'BKG-0356', name: 'Weekend Krakow', category: 'Train', amount: 406211 },
  { id: 'BKG-0357', name: 'Budget Tallinn', category: 'Tour', amount: 202225 },
  { id: 'BKG-0358', name: 'Weekend Bergen', category: 'Flight', amount: 137689 },
  { id: 'BKG-0359', name: 'Budget Bruges', category: 'Tour', amount: 971652 },
  { id: 'BKG-0360', name: 'Business Ghent', category: 'Flight', amount: 802556 },
  { id: 'BKG-0361', name: 'Early Bruges', category: 'Train', amount: 379761 },
  { id: 'BKG-0362', name: 'Group Tallinn', category: 'Flight', amount: 705068 },
  { id: 'BKG-0363', name: 'Late Lyon', category: 'Flight', amount: 489197 },
  { id: 'BKG-0364', name: 'Business Ghent', category: 'Car', amount: 371724 },
  { id: 'BKG-0365', name: 'Flexible Bruges', category: 'Car', amount: 509038 },
];

describe('BookingTable pagination', () => {
  it('filters, sorts and pages through 14 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0359');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0359');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0354');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0354');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0355');
  });

  it('filters, sorts and pages through 14 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0355');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0355');
  });
});
