import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0252', name: 'Modular Shelf', category: 'Garden', amount: 39711 },
  { id: 'PRD-0253', name: 'Slim Planter', category: 'Outdoor', amount: 489040 },
  { id: 'PRD-0254', name: 'Heavy Stool', category: 'Outdoor', amount: 739786 },
  { id: 'PRD-0255', name: 'Classic Tray', category: 'Outdoor', amount: 956179 },
  { id: 'PRD-0256', name: 'Classic Desk', category: 'Office', amount: 83921 },
  { id: 'PRD-0257', name: 'Compact Tray', category: 'Kitchen', amount: 62402 },
  { id: 'PRD-0258', name: 'Classic Desk', category: 'Outdoor', amount: 905485 },
  { id: 'PRD-0259', name: 'Modular Lantern', category: 'Lighting', amount: 826215 },
  { id: 'PRD-0260', name: 'Compact Lantern', category: 'Office', amount: 815906 },
  { id: 'PRD-0261', name: 'Heavy Lantern', category: 'Garden', amount: 657660 },
  { id: 'PRD-0262', name: 'Classic Clock', category: 'Garden', amount: 530130 },
  { id: 'PRD-0263', name: 'Compact Lamp', category: 'Outdoor', amount: 301659 },
  { id: 'PRD-0264', name: 'Classic Lantern', category: 'Kitchen', amount: 188650 },
  { id: 'PRD-0265', name: 'Compact Stool', category: 'Outdoor', amount: 258731 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0262');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0252');
    cy.get('input[name=filter]').clear().type('PRD-0255');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0252');
    cy.get('input[name=filter]').clear().type('lighting');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0259');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0252');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0262');
    cy.get('input[name=filter]').clear().type('prd-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
