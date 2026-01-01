import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0346', name: 'Business Turin', category: 'Hotel', amount: 151319 },
  { id: 'BKG-0347', name: 'Late Ghent', category: 'Hotel', amount: 432641 },
  { id: 'BKG-0348', name: 'Late Ghent', category: 'Hotel', amount: 51098 },
  { id: 'BKG-0349', name: 'Family Lisbon', category: 'Flight', amount: 441145 },
  { id: 'BKG-0350', name: 'Flexible Lyon', category: 'Train', amount: 362422 },
  { id: 'BKG-0351', name: 'Group Turin', category: 'Car', amount: 545512 },
  { id: 'BKG-0352', name: 'Early Lisbon', category: 'Train', amount: 103668 },
  { id: 'BKG-0353', name: 'Early Lyon', category: 'Train', amount: 813577 },
  { id: 'BKG-0354', name: 'Flexible Lyon', category: 'Hotel', amount: 62131 },
  { id: 'BKG-0355', name: 'Early Ghent', category: 'Hotel', amount: 575361 },
  { id: 'BKG-0356', name: 'Solo Porto', category: 'Car', amount: 725522 },
  { id: 'BKG-0357', name: 'Solo Tallinn', category: 'Train', amount: 489699 },
  { id: 'BKG-0358', name: 'Flexible Bergen', category: 'Hotel', amount: 178937 },
  { id: 'BKG-0359', name: 'Flexible Bruges', category: 'Hotel', amount: 939466 },
];

describe('BookingTable sorting', () => {
  it('filters, sorts and pages through 14 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0346');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0348');
    cy.get('input[name=filter]').clear().type('Solo');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0348');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0355');
    cy.get('input[name=filter]').clear().type('tal');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
