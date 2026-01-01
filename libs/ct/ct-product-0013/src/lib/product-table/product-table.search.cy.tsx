import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0333', name: 'Rustic Bench', category: 'Lighting', amount: 577368 },
  { id: 'PRD-0334', name: 'Compact Shelf', category: 'Outdoor', amount: 675570 },
  { id: 'PRD-0335', name: 'Vintage Bench', category: 'Lighting', amount: 967941 },
  { id: 'PRD-0336', name: 'Slim Lantern', category: 'Garden', amount: 424215 },
  { id: 'PRD-0337', name: 'Modular Kettle', category: 'Outdoor', amount: 519181 },
  { id: 'PRD-0338', name: 'Vintage Stool', category: 'Lighting', amount: 598508 },
  { id: 'PRD-0339', name: 'Brushed Shelf', category: 'Lighting', amount: 106256 },
  { id: 'PRD-0340', name: 'Classic Planter', category: 'Office', amount: 562 },
  { id: 'PRD-0341', name: 'Compact Desk', category: 'Outdoor', amount: 261877 },
  { id: 'PRD-0342', name: 'Vintage Lamp', category: 'Lighting', amount: 719606 },
  { id: 'PRD-0343', name: 'Smart Lantern', category: 'Outdoor', amount: 142950 },
  { id: 'PRD-0344', name: 'Smart Clock', category: 'Lighting', amount: 154431 },
  { id: 'PRD-0345', name: 'Rustic Planter', category: 'Outdoor', amount: 985643 },
];

describe('ProductTable search', () => {
  it('filters, sorts and pages through 13 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('PRD-0343');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0333');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0343');
  });

  it('filters, sorts and pages through 13 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0343');
    cy.get('input[name=filter]').clear().type('prd-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('garden');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('PRD-0341');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0341');
  });
});
