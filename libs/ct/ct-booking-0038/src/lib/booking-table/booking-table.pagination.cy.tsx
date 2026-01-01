import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0249', name: 'Business Turin', category: 'Train', amount: 298035 },
  { id: 'BKG-0250', name: 'Solo Porto', category: 'Tour', amount: 221110 },
  { id: 'BKG-0251', name: 'Group Tallinn', category: 'Flight', amount: 817937 },
  { id: 'BKG-0252', name: 'Late Ghent', category: 'Tour', amount: 688386 },
  { id: 'BKG-0253', name: 'Family Bruges', category: 'Hotel', amount: 517986 },
  { id: 'BKG-0254', name: 'Weekend Porto', category: 'Tour', amount: 744711 },
  { id: 'BKG-0255', name: 'Family Turin', category: 'Train', amount: 356339 },
  { id: 'BKG-0256', name: 'Solo Porto', category: 'Tour', amount: 340046 },
  { id: 'BKG-0257', name: 'Solo Bergen', category: 'Train', amount: 318552 },
  { id: 'BKG-0258', name: 'Solo Porto', category: 'Hotel', amount: 181933 },
  { id: 'BKG-0259', name: 'Weekend Tallinn', category: 'Tour', amount: 629925 },
  { id: 'BKG-0260', name: 'Weekend Bruges', category: 'Train', amount: 540533 },
  { id: 'BKG-0261', name: 'Business Tallinn', category: 'Car', amount: 71698 },
  { id: 'BKG-0262', name: 'Flexible Tallinn', category: 'Car', amount: 926619 },
  { id: 'BKG-0263', name: 'Early Lisbon', category: 'Train', amount: 881520 },
  { id: 'BKG-0264', name: 'Business Turin', category: 'Flight', amount: 842041 },
  { id: 'BKG-0265', name: 'Group Turin', category: 'Hotel', amount: 995695 },
  { id: 'BKG-0266', name: 'Weekend Ghent', category: 'Flight', amount: 921188 },
];

describe('BookingTable pagination', () => {
  it('filters, sorts and pages through 18 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0249');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0259');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0249');
    cy.get('input[name=filter]').clear().type('bkg-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0249');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0259');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0266');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0256');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0261');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0261');
    cy.get('input[name=filter]').clear().type('BKG-0258');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('tour');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
  });
});
