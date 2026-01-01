import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0196', name: 'Heavy Desk', category: 'Kitchen', amount: 480749 },
  { id: 'PRD-0197', name: 'Smart Bench', category: 'Lighting', amount: 75655 },
  { id: 'PRD-0198', name: 'Classic Kettle', category: 'Kitchen', amount: 767990 },
  { id: 'PRD-0199', name: 'Modular Clock', category: 'Office', amount: 537336 },
  { id: 'PRD-0200', name: 'Vintage Shelf', category: 'Lighting', amount: 685901 },
  { id: 'PRD-0201', name: 'Smart Kettle', category: 'Lighting', amount: 330927 },
  { id: 'PRD-0202', name: 'Brushed Shelf', category: 'Lighting', amount: 31077 },
  { id: 'PRD-0203', name: 'Modular Lantern', category: 'Kitchen', amount: 343136 },
  { id: 'PRD-0204', name: 'Rustic Bench', category: 'Kitchen', amount: 946002 },
  { id: 'PRD-0205', name: 'Vintage Clock', category: 'Office', amount: 678255 },
  { id: 'PRD-0206', name: 'Modular Tray', category: 'Office', amount: 290685 },
  { id: 'PRD-0207', name: 'Smart Tray', category: 'Garden', amount: 519757 },
  { id: 'PRD-0208', name: 'Folding Shelf', category: 'Office', amount: 273125 },
  { id: 'PRD-0209', name: 'Rustic Planter', category: 'Office', amount: 801851 },
  { id: 'PRD-0210', name: 'Compact Planter', category: 'Outdoor', amount: 930070 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 15 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0196');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0196');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0202');
  });

  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS.slice(0, 14);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0202');
  });
});
