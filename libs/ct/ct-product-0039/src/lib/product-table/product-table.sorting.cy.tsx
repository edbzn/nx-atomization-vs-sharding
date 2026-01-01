import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0327', name: 'Brushed Tray', category: 'Lighting', amount: 171583 },
  { id: 'PRD-0328', name: 'Vintage Tray', category: 'Garden', amount: 62334 },
  { id: 'PRD-0329', name: 'Modular Desk', category: 'Outdoor', amount: 819356 },
  { id: 'PRD-0330', name: 'Heavy Desk', category: 'Lighting', amount: 999414 },
  { id: 'PRD-0331', name: 'Compact Kettle', category: 'Lighting', amount: 261659 },
  { id: 'PRD-0332', name: 'Classic Stool', category: 'Office', amount: 31351 },
  { id: 'PRD-0333', name: 'Vintage Planter', category: 'Kitchen', amount: 634778 },
  { id: 'PRD-0334', name: 'Compact Lamp', category: 'Kitchen', amount: 697827 },
  { id: 'PRD-0335', name: 'Slim Shelf', category: 'Kitchen', amount: 779908 },
  { id: 'PRD-0336', name: 'Slim Bench', category: 'Office', amount: 863149 },
  { id: 'PRD-0337', name: 'Modular Clock', category: 'Garden', amount: 946651 },
  { id: 'PRD-0338', name: 'Classic Shelf', category: 'Kitchen', amount: 958570 },
  { id: 'PRD-0339', name: 'Vintage Shelf', category: 'Garden', amount: 365708 },
  { id: 'PRD-0340', name: 'Vintage Tray', category: 'Lighting', amount: 275574 },
  { id: 'PRD-0341', name: 'Modular Lantern', category: 'Office', amount: 215090 },
  { id: 'PRD-0342', name: 'Rustic Planter', category: 'Office', amount: 29261 },
  { id: 'PRD-0343', name: 'Vintage Bench', category: 'Kitchen', amount: 948522 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('office');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0342');
  });

  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0327');
  });
});
