import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0305', name: 'Classic Lantern', category: 'Kitchen', amount: 990929 },
  { id: 'PRD-0306', name: 'Folding Tray', category: 'Garden', amount: 493292 },
  { id: 'PRD-0307', name: 'Modular Lamp', category: 'Office', amount: 758418 },
  { id: 'PRD-0308', name: 'Smart Stool', category: 'Outdoor', amount: 645307 },
  { id: 'PRD-0309', name: 'Rustic Clock', category: 'Outdoor', amount: 53380 },
  { id: 'PRD-0310', name: 'Classic Lamp', category: 'Outdoor', amount: 52523 },
  { id: 'PRD-0311', name: 'Smart Lamp', category: 'Office', amount: 870662 },
  { id: 'PRD-0312', name: 'Compact Stool', category: 'Lighting', amount: 353569 },
  { id: 'PRD-0313', name: 'Compact Bench', category: 'Lighting', amount: 334372 },
  { id: 'PRD-0314', name: 'Rustic Shelf', category: 'Outdoor', amount: 773230 },
  { id: 'PRD-0315', name: 'Classic Clock', category: 'Garden', amount: 884536 },
  { id: 'PRD-0316', name: 'Compact Planter', category: 'Lighting', amount: 276692 },
  { id: 'PRD-0317', name: 'Brushed Lamp', category: 'Outdoor', amount: 165431 },
  { id: 'PRD-0318', name: 'Compact Lantern', category: 'Office', amount: 56652 },
  { id: 'PRD-0319', name: 'Smart Shelf', category: 'Lighting', amount: 215229 },
  { id: 'PRD-0320', name: 'Brushed Lantern', category: 'Lighting', amount: 28498 },
  { id: 'PRD-0321', name: 'Compact Kettle', category: 'Lighting', amount: 166665 },
  { id: 'PRD-0322', name: 'Smart Shelf', category: 'Kitchen', amount: 450822 },
  { id: 'PRD-0323', name: 'Folding Stool', category: 'Outdoor', amount: 220807 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 19 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0317');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0317');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0323');
  });

  it('filters, sorts and pages through 19 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0315');
    cy.get('input[name=filter]').clear().type('desk');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('desk');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0305');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0315');
  });

  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS.slice(0, 18);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0315');
  });
});
