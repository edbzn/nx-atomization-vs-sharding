import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0374', name: 'Priority Tube', category: 'Pending', amount: 282554 },
  { id: 'SHP-0375', name: 'Express Parcel', category: 'Pending', amount: 499564 },
  { id: 'SHP-0376', name: 'Oversize Drum', category: 'Delivered', amount: 533767 },
  { id: 'SHP-0377', name: 'Oversize Pallet', category: 'Packed', amount: 727431 },
  { id: 'SHP-0378', name: 'Bulk Box', category: 'Pending', amount: 504020 },
  { id: 'SHP-0379', name: 'Bulk Crate', category: 'Packed', amount: 840221 },
  { id: 'SHP-0380', name: 'Oversize Tube', category: 'Returned', amount: 970028 },
  { id: 'SHP-0381', name: 'Standard Parcel', category: 'Returned', amount: 697488 },
  { id: 'SHP-0382', name: 'Bulk Container', category: 'Packed', amount: 69822 },
  { id: 'SHP-0383', name: 'Local Box', category: 'Packed', amount: 685654 },
  { id: 'SHP-0384', name: 'Overseas Container', category: 'Pending', amount: 883079 },
  { id: 'SHP-0385', name: 'Standard Tube', category: 'Transit', amount: 399173 },
  { id: 'SHP-0386', name: 'Bulk Sack', category: 'Delivered', amount: 108618 },
  { id: 'SHP-0387', name: 'Fragile Bundle', category: 'Transit', amount: 694369 },
  { id: 'SHP-0388', name: 'Overseas Parcel', category: 'Delivered', amount: 596419 },
  { id: 'SHP-0389', name: 'Bulk Drum', category: 'Pending', amount: 596651 },
  { id: 'SHP-0390', name: 'Priority Pallet', category: 'Delivered', amount: 902781 },
  { id: 'SHP-0391', name: 'Insured Container', category: 'Packed', amount: 404594 },
];

describe('ShipmentTable pagination', () => {
  it('filters, sorts and pages through 18 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0384');
    cy.get('input[name=filter]').clear().type('delivered');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear().type('SHP-0386');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0374');
    cy.get('input[name=filter]').clear().type('delivered');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0374');
    cy.get('input[name=filter]').clear().type('sack');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('pending');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0374');
  });

  it('filters, sorts and pages through 18 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0374');
    cy.get('input[name=filter]').clear().type('returned');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0380');
  });
});
