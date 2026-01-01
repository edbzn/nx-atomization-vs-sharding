import { BookingTable } from './BookingTable';
import type { BookingRow } from '../types';

const ROWS: BookingRow[] = [
  { id: 'BKG-0098', name: 'Flexible Porto', category: 'Tour', amount: 975775 },
  { id: 'BKG-0099', name: 'Flexible Bergen', category: 'Flight', amount: 935378 },
  { id: 'BKG-0100', name: 'Premium Lisbon', category: 'Train', amount: 575766 },
  { id: 'BKG-0101', name: 'Group Lisbon', category: 'Tour', amount: 899118 },
  { id: 'BKG-0102', name: 'Flexible Seville', category: 'Train', amount: 164159 },
  { id: 'BKG-0103', name: 'Early Seville', category: 'Flight', amount: 230579 },
  { id: 'BKG-0104', name: 'Early Ghent', category: 'Car', amount: 726919 },
  { id: 'BKG-0105', name: 'Late Porto', category: 'Car', amount: 900025 },
  { id: 'BKG-0106', name: 'Budget Lisbon', category: 'Train', amount: 166100 },
  { id: 'BKG-0107', name: 'Premium Bruges', category: 'Train', amount: 352473 },
  { id: 'BKG-0108', name: 'Late Lisbon', category: 'Flight', amount: 746639 },
  { id: 'BKG-0109', name: 'Family Seville', category: 'Hotel', amount: 993424 },
  { id: 'BKG-0110', name: 'Solo Porto', category: 'Car', amount: 750835 },
  { id: 'BKG-0111', name: 'Premium Lyon', category: 'Car', amount: 458431 },
  { id: 'BKG-0112', name: 'Early Ghent', category: 'Car', amount: 573749 },
  { id: 'BKG-0113', name: 'Late Krakow', category: 'Train', amount: 603269 },
  { id: 'BKG-0114', name: 'Early Seville', category: 'Flight', amount: 674010 },
  { id: 'BKG-0115', name: 'Business Turin', category: 'Tour', amount: 144390 },
  { id: 'BKG-0116', name: 'Business Lyon', category: 'Flight', amount: 861489 },
];

describe('BookingTable sorting 2', () => {
  it('filters, sorts and pages through 19 bookings', () => {
    const rows = ROWS;
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0098');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0106');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0115');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'BKG-0115');
  });

  it('filters, sorts and pages through 14 bookings', () => {
    const rows = ROWS.slice(0, 14);
    cy.mount(<BookingTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Late');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });
});
