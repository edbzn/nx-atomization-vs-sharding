import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0104', name: 'Classic Lantern', category: 'Kitchen', amount: 64622 },
  { id: 'PRD-0105', name: 'Heavy Stool', category: 'Lighting', amount: 939283 },
  { id: 'PRD-0106', name: 'Compact Kettle', category: 'Garden', amount: 586689 },
  { id: 'PRD-0107', name: 'Slim Planter', category: 'Lighting', amount: 191635 },
  { id: 'PRD-0108', name: 'Folding Kettle', category: 'Lighting', amount: 334852 },
  { id: 'PRD-0109', name: 'Classic Clock', category: 'Garden', amount: 668269 },
  { id: 'PRD-0110', name: 'Smart Clock', category: 'Office', amount: 822571 },
  { id: 'PRD-0111', name: 'Modular Desk', category: 'Office', amount: 509645 },
  { id: 'PRD-0112', name: 'Modular Lamp', category: 'Outdoor', amount: 669296 },
  { id: 'PRD-0113', name: 'Compact Shelf', category: 'Kitchen', amount: 618336 },
  { id: 'PRD-0114', name: 'Classic Lantern', category: 'Lighting', amount: 255948 },
  { id: 'PRD-0115', name: 'Vintage Stool', category: 'Garden', amount: 832377 },
  { id: 'PRD-0116', name: 'Slim Kettle', category: 'Garden', amount: 136463 },
  { id: 'PRD-0117', name: 'Vintage Shelf', category: 'Lighting', amount: 264440 },
  { id: 'PRD-0118', name: 'Compact Clock', category: 'Outdoor', amount: 144554 },
  { id: 'PRD-0119', name: 'Modular Lantern', category: 'Kitchen', amount: 756836 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0114');
    cy.get('input[name=filter]').clear().type('Brus');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
