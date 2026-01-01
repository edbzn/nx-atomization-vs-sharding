import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0067', name: 'Bulk Crate', category: 'Delivered', amount: 346549 },
  { id: 'SHP-0068', name: 'Frozen Container', category: 'Delivered', amount: 269544 },
  { id: 'SHP-0069', name: 'Bulk Pallet', category: 'Returned', amount: 231263 },
  { id: 'SHP-0070', name: 'Insured Parcel', category: 'Returned', amount: 729501 },
  { id: 'SHP-0071', name: 'Priority Crate', category: 'Delivered', amount: 676960 },
  { id: 'SHP-0072', name: 'Priority Drum', category: 'Returned', amount: 710911 },
  { id: 'SHP-0073', name: 'Local Bundle', category: 'Pending', amount: 374861 },
  { id: 'SHP-0074', name: 'Standard Bundle', category: 'Returned', amount: 26065 },
  { id: 'SHP-0075', name: 'Insured Envelope', category: 'Packed', amount: 161837 },
  { id: 'SHP-0076', name: 'Insured Pallet', category: 'Packed', amount: 509690 },
  { id: 'SHP-0077', name: 'Frozen Parcel', category: 'Returned', amount: 161216 },
  { id: 'SHP-0078', name: 'Standard Tube', category: 'Returned', amount: 620789 },
  { id: 'SHP-0079', name: 'Local Sack', category: 'Delivered', amount: 516320 },
  { id: 'SHP-0080', name: 'Overseas Tube', category: 'Transit', amount: 531716 },
  { id: 'SHP-0081', name: 'Priority Box', category: 'Packed', amount: 795046 },
  { id: 'SHP-0082', name: 'Priority Parcel', category: 'Packed', amount: 696450 },
  { id: 'SHP-0083', name: 'Fragile Box', category: 'Returned', amount: 228195 },
  { id: 'SHP-0084', name: 'Fragile Container', category: 'Delivered', amount: 37487 },
];

describe('ShipmentTable sorting', () => {
  it('filters, sorts and pages through 18 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0067');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0077');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0074');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0079');
    cy.get('input[name=filter]').clear().type('SHP-0081');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 18 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0067');
    cy.get('input[name=filter]').clear().type('SHP-0073');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0073');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0073');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0067');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0077');
  });

  it('filters, sorts and pages through 16 shipments', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('shp-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
