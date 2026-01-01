import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0329', name: 'Brushed Stool', category: 'Outdoor', amount: 462367 },
  { id: 'PRD-0330', name: 'Smart Kettle', category: 'Office', amount: 860708 },
  { id: 'PRD-0331', name: 'Compact Bench', category: 'Kitchen', amount: 822905 },
  { id: 'PRD-0332', name: 'Heavy Stool', category: 'Lighting', amount: 271261 },
  { id: 'PRD-0333', name: 'Heavy Kettle', category: 'Garden', amount: 119017 },
  { id: 'PRD-0334', name: 'Heavy Shelf', category: 'Office', amount: 334449 },
  { id: 'PRD-0335', name: 'Folding Bench', category: 'Kitchen', amount: 344398 },
  { id: 'PRD-0336', name: 'Brushed Desk', category: 'Outdoor', amount: 845093 },
  { id: 'PRD-0337', name: 'Smart Tray', category: 'Outdoor', amount: 386137 },
  { id: 'PRD-0338', name: 'Vintage Shelf', category: 'Office', amount: 312823 },
  { id: 'PRD-0339', name: 'Vintage Tray', category: 'Lighting', amount: 936182 },
  { id: 'PRD-0340', name: 'Smart Shelf', category: 'Outdoor', amount: 465247 },
  { id: 'PRD-0341', name: 'Smart Shelf', category: 'Outdoor', amount: 272460 },
  { id: 'PRD-0342', name: 'Heavy Planter', category: 'Garden', amount: 892025 },
];

describe('ProductTable large dataset', () => {
  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('plante');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0329');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0339');
    cy.get('input[name=filter]').clear().type('Clas');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0329');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0329');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0339');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0333');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0336');
  });
});
