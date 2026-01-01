import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0014', name: 'Rustic Lantern', category: 'Garden', amount: 885348 },
  { id: 'PRD-0015', name: 'Brushed Kettle', category: 'Garden', amount: 626681 },
  { id: 'PRD-0016', name: 'Vintage Desk', category: 'Kitchen', amount: 143160 },
  { id: 'PRD-0017', name: 'Smart Tray', category: 'Garden', amount: 162928 },
  { id: 'PRD-0018', name: 'Compact Kettle', category: 'Outdoor', amount: 724707 },
  { id: 'PRD-0019', name: 'Brushed Stool', category: 'Office', amount: 819156 },
  { id: 'PRD-0020', name: 'Modular Bench', category: 'Garden', amount: 776243 },
  { id: 'PRD-0021', name: 'Slim Planter', category: 'Garden', amount: 879754 },
  { id: 'PRD-0022', name: 'Slim Desk', category: 'Outdoor', amount: 678199 },
  { id: 'PRD-0023', name: 'Folding Lantern', category: 'Kitchen', amount: 141264 },
  { id: 'PRD-0024', name: 'Vintage Desk', category: 'Kitchen', amount: 436568 },
  { id: 'PRD-0025', name: 'Smart Planter', category: 'Outdoor', amount: 155469 },
  { id: 'PRD-0026', name: 'Heavy Lamp', category: 'Kitchen', amount: 743285 },
  { id: 'PRD-0027', name: 'Slim Desk', category: 'Lighting', amount: 900996 },
  { id: 'PRD-0028', name: 'Vintage Lamp', category: 'Outdoor', amount: 240095 },
  { id: 'PRD-0029', name: 'Compact Tray', category: 'Garden', amount: 230773 },
  { id: 'PRD-0030', name: 'Heavy Stool', category: 'Office', amount: 348657 },
  { id: 'PRD-0031', name: 'Classic Clock', category: 'Kitchen', amount: 769154 },
  { id: 'PRD-0032', name: 'Brushed Planter', category: 'Outdoor', amount: 283414 },
  { id: 'PRD-0033', name: 'Modular Tray', category: 'Kitchen', amount: 359120 },
];

describe('ProductTable sorting 2', () => {
  it('filters, sorts and pages through 20 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0024');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0014');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0015');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0014');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0023');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0015');
    cy.get('input[name=filter]').clear().type('Comp');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('PRD-0015');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0023');
  });
});
