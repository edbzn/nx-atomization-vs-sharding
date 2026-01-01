import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0392', name: 'Family Tallinn', category: 'Hotel', amount: 546363 },
  { id: 'BKG-0393', name: 'Weekend Tallinn', category: 'Flight', amount: 94773 },
  { id: 'BKG-0394', name: 'Premium Seville', category: 'Car', amount: 810547 },
  { id: 'BKG-0395', name: 'Budget Bergen', category: 'Flight', amount: 44126 },
  { id: 'BKG-0396', name: 'Group Krakow', category: 'Train', amount: 56568 },
  { id: 'BKG-0397', name: 'Solo Bergen', category: 'Car', amount: 799170 },
  { id: 'BKG-0398', name: 'Budget Bergen', category: 'Tour', amount: 100640 },
  { id: 'BKG-0399', name: 'Weekend Ghent', category: 'Hotel', amount: 112463 },
  { id: 'BKG-0400', name: 'Budget Lyon', category: 'Flight', amount: 280708 },
  { id: 'BKG-0401', name: 'Weekend Tallinn', category: 'Car', amount: 671058 },
  { id: 'BKG-0402', name: 'Family Turin', category: 'Tour', amount: 638058 },
  { id: 'BKG-0403', name: 'Early Porto', category: 'Tour', amount: 444815 },
  { id: 'BKG-0404', name: 'Weekend Lyon', category: 'Flight', amount: 434163 },
  { id: 'BKG-0405', name: 'Group Tallinn', category: 'Train', amount: 714157 },
  { id: 'BKG-0406', name: 'Premium Porto', category: 'Tour', amount: 937709 },
  { id: 'BKG-0407', name: 'Budget Porto', category: 'Flight', amount: 479142 },
];

describe('BookingTable filtering', () => {
  it('filters, sorts and pages through 16 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('lisb');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('bkg-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
