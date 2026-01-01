import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0221', name: 'Overseas Box', category: 'Returned', amount: 140071 },
  { id: 'SHP-0222', name: 'Priority Container', category: 'Pending', amount: 679864 },
  { id: 'SHP-0223', name: 'Bulk Bundle', category: 'Returned', amount: 441295 },
  { id: 'SHP-0224', name: 'Local Envelope', category: 'Pending', amount: 630323 },
  { id: 'SHP-0225', name: 'Standard Drum', category: 'Returned', amount: 342998 },
  { id: 'SHP-0226', name: 'Priority Envelope', category: 'Transit', amount: 835835 },
  { id: 'SHP-0227', name: 'Oversize Tube', category: 'Packed', amount: 590459 },
  { id: 'SHP-0228', name: 'Frozen Container', category: 'Packed', amount: 385955 },
  { id: 'SHP-0229', name: 'Overseas Parcel', category: 'Pending', amount: 332350 },
  { id: 'SHP-0230', name: 'Bulk Box', category: 'Packed', amount: 728162 },
  { id: 'SHP-0231', name: 'Frozen Parcel', category: 'Packed', amount: 584178 },
  { id: 'SHP-0232', name: 'Insured Tube', category: 'Delivered', amount: 958368 },
  { id: 'SHP-0233', name: 'Express Drum', category: 'Returned', amount: 615101 },
];

describe('ShipmentTable sorting', () => {
  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0221');
    cy.get('input[name=filter]').clear().type('SHP-0225');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('Exp');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('shp-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('Over');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('Loc');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0230');
  });

  it('filters, sorts and pages through 13 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0221');
  });
});
