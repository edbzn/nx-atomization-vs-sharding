import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0043', name: 'Frozen Bundle', category: 'Pending', amount: 586615 },
  { id: 'SHP-0044', name: 'Local Bundle', category: 'Delivered', amount: 455394 },
  { id: 'SHP-0045', name: 'Insured Crate', category: 'Packed', amount: 852585 },
  { id: 'SHP-0046', name: 'Bulk Sack', category: 'Delivered', amount: 620593 },
  { id: 'SHP-0047', name: 'Standard Box', category: 'Pending', amount: 135495 },
  { id: 'SHP-0048', name: 'Local Parcel', category: 'Transit', amount: 717447 },
  { id: 'SHP-0049', name: 'Overseas Parcel', category: 'Packed', amount: 824436 },
  { id: 'SHP-0050', name: 'Frozen Drum', category: 'Returned', amount: 975607 },
  { id: 'SHP-0051', name: 'Frozen Parcel', category: 'Returned', amount: 432094 },
  { id: 'SHP-0052', name: 'Bulk Sack', category: 'Pending', amount: 685761 },
  { id: 'SHP-0053', name: 'Bulk Sack', category: 'Returned', amount: 400143 },
  { id: 'SHP-0054', name: 'Frozen Envelope', category: 'Pending', amount: 553987 },
  { id: 'SHP-0055', name: 'Priority Crate', category: 'Delivered', amount: 279171 },
];

describe('ShipmentTable pagination', () => {
  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('shp-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0043');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0046');
    cy.get('input[name=filter]').clear().type('shp-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0047');
  });
});
