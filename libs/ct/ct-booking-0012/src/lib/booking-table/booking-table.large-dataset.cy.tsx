import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0165', name: 'Family Ghent', category: 'Tour', amount: 927008 },
  { id: 'BKG-0166', name: 'Weekend Bruges', category: 'Flight', amount: 705391 },
  { id: 'BKG-0167', name: 'Group Krakow', category: 'Flight', amount: 514451 },
  { id: 'BKG-0168', name: 'Late Bruges', category: 'Car', amount: 214206 },
  { id: 'BKG-0169', name: 'Business Lisbon', category: 'Hotel', amount: 795050 },
  { id: 'BKG-0170', name: 'Solo Turin', category: 'Flight', amount: 88559 },
  { id: 'BKG-0171', name: 'Solo Lyon', category: 'Hotel', amount: 263239 },
  { id: 'BKG-0172', name: 'Early Turin', category: 'Train', amount: 666421 },
  { id: 'BKG-0173', name: 'Solo Porto', category: 'Flight', amount: 192900 },
  { id: 'BKG-0174', name: 'Family Turin', category: 'Hotel', amount: 666963 },
  { id: 'BKG-0175', name: 'Business Seville', category: 'Train', amount: 984882 },
  { id: 'BKG-0176', name: 'Group Lyon', category: 'Flight', amount: 171643 },
  { id: 'BKG-0177', name: 'Late Krakow', category: 'Train', amount: 932809 },
  { id: 'BKG-0178', name: 'Early Lyon', category: 'Tour', amount: 795787 },
  { id: 'BKG-0179', name: 'Weekend Bruges', category: 'Tour', amount: 682333 },
  { id: 'BKG-0180', name: 'Family Turin', category: 'Tour', amount: 519542 },
  { id: 'BKG-0181', name: 'Solo Seville', category: 'Tour', amount: 876163 },
  { id: 'BKG-0182', name: 'Early Krakow', category: 'Hotel', amount: 283983 },
];

describe('BookingTable large dataset', () => {
  it('filters, sorts and pages through 15 bookings', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0165');
    cy.get('input[name=filter]').clear().type('lisbo');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 18 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0169');
  });
});
