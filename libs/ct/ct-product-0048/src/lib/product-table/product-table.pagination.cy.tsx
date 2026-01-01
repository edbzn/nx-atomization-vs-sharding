import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0108', name: 'Heavy Lamp', category: 'Office', amount: 208386 },
  { id: 'PRD-0109', name: 'Compact Clock', category: 'Outdoor', amount: 332475 },
  { id: 'PRD-0110', name: 'Classic Planter', category: 'Lighting', amount: 642505 },
  { id: 'PRD-0111', name: 'Heavy Stool', category: 'Outdoor', amount: 616656 },
  { id: 'PRD-0112', name: 'Rustic Lamp', category: 'Kitchen', amount: 491636 },
  { id: 'PRD-0113', name: 'Compact Shelf', category: 'Garden', amount: 300762 },
  { id: 'PRD-0114', name: 'Heavy Shelf', category: 'Office', amount: 80946 },
  { id: 'PRD-0115', name: 'Compact Planter', category: 'Lighting', amount: 218200 },
  { id: 'PRD-0116', name: 'Compact Lantern', category: 'Garden', amount: 988000 },
  { id: 'PRD-0117', name: 'Compact Kettle', category: 'Garden', amount: 18188 },
  { id: 'PRD-0118', name: 'Heavy Clock', category: 'Outdoor', amount: 235454 },
  { id: 'PRD-0119', name: 'Slim Shelf', category: 'Outdoor', amount: 785890 },
  { id: 'PRD-0120', name: 'Folding Kettle', category: 'Kitchen', amount: 452717 },
  { id: 'PRD-0121', name: 'Modular Lamp', category: 'Kitchen', amount: 37309 },
];

describe('ProductTable pagination', () => {
  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0108');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0108');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0108');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0121');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0108');
    cy.get('input[name=filter]').clear().type('outdoor');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0108');
    cy.get('input[name=filter]').clear().type('Cla');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('garden');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });
});
