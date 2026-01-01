import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0105', name: 'Rustic Planter', category: 'Outdoor', amount: 441966 },
  { id: 'PRD-0106', name: 'Slim Kettle', category: 'Outdoor', amount: 252603 },
  { id: 'PRD-0107', name: 'Rustic Desk', category: 'Kitchen', amount: 896172 },
  { id: 'PRD-0108', name: 'Folding Stool', category: 'Office', amount: 351947 },
  { id: 'PRD-0109', name: 'Brushed Clock', category: 'Outdoor', amount: 378734 },
  { id: 'PRD-0110', name: 'Smart Shelf', category: 'Outdoor', amount: 210326 },
  { id: 'PRD-0111', name: 'Brushed Desk', category: 'Kitchen', amount: 75237 },
  { id: 'PRD-0112', name: 'Compact Clock', category: 'Kitchen', amount: 588725 },
  { id: 'PRD-0113', name: 'Classic Kettle', category: 'Kitchen', amount: 392837 },
  { id: 'PRD-0114', name: 'Brushed Desk', category: 'Lighting', amount: 152237 },
  { id: 'PRD-0115', name: 'Vintage Kettle', category: 'Lighting', amount: 544378 },
  { id: 'PRD-0116', name: 'Heavy Bench', category: 'Outdoor', amount: 265634 },
  { id: 'PRD-0117', name: 'Heavy Tray', category: 'Kitchen', amount: 926185 },
  { id: 'PRD-0118', name: 'Modular Lamp', category: 'Kitchen', amount: 778268 },
  { id: 'PRD-0119', name: 'Modular Shelf', category: 'Garden', amount: 427442 },
  { id: 'PRD-0120', name: 'Brushed Desk', category: 'Garden', amount: 859894 },
  { id: 'PRD-0121', name: 'Modular Stool', category: 'Office', amount: 795495 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0115');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0105');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0111');
    cy.get('input[name=filter]').clear().type('Mod');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0111');
  });

  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0115');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0111');
    cy.get('input[name=filter]').clear().type('kitchen');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-6 of 6');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0111');
  });

  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Modul');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
