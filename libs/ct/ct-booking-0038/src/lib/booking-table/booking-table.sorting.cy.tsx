import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0174', name: 'Solo Bergen', category: 'Flight', amount: 344880 },
  { id: 'BKG-0175', name: 'Early Lyon', category: 'Flight', amount: 720255 },
  { id: 'BKG-0176', name: 'Premium Bergen', category: 'Flight', amount: 774608 },
  { id: 'BKG-0177', name: 'Family Lisbon', category: 'Train', amount: 644851 },
  { id: 'BKG-0178', name: 'Family Bruges', category: 'Tour', amount: 692624 },
  { id: 'BKG-0179', name: 'Early Seville', category: 'Hotel', amount: 242667 },
  { id: 'BKG-0180', name: 'Business Turin', category: 'Tour', amount: 319716 },
  { id: 'BKG-0181', name: 'Solo Bergen', category: 'Tour', amount: 598351 },
  { id: 'BKG-0182', name: 'Group Tallinn', category: 'Flight', amount: 127666 },
  { id: 'BKG-0183', name: 'Early Krakow', category: 'Tour', amount: 776894 },
  { id: 'BKG-0184', name: 'Weekend Turin', category: 'Hotel', amount: 163989 },
  { id: 'BKG-0185', name: 'Family Seville', category: 'Car', amount: 734461 },
  { id: 'BKG-0186', name: 'Family Ghent', category: 'Hotel', amount: 441402 },
  { id: 'BKG-0187', name: 'Premium Bergen', category: 'Train', amount: 961176 },
  { id: 'BKG-0188', name: 'Family Tallinn', category: 'Flight', amount: 994152 },
  { id: 'BKG-0189', name: 'Budget Turin', category: 'Train', amount: 19790 },
  { id: 'BKG-0190', name: 'Weekend Tallinn', category: 'Car', amount: 878373 },
  { id: 'BKG-0191', name: 'Late Bergen', category: 'Car', amount: 974615 },
  { id: 'BKG-0192', name: 'Business Ghent', category: 'Train', amount: 562442 },
  { id: 'BKG-0193', name: 'Weekend Turin', category: 'Car', amount: 974726 },
];

describe('BookingTable sorting', () => {
  it('filters, sorts and pages through 20 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0174');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0189');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0189');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0189');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0174');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0184');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0174');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0184');
  });

  it('filters, sorts and pages through 20 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0174');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0189');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0188');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0189');
    cy.get('input[name=filter]').clear().type('bkg-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 17 bookings', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Wee');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });
});
