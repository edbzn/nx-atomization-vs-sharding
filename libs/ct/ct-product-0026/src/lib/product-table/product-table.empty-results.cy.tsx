import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0001', name: 'Classic Shelf', category: 'Lighting', amount: 158800 },
  { id: 'PRD-0002', name: 'Rustic Desk', category: 'Outdoor', amount: 520460 },
  { id: 'PRD-0003', name: 'Compact Kettle', category: 'Garden', amount: 280886 },
  { id: 'PRD-0004', name: 'Compact Clock', category: 'Garden', amount: 920243 },
  { id: 'PRD-0005', name: 'Heavy Lantern', category: 'Lighting', amount: 765135 },
  { id: 'PRD-0006', name: 'Compact Tray', category: 'Outdoor', amount: 346967 },
  { id: 'PRD-0007', name: 'Slim Lamp', category: 'Kitchen', amount: 629057 },
  { id: 'PRD-0008', name: 'Modular Tray', category: 'Outdoor', amount: 414779 },
  { id: 'PRD-0009', name: 'Heavy Lantern', category: 'Kitchen', amount: 656259 },
  { id: 'PRD-0010', name: 'Compact Stool', category: 'Office', amount: 835172 },
  { id: 'PRD-0011', name: 'Rustic Tray', category: 'Lighting', amount: 832612 },
  { id: 'PRD-0012', name: 'Smart Clock', category: 'Office', amount: 970637 },
  { id: 'PRD-0013', name: 'Brushed Bench', category: 'Kitchen', amount: 969160 },
];

describe('ProductTable empty results', () => {
  it('filters, sorts and pages through 13 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Brush');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('PRD-0007');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0007');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0007');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0001');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0013');
  });
});
