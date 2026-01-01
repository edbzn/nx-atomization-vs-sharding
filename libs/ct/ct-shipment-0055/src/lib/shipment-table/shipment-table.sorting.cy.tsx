import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0266', name: 'Frozen Crate', category: 'Packed', amount: 533457 },
  { id: 'SHP-0267', name: 'Fragile Box', category: 'Pending', amount: 479800 },
  { id: 'SHP-0268', name: 'Insured Bundle', category: 'Returned', amount: 349 },
  { id: 'SHP-0269', name: 'Fragile Sack', category: 'Pending', amount: 355628 },
  { id: 'SHP-0270', name: 'Local Box', category: 'Pending', amount: 826729 },
  { id: 'SHP-0271', name: 'Frozen Container', category: 'Packed', amount: 30046 },
  { id: 'SHP-0272', name: 'Express Tube', category: 'Pending', amount: 176221 },
  { id: 'SHP-0273', name: 'Local Envelope', category: 'Delivered', amount: 138672 },
  { id: 'SHP-0274', name: 'Oversize Tube', category: 'Pending', amount: 678953 },
  { id: 'SHP-0275', name: 'Express Envelope', category: 'Returned', amount: 336054 },
  { id: 'SHP-0276', name: 'Fragile Bundle', category: 'Packed', amount: 274186 },
  { id: 'SHP-0277', name: 'Priority Box', category: 'Returned', amount: 294851 },
];

describe('ShipmentTable sorting', () => {
  it('filters, sorts and pages through 12 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('shp-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0266');
    cy.get('input[name=filter]').clear().type('SHP-0274');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 12 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0266');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0266');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0276');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0266');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0266');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0266');
    cy.get('input[name=filter]').clear().type('SHP-0273');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
