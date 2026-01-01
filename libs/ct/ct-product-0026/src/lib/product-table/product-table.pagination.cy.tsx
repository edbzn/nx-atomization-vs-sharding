import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0057', name: 'Smart Stool', category: 'Office', amount: 103864 },
  { id: 'PRD-0058', name: 'Folding Planter', category: 'Outdoor', amount: 57870 },
  { id: 'PRD-0059', name: 'Compact Planter', category: 'Garden', amount: 190058 },
  { id: 'PRD-0060', name: 'Modular Tray', category: 'Garden', amount: 522808 },
  { id: 'PRD-0061', name: 'Rustic Stool', category: 'Outdoor', amount: 25539 },
  { id: 'PRD-0062', name: 'Smart Tray', category: 'Office', amount: 202559 },
  { id: 'PRD-0063', name: 'Heavy Shelf', category: 'Kitchen', amount: 58129 },
  { id: 'PRD-0064', name: 'Brushed Tray', category: 'Kitchen', amount: 613111 },
  { id: 'PRD-0065', name: 'Folding Lantern', category: 'Outdoor', amount: 163629 },
  { id: 'PRD-0066', name: 'Brushed Bench', category: 'Garden', amount: 277442 },
  { id: 'PRD-0067', name: 'Smart Desk', category: 'Kitchen', amount: 362714 },
  { id: 'PRD-0068', name: 'Slim Clock', category: 'Garden', amount: 341355 },
  { id: 'PRD-0069', name: 'Smart Kettle', category: 'Office', amount: 390326 },
  { id: 'PRD-0070', name: 'Folding Desk', category: 'Outdoor', amount: 563759 },
];

describe('ProductTable pagination', () => {
  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0057');
    cy.get('input[name=filter]').clear().type('kitchen');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0057');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0067');
  });
});
