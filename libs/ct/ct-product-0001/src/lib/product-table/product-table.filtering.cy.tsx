import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0114', name: 'Slim Kettle', category: 'Office', amount: 90037 },
  { id: 'PRD-0115', name: 'Heavy Bench', category: 'Outdoor', amount: 361093 },
  { id: 'PRD-0116', name: 'Heavy Planter', category: 'Outdoor', amount: 429767 },
  { id: 'PRD-0117', name: 'Folding Clock', category: 'Garden', amount: 437121 },
  { id: 'PRD-0118', name: 'Rustic Bench', category: 'Kitchen', amount: 661021 },
  { id: 'PRD-0119', name: 'Rustic Lantern', category: 'Lighting', amount: 711933 },
  { id: 'PRD-0120', name: 'Rustic Kettle', category: 'Garden', amount: 911841 },
  { id: 'PRD-0121', name: 'Smart Bench', category: 'Outdoor', amount: 629652 },
  { id: 'PRD-0122', name: 'Heavy Stool', category: 'Kitchen', amount: 368827 },
  { id: 'PRD-0123', name: 'Slim Planter', category: 'Outdoor', amount: 149965 },
  { id: 'PRD-0124', name: 'Smart Stool', category: 'Office', amount: 453334 },
  { id: 'PRD-0125', name: 'Brushed Clock', category: 'Lighting', amount: 575658 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 12 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0124');
    cy.get('input[name=filter]').clear().type('stool');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0122');
  });
});
