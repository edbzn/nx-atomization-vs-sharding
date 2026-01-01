import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0094', name: 'Frozen Container', category: 'Transit', amount: 375978 },
  { id: 'SHP-0095', name: 'Insured Sack', category: 'Returned', amount: 133920 },
  { id: 'SHP-0096', name: 'Standard Drum', category: 'Returned', amount: 332736 },
  { id: 'SHP-0097', name: 'Standard Envelope', category: 'Packed', amount: 220402 },
  { id: 'SHP-0098', name: 'Local Sack', category: 'Packed', amount: 108210 },
  { id: 'SHP-0099', name: 'Insured Sack', category: 'Pending', amount: 74903 },
  { id: 'SHP-0100', name: 'Insured Parcel', category: 'Pending', amount: 477354 },
  { id: 'SHP-0101', name: 'Local Bundle', category: 'Returned', amount: 892608 },
  { id: 'SHP-0102', name: 'Bulk Sack', category: 'Delivered', amount: 759612 },
  { id: 'SHP-0103', name: 'Priority Parcel', category: 'Pending', amount: 166883 },
  { id: 'SHP-0104', name: 'Insured Pallet', category: 'Pending', amount: 18272 },
  { id: 'SHP-0105', name: 'Frozen Bundle', category: 'Transit', amount: 227175 },
];

describe('ShipmentTable filtering', () => {
  it('filters, sorts and pages through 12 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0094');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0094');
    cy.get('input[name=filter]').clear().type('Froz');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });

  it('filters, sorts and pages through 12 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0104');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0101');
  });
});
