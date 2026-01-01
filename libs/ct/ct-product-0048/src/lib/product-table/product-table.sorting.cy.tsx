import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0096', name: 'Rustic Tray', category: 'Garden', amount: 921844 },
  { id: 'PRD-0097', name: 'Modular Kettle', category: 'Garden', amount: 505935 },
  { id: 'PRD-0098', name: 'Slim Desk', category: 'Outdoor', amount: 98060 },
  { id: 'PRD-0099', name: 'Smart Clock', category: 'Lighting', amount: 998110 },
  { id: 'PRD-0100', name: 'Heavy Bench', category: 'Lighting', amount: 538564 },
  { id: 'PRD-0101', name: 'Vintage Tray', category: 'Garden', amount: 883004 },
  { id: 'PRD-0102', name: 'Rustic Stool', category: 'Office', amount: 101735 },
  { id: 'PRD-0103', name: 'Classic Desk', category: 'Kitchen', amount: 653294 },
  { id: 'PRD-0104', name: 'Smart Kettle', category: 'Lighting', amount: 727554 },
  { id: 'PRD-0105', name: 'Folding Bench', category: 'Lighting', amount: 890309 },
  { id: 'PRD-0106', name: 'Modular Bench', category: 'Kitchen', amount: 426545 },
  { id: 'PRD-0107', name: 'Slim Clock', category: 'Garden', amount: 878312 },
  { id: 'PRD-0108', name: 'Vintage Lantern', category: 'Kitchen', amount: 197210 },
  { id: 'PRD-0109', name: 'Modular Shelf', category: 'Garden', amount: 582086 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Mod');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0096');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0096');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0103');
  });

  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('office');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
