import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0223', name: 'Vintage Lantern', category: 'Kitchen', amount: 138451 },
  { id: 'PRD-0224', name: 'Modular Tray', category: 'Kitchen', amount: 74756 },
  { id: 'PRD-0225', name: 'Vintage Shelf', category: 'Kitchen', amount: 497845 },
  { id: 'PRD-0226', name: 'Modular Planter', category: 'Garden', amount: 226712 },
  { id: 'PRD-0227', name: 'Vintage Lamp', category: 'Outdoor', amount: 567133 },
  { id: 'PRD-0228', name: 'Folding Shelf', category: 'Garden', amount: 1125 },
  { id: 'PRD-0229', name: 'Classic Shelf', category: 'Outdoor', amount: 479609 },
  { id: 'PRD-0230', name: 'Modular Lamp', category: 'Office', amount: 735710 },
  { id: 'PRD-0231', name: 'Classic Shelf', category: 'Garden', amount: 131241 },
  { id: 'PRD-0232', name: 'Heavy Bench', category: 'Office', amount: 202272 },
  { id: 'PRD-0233', name: 'Folding Planter', category: 'Lighting', amount: 146057 },
  { id: 'PRD-0234', name: 'Rustic Tray', category: 'Garden', amount: 177951 },
  { id: 'PRD-0235', name: 'Folding Kettle', category: 'Outdoor', amount: 576430 },
  { id: 'PRD-0236', name: 'Classic Planter', category: 'Office', amount: 443563 },
  { id: 'PRD-0237', name: 'Rustic Desk', category: 'Outdoor', amount: 19556 },
  { id: 'PRD-0238', name: 'Slim Lantern', category: 'Lighting', amount: 461028 },
];

describe('ProductTable pagination 2', () => {
  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0236');
    cy.get('input[name=filter]').clear().type('stool');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('office');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0236');
    cy.get('input[name=filter]').clear().type('Rust');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0236');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0237');
  });
});
