import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0085', name: 'Classic Stool', category: 'Kitchen', amount: 31510 },
  { id: 'PRD-0086', name: 'Brushed Lamp', category: 'Office', amount: 332219 },
  { id: 'PRD-0087', name: 'Compact Lamp', category: 'Office', amount: 765045 },
  { id: 'PRD-0088', name: 'Modular Lantern', category: 'Lighting', amount: 445809 },
  { id: 'PRD-0089', name: 'Classic Shelf', category: 'Garden', amount: 305221 },
  { id: 'PRD-0090', name: 'Smart Lantern', category: 'Garden', amount: 211836 },
  { id: 'PRD-0091', name: 'Modular Clock', category: 'Garden', amount: 473625 },
  { id: 'PRD-0092', name: 'Slim Bench', category: 'Lighting', amount: 542991 },
  { id: 'PRD-0093', name: 'Classic Planter', category: 'Office', amount: 412707 },
  { id: 'PRD-0094', name: 'Vintage Desk', category: 'Garden', amount: 188853 },
  { id: 'PRD-0095', name: 'Rustic Bench', category: 'Garden', amount: 461645 },
  { id: 'PRD-0096', name: 'Vintage Lantern', category: 'Office', amount: 345412 },
  { id: 'PRD-0097', name: 'Classic Lantern', category: 'Office', amount: 571324 },
  { id: 'PRD-0098', name: 'Rustic Clock', category: 'Outdoor', amount: 77608 },
  { id: 'PRD-0099', name: 'Slim Planter', category: 'Office', amount: 924871 },
  { id: 'PRD-0100', name: 'Rustic Planter', category: 'Office', amount: 371861 },
  { id: 'PRD-0101', name: 'Brushed Planter', category: 'Outdoor', amount: 806200 },
];

describe('ProductTable search', () => {
  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('outdoor');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0098');
  });
});
