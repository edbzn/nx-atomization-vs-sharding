import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0289', name: 'Folding Lantern', category: 'Garden', amount: 186437 },
  { id: 'PRD-0290', name: 'Compact Kettle', category: 'Garden', amount: 451615 },
  { id: 'PRD-0291', name: 'Heavy Clock', category: 'Outdoor', amount: 641939 },
  { id: 'PRD-0292', name: 'Classic Kettle', category: 'Outdoor', amount: 666676 },
  { id: 'PRD-0293', name: 'Rustic Clock', category: 'Lighting', amount: 349650 },
  { id: 'PRD-0294', name: 'Brushed Shelf', category: 'Office', amount: 127029 },
  { id: 'PRD-0295', name: 'Heavy Kettle', category: 'Lighting', amount: 905771 },
  { id: 'PRD-0296', name: 'Compact Lantern', category: 'Garden', amount: 118672 },
  { id: 'PRD-0297', name: 'Modular Bench', category: 'Office', amount: 617784 },
  { id: 'PRD-0298', name: 'Vintage Desk', category: 'Kitchen', amount: 106540 },
  { id: 'PRD-0299', name: 'Slim Clock', category: 'Outdoor', amount: 766887 },
  { id: 'PRD-0300', name: 'Vintage Kettle', category: 'Outdoor', amount: 451350 },
  { id: 'PRD-0301', name: 'Smart Lamp', category: 'Kitchen', amount: 623016 },
  { id: 'PRD-0302', name: 'Brushed Planter', category: 'Lighting', amount: 775203 },
  { id: 'PRD-0303', name: 'Compact Stool', category: 'Kitchen', amount: 157364 },
  { id: 'PRD-0304', name: 'Classic Desk', category: 'Outdoor', amount: 880768 },
  { id: 'PRD-0305', name: 'Modular Lantern', category: 'Office', amount: 833518 },
  { id: 'PRD-0306', name: 'Vintage Planter', category: 'Garden', amount: 334093 },
  { id: 'PRD-0307', name: 'Compact Lantern', category: 'Garden', amount: 62724 },
  { id: 'PRD-0308', name: 'Slim Bench', category: 'Kitchen', amount: 677611 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0299');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0289');
  });

  it('filters, sorts and pages through 19 products', () => {
    const rows = ROWS.slice(0, 19);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0302');
  });
});
