import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0270', name: 'Local Box', category: 'Pending', amount: 164662 },
  { id: 'SHP-0271', name: 'Express Container', category: 'Packed', amount: 603792 },
  { id: 'SHP-0272', name: 'Frozen Parcel', category: 'Returned', amount: 753705 },
  { id: 'SHP-0273', name: 'Bulk Drum', category: 'Packed', amount: 2042 },
  { id: 'SHP-0274', name: 'Frozen Drum', category: 'Delivered', amount: 604461 },
  { id: 'SHP-0275', name: 'Frozen Drum', category: 'Delivered', amount: 566669 },
  { id: 'SHP-0276', name: 'Bulk Parcel', category: 'Transit', amount: 220645 },
  { id: 'SHP-0277', name: 'Overseas Box', category: 'Packed', amount: 266681 },
  { id: 'SHP-0278', name: 'Frozen Container', category: 'Delivered', amount: 353796 },
  { id: 'SHP-0279', name: 'Insured Tube', category: 'Packed', amount: 572060 },
  { id: 'SHP-0280', name: 'Standard Container', category: 'Delivered', amount: 655270 },
  { id: 'SHP-0281', name: 'Fragile Pallet', category: 'Delivered', amount: 424496 },
  { id: 'SHP-0282', name: 'Express Pallet', category: 'Packed', amount: 764508 },
];

describe('ShipmentTable filtering', () => {
  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0280');
    cy.get('input[name=filter]').clear().type('shp-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('shp-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('transit');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
