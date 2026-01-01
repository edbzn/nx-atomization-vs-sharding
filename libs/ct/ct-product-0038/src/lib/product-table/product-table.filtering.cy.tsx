import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0232', name: 'Slim Shelf', category: 'Garden', amount: 142118 },
  { id: 'PRD-0233', name: 'Modular Bench', category: 'Kitchen', amount: 404442 },
  { id: 'PRD-0234', name: 'Rustic Clock', category: 'Kitchen', amount: 441451 },
  { id: 'PRD-0235', name: 'Rustic Planter', category: 'Kitchen', amount: 606550 },
  { id: 'PRD-0236', name: 'Modular Lamp', category: 'Outdoor', amount: 169695 },
  { id: 'PRD-0237', name: 'Heavy Kettle', category: 'Outdoor', amount: 939422 },
  { id: 'PRD-0238', name: 'Slim Shelf', category: 'Garden', amount: 754319 },
  { id: 'PRD-0239', name: 'Smart Bench', category: 'Lighting', amount: 507637 },
  { id: 'PRD-0240', name: 'Compact Stool', category: 'Kitchen', amount: 948254 },
  { id: 'PRD-0241', name: 'Modular Stool', category: 'Lighting', amount: 614777 },
  { id: 'PRD-0242', name: 'Brushed Clock', category: 'Lighting', amount: 35387 },
  { id: 'PRD-0243', name: 'Heavy Lantern', category: 'Lighting', amount: 681726 },
  { id: 'PRD-0244', name: 'Heavy Lantern', category: 'Kitchen', amount: 916477 },
  { id: 'PRD-0245', name: 'Rustic Lamp', category: 'Kitchen', amount: 363542 },
  { id: 'PRD-0246', name: 'Heavy Bench', category: 'Lighting', amount: 31351 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 15 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0232');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0242');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0232');
  });

  it('filters, sorts and pages through 15 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0246');
  });
});
