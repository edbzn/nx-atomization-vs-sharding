import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0199', name: 'Folding Kettle', category: 'Garden', amount: 12496 },
  { id: 'PRD-0200', name: 'Folding Stool', category: 'Garden', amount: 880962 },
  { id: 'PRD-0201', name: 'Compact Lantern', category: 'Kitchen', amount: 260602 },
  { id: 'PRD-0202', name: 'Modular Stool', category: 'Lighting', amount: 272565 },
  { id: 'PRD-0203', name: 'Vintage Planter', category: 'Outdoor', amount: 262199 },
  { id: 'PRD-0204', name: 'Brushed Planter', category: 'Garden', amount: 401705 },
  { id: 'PRD-0205', name: 'Modular Kettle', category: 'Office', amount: 299789 },
  { id: 'PRD-0206', name: 'Modular Lamp', category: 'Outdoor', amount: 295441 },
  { id: 'PRD-0207', name: 'Compact Lantern', category: 'Lighting', amount: 218685 },
  { id: 'PRD-0208', name: 'Modular Bench', category: 'Office', amount: 155034 },
  { id: 'PRD-0209', name: 'Smart Desk', category: 'Kitchen', amount: 709239 },
  { id: 'PRD-0210', name: 'Classic Lamp', category: 'Office', amount: 776630 },
  { id: 'PRD-0211', name: 'Rustic Stool', category: 'Office', amount: 787713 },
  { id: 'PRD-0212', name: 'Classic Shelf', category: 'Kitchen', amount: 237330 },
  { id: 'PRD-0213', name: 'Folding Lamp', category: 'Lighting', amount: 261088 },
  { id: 'PRD-0214', name: 'Folding Stool', category: 'Garden', amount: 791747 },
  { id: 'PRD-0215', name: 'Rustic Stool', category: 'Garden', amount: 624001 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0199');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0204');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0199');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0199');
    cy.get('input[name=filter]').clear().type('Com');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0199');
  });

  it('filters, sorts and pages through 15 products', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0199');
  });

  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0199');
  });
});
