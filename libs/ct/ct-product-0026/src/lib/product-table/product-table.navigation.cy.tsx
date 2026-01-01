import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0335', name: 'Slim Lantern', category: 'Garden', amount: 799880 },
  { id: 'PRD-0336', name: 'Brushed Lamp', category: 'Kitchen', amount: 140488 },
  { id: 'PRD-0337', name: 'Modular Kettle', category: 'Kitchen', amount: 463836 },
  { id: 'PRD-0338', name: 'Modular Shelf', category: 'Kitchen', amount: 72549 },
  { id: 'PRD-0339', name: 'Folding Planter', category: 'Lighting', amount: 133956 },
  { id: 'PRD-0340', name: 'Smart Shelf', category: 'Kitchen', amount: 529209 },
  { id: 'PRD-0341', name: 'Classic Desk', category: 'Office', amount: 930396 },
  { id: 'PRD-0342', name: 'Folding Clock', category: 'Outdoor', amount: 658652 },
  { id: 'PRD-0343', name: 'Brushed Tray', category: 'Lighting', amount: 274345 },
  { id: 'PRD-0344', name: 'Modular Lantern', category: 'Garden', amount: 973387 },
  { id: 'PRD-0345', name: 'Smart Lamp', category: 'Office', amount: 162828 },
  { id: 'PRD-0346', name: 'Modular Stool', category: 'Garden', amount: 295958 },
  { id: 'PRD-0347', name: 'Brushed Stool', category: 'Kitchen', amount: 836803 },
  { id: 'PRD-0348', name: 'Smart Desk', category: 'Office', amount: 756551 },
  { id: 'PRD-0349', name: 'Heavy Lantern', category: 'Outdoor', amount: 585059 },
  { id: 'PRD-0350', name: 'Classic Planter', category: 'Garden', amount: 593961 },
  { id: 'PRD-0351', name: 'Rustic Tray', category: 'Kitchen', amount: 457467 },
  { id: 'PRD-0352', name: 'Vintage Tray', category: 'Outdoor', amount: 887329 },
];

describe('ProductTable navigation', () => {
  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0336');
    cy.get('input[name=filter]').clear().type('office');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0336');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0335');
    cy.get('input[name=filter]').clear().type('Compa');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0345');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0335');
    cy.get('input[name=filter]').clear().type('sto');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0345');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0335');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0345');
  });
});
