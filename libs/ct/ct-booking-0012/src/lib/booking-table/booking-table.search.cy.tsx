import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0246', name: 'Late Turin', category: 'Hotel', amount: 833460 },
  { id: 'BKG-0247', name: 'Weekend Lyon', category: 'Car', amount: 780937 },
  { id: 'BKG-0248', name: 'Weekend Turin', category: 'Train', amount: 318883 },
  { id: 'BKG-0249', name: 'Early Porto', category: 'Flight', amount: 81241 },
  { id: 'BKG-0250', name: 'Premium Ghent', category: 'Hotel', amount: 338823 },
  { id: 'BKG-0251', name: 'Solo Turin', category: 'Car', amount: 307873 },
  { id: 'BKG-0252', name: 'Budget Ghent', category: 'Flight', amount: 572477 },
  { id: 'BKG-0253', name: 'Group Seville', category: 'Flight', amount: 650035 },
  { id: 'BKG-0254', name: 'Family Krakow', category: 'Tour', amount: 576222 },
  { id: 'BKG-0255', name: 'Weekend Seville', category: 'Flight', amount: 902458 },
  { id: 'BKG-0256', name: 'Flexible Krakow', category: 'Train', amount: 174356 },
  { id: 'BKG-0257', name: 'Group Krakow', category: 'Flight', amount: 675812 },
  { id: 'BKG-0258', name: 'Late Bergen', category: 'Train', amount: 224106 },
  { id: 'BKG-0259', name: 'Flexible Lyon', category: 'Tour', amount: 711897 },
];

describe('BookingTable search', () => {
  it('filters, sorts and pages through 14 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0246');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0246');
    cy.get('input[name=filter]').clear().type('bkg-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0246');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0246');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0246');
  });

  it('filters, sorts and pages through 14 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0252');
  });
});
