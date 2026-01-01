import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0055', name: 'Overseas Envelope', category: 'Returned', amount: 8610 },
  { id: 'SHP-0056', name: 'Frozen Container', category: 'Returned', amount: 6301 },
  { id: 'SHP-0057', name: 'Local Envelope', category: 'Delivered', amount: 520255 },
  { id: 'SHP-0058', name: 'Frozen Bundle', category: 'Delivered', amount: 249112 },
  { id: 'SHP-0059', name: 'Bulk Bundle', category: 'Transit', amount: 315519 },
  { id: 'SHP-0060', name: 'Overseas Sack', category: 'Returned', amount: 622929 },
  { id: 'SHP-0061', name: 'Standard Crate', category: 'Delivered', amount: 839597 },
  { id: 'SHP-0062', name: 'Overseas Crate', category: 'Transit', amount: 912801 },
  { id: 'SHP-0063', name: 'Oversize Tube', category: 'Delivered', amount: 222281 },
  { id: 'SHP-0064', name: 'Frozen Pallet', category: 'Packed', amount: 279243 },
  { id: 'SHP-0065', name: 'Frozen Parcel', category: 'Pending', amount: 468135 },
  { id: 'SHP-0066', name: 'Express Pallet', category: 'Returned', amount: 524373 },
  { id: 'SHP-0067', name: 'Oversize Bundle', category: 'Transit', amount: 613560 },
  { id: 'SHP-0068', name: 'Oversize Sack', category: 'Returned', amount: 72236 },
  { id: 'SHP-0069', name: 'Express Tube', category: 'Pending', amount: 73830 },
  { id: 'SHP-0070', name: 'Frozen Pallet', category: 'Packed', amount: 364483 },
  { id: 'SHP-0071', name: 'Bulk Box', category: 'Delivered', amount: 411517 },
  { id: 'SHP-0072', name: 'Local Envelope', category: 'Packed', amount: 451150 },
];

describe('ShipmentTable large dataset', () => {
  it('filters, sorts and pages through 18 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('bund');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('sack');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0060');
  });
});
