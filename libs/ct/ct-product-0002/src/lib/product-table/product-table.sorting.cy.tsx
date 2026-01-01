import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0378', name: 'Modular Kettle', category: 'Kitchen', amount: 71926 },
  { id: 'PRD-0379', name: 'Rustic Shelf', category: 'Lighting', amount: 197064 },
  { id: 'PRD-0380', name: 'Heavy Stool', category: 'Lighting', amount: 679192 },
  { id: 'PRD-0381', name: 'Compact Stool', category: 'Office', amount: 48015 },
  { id: 'PRD-0382', name: 'Compact Kettle', category: 'Garden', amount: 767906 },
  { id: 'PRD-0383', name: 'Vintage Bench', category: 'Kitchen', amount: 800645 },
  { id: 'PRD-0384', name: 'Smart Tray', category: 'Office', amount: 986882 },
  { id: 'PRD-0385', name: 'Heavy Clock', category: 'Garden', amount: 325005 },
  { id: 'PRD-0386', name: 'Rustic Bench', category: 'Office', amount: 993008 },
  { id: 'PRD-0387', name: 'Slim Clock', category: 'Lighting', amount: 865005 },
  { id: 'PRD-0388', name: 'Slim Shelf', category: 'Lighting', amount: 918365 },
  { id: 'PRD-0389', name: 'Rustic Lamp', category: 'Office', amount: 639590 },
  { id: 'PRD-0390', name: 'Vintage Kettle', category: 'Lighting', amount: 143440 },
  { id: 'PRD-0391', name: 'Vintage Tray', category: 'Kitchen', amount: 113546 },
  { id: 'PRD-0392', name: 'Modular Clock', category: 'Kitchen', amount: 485837 },
  { id: 'PRD-0393', name: 'Vintage Shelf', category: 'Office', amount: 521695 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0388');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0382');
    cy.get('input[name=filter]').clear().type('Fol');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0382');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0388');
  });
});
