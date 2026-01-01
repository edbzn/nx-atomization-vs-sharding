import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0217', name: 'Rustic Lamp', category: 'Kitchen', amount: 221272 },
  { id: 'PRD-0218', name: 'Slim Desk', category: 'Garden', amount: 517605 },
  { id: 'PRD-0219', name: 'Folding Kettle', category: 'Lighting', amount: 631920 },
  { id: 'PRD-0220', name: 'Heavy Stool', category: 'Office', amount: 557821 },
  { id: 'PRD-0221', name: 'Brushed Lantern', category: 'Kitchen', amount: 897431 },
  { id: 'PRD-0222', name: 'Brushed Shelf', category: 'Outdoor', amount: 983878 },
  { id: 'PRD-0223', name: 'Slim Bench', category: 'Outdoor', amount: 583532 },
  { id: 'PRD-0224', name: 'Folding Planter', category: 'Lighting', amount: 433627 },
  { id: 'PRD-0225', name: 'Rustic Lamp', category: 'Outdoor', amount: 28802 },
  { id: 'PRD-0226', name: 'Brushed Shelf', category: 'Garden', amount: 487137 },
  { id: 'PRD-0227', name: 'Heavy Stool', category: 'Outdoor', amount: 769085 },
  { id: 'PRD-0228', name: 'Compact Tray', category: 'Outdoor', amount: 731986 },
  { id: 'PRD-0229', name: 'Classic Bench', category: 'Garden', amount: 484165 },
  { id: 'PRD-0230', name: 'Smart Clock', category: 'Garden', amount: 507862 },
  { id: 'PRD-0231', name: 'Slim Bench', category: 'Outdoor', amount: 912463 },
  { id: 'PRD-0232', name: 'Classic Clock', category: 'Kitchen', amount: 816124 },
  { id: 'PRD-0233', name: 'Folding Clock', category: 'Office', amount: 904502 },
  { id: 'PRD-0234', name: 'Modular Kettle', category: 'Lighting', amount: 165140 },
  { id: 'PRD-0235', name: 'Modular Tray', category: 'Garden', amount: 52827 },
  { id: 'PRD-0236', name: 'Classic Kettle', category: 'Office', amount: 745413 },
];

describe('ProductTable columns', () => {
  it('filters, sorts and pages through 20 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0227');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0221');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0230');
  });
});
