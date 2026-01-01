import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0081', name: 'Brushed Desk', category: 'Office', amount: 850343 },
  { id: 'PRD-0082', name: 'Vintage Shelf', category: 'Garden', amount: 381451 },
  { id: 'PRD-0083', name: 'Modular Kettle', category: 'Office', amount: 164982 },
  { id: 'PRD-0084', name: 'Rustic Desk', category: 'Garden', amount: 6006 },
  { id: 'PRD-0085', name: 'Smart Tray', category: 'Garden', amount: 829064 },
  { id: 'PRD-0086', name: 'Folding Desk', category: 'Kitchen', amount: 989396 },
  { id: 'PRD-0087', name: 'Vintage Lamp', category: 'Office', amount: 649384 },
  { id: 'PRD-0088', name: 'Slim Shelf', category: 'Garden', amount: 170449 },
  { id: 'PRD-0089', name: 'Folding Planter', category: 'Outdoor', amount: 117734 },
  { id: 'PRD-0090', name: 'Vintage Kettle', category: 'Garden', amount: 346689 },
  { id: 'PRD-0091', name: 'Classic Desk', category: 'Office', amount: 154971 },
  { id: 'PRD-0092', name: 'Slim Kettle', category: 'Lighting', amount: 672348 },
  { id: 'PRD-0093', name: 'Smart Tray', category: 'Lighting', amount: 928614 },
  { id: 'PRD-0094', name: 'Folding Clock', category: 'Lighting', amount: 377900 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0084');
    cy.get('input[name=filter]').clear().type('Slim');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0088');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0092');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0088');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0081');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0084');
    cy.get('input[name=filter]').clear().type('Vin');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });
});
