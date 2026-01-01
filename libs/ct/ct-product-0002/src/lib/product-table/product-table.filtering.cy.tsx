import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0240', name: 'Vintage Lamp', category: 'Kitchen', amount: 637707 },
  { id: 'PRD-0241', name: 'Brushed Bench', category: 'Office', amount: 796224 },
  { id: 'PRD-0242', name: 'Modular Desk', category: 'Outdoor', amount: 298984 },
  { id: 'PRD-0243', name: 'Compact Clock', category: 'Kitchen', amount: 690649 },
  { id: 'PRD-0244', name: 'Slim Desk', category: 'Kitchen', amount: 198585 },
  { id: 'PRD-0245', name: 'Heavy Lantern', category: 'Garden', amount: 118255 },
  { id: 'PRD-0246', name: 'Vintage Bench', category: 'Office', amount: 788457 },
  { id: 'PRD-0247', name: 'Compact Tray', category: 'Office', amount: 555392 },
  { id: 'PRD-0248', name: 'Smart Clock', category: 'Outdoor', amount: 844953 },
  { id: 'PRD-0249', name: 'Vintage Planter', category: 'Outdoor', amount: 460339 },
  { id: 'PRD-0250', name: 'Classic Lamp', category: 'Lighting', amount: 277450 },
  { id: 'PRD-0251', name: 'Classic Lantern', category: 'Kitchen', amount: 892916 },
  { id: 'PRD-0252', name: 'Modular Lamp', category: 'Lighting', amount: 248127 },
  { id: 'PRD-0253', name: 'Slim Lamp', category: 'Outdoor', amount: 351955 },
  { id: 'PRD-0254', name: 'Slim Lantern', category: 'Lighting', amount: 3959 },
  { id: 'PRD-0255', name: 'Rustic Planter', category: 'Lighting', amount: 865834 },
  { id: 'PRD-0256', name: 'Smart Lantern', category: 'Lighting', amount: 614256 },
  { id: 'PRD-0257', name: 'Rustic Lamp', category: 'Lighting', amount: 272680 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0250');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0240');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0240');
  });

  it('filters, sorts and pages through 15 products', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('clo');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });
});
