import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0185', name: 'Group Bruges', category: 'Tour', amount: 919179 },
  { id: 'BKG-0186', name: 'Budget Tallinn', category: 'Hotel', amount: 287756 },
  { id: 'BKG-0187', name: 'Flexible Bruges', category: 'Tour', amount: 663526 },
  { id: 'BKG-0188', name: 'Premium Krakow', category: 'Car', amount: 802668 },
  { id: 'BKG-0189', name: 'Flexible Turin', category: 'Car', amount: 644221 },
  { id: 'BKG-0190', name: 'Business Ghent', category: 'Tour', amount: 978294 },
  { id: 'BKG-0191', name: 'Late Tallinn', category: 'Hotel', amount: 946514 },
  { id: 'BKG-0192', name: 'Solo Bergen', category: 'Train', amount: 716395 },
  { id: 'BKG-0193', name: 'Early Porto', category: 'Tour', amount: 236982 },
  { id: 'BKG-0194', name: 'Flexible Krakow', category: 'Train', amount: 614952 },
  { id: 'BKG-0195', name: 'Flexible Turin', category: 'Car', amount: 204254 },
  { id: 'BKG-0196', name: 'Early Lisbon', category: 'Hotel', amount: 856776 },
  { id: 'BKG-0197', name: 'Weekend Ghent', category: 'Car', amount: 165085 },
];

describe('BookingTable sorting', () => {
  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0186');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0188');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0186');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0197');
    cy.get('input[name=filter]').clear().type('bkg-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 13 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('bkg-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
