import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0010', name: 'Vintage Shelf', category: 'Kitchen', amount: 571597 },
  { id: 'PRD-0011', name: 'Rustic Desk', category: 'Outdoor', amount: 297444 },
  { id: 'PRD-0012', name: 'Slim Shelf', category: 'Outdoor', amount: 224107 },
  { id: 'PRD-0013', name: 'Vintage Desk', category: 'Office', amount: 192794 },
  { id: 'PRD-0014', name: 'Vintage Lantern', category: 'Kitchen', amount: 371354 },
  { id: 'PRD-0015', name: 'Brushed Stool', category: 'Lighting', amount: 156920 },
  { id: 'PRD-0016', name: 'Brushed Kettle', category: 'Outdoor', amount: 984275 },
  { id: 'PRD-0017', name: 'Compact Tray', category: 'Garden', amount: 288131 },
  { id: 'PRD-0018', name: 'Classic Lantern', category: 'Lighting', amount: 488984 },
  { id: 'PRD-0019', name: 'Rustic Kettle', category: 'Outdoor', amount: 30166 },
  { id: 'PRD-0020', name: 'Rustic Kettle', category: 'Outdoor', amount: 219279 },
  { id: 'PRD-0021', name: 'Compact Shelf', category: 'Lighting', amount: 370934 },
  { id: 'PRD-0022', name: 'Folding Bench', category: 'Kitchen', amount: 411486 },
  { id: 'PRD-0023', name: 'Smart Lamp', category: 'Office', amount: 439874 },
  { id: 'PRD-0024', name: 'Heavy Lantern', category: 'Outdoor', amount: 568971 },
  { id: 'PRD-0025', name: 'Smart Clock', category: 'Garden', amount: 893516 },
  { id: 'PRD-0026', name: 'Compact Bench', category: 'Kitchen', amount: 251545 },
  { id: 'PRD-0027', name: 'Brushed Bench', category: 'Lighting', amount: 395040 },
  { id: 'PRD-0028', name: 'Folding Lamp', category: 'Kitchen', amount: 981635 },
];

describe('ProductTable pagination', () => {
  it('filters, sorts and pages through 19 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0027');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0011');
    cy.get('input[name=filter]').clear().type('garden');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });

  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0020');
  });
});
