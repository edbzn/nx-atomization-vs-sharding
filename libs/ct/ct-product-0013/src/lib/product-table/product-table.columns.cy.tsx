import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0331', name: 'Slim Desk', category: 'Kitchen', amount: 357012 },
  { id: 'PRD-0332', name: 'Modular Lantern', category: 'Kitchen', amount: 978778 },
  { id: 'PRD-0333', name: 'Vintage Stool', category: 'Kitchen', amount: 423752 },
  { id: 'PRD-0334', name: 'Smart Desk', category: 'Kitchen', amount: 900564 },
  { id: 'PRD-0335', name: 'Slim Tray', category: 'Kitchen', amount: 65065 },
  { id: 'PRD-0336', name: 'Compact Lamp', category: 'Lighting', amount: 488068 },
  { id: 'PRD-0337', name: 'Classic Planter', category: 'Lighting', amount: 305552 },
  { id: 'PRD-0338', name: 'Classic Lantern', category: 'Kitchen', amount: 744739 },
  { id: 'PRD-0339', name: 'Compact Planter', category: 'Kitchen', amount: 270395 },
  { id: 'PRD-0340', name: 'Smart Kettle', category: 'Kitchen', amount: 361253 },
  { id: 'PRD-0341', name: 'Modular Tray', category: 'Kitchen', amount: 719828 },
  { id: 'PRD-0342', name: 'Brushed Shelf', category: 'Outdoor', amount: 48838 },
];

describe('ProductTable columns', () => {
  it('filters, sorts and pages through 12 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 12 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('lighting');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0337');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0342');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0340');
  });
});
