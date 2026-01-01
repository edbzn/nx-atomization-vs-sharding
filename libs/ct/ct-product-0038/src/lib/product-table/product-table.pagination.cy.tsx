import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0168', name: 'Modular Planter', category: 'Outdoor', amount: 486252 },
  { id: 'PRD-0169', name: 'Modular Bench', category: 'Lighting', amount: 906504 },
  { id: 'PRD-0170', name: 'Slim Lantern', category: 'Lighting', amount: 212921 },
  { id: 'PRD-0171', name: 'Compact Lamp', category: 'Lighting', amount: 214035 },
  { id: 'PRD-0172', name: 'Smart Shelf', category: 'Outdoor', amount: 540727 },
  { id: 'PRD-0173', name: 'Rustic Lamp', category: 'Garden', amount: 75329 },
  { id: 'PRD-0174', name: 'Modular Shelf', category: 'Garden', amount: 990397 },
  { id: 'PRD-0175', name: 'Slim Desk', category: 'Garden', amount: 422787 },
  { id: 'PRD-0176', name: 'Heavy Stool', category: 'Outdoor', amount: 131558 },
  { id: 'PRD-0177', name: 'Folding Kettle', category: 'Lighting', amount: 658118 },
  { id: 'PRD-0178', name: 'Modular Shelf', category: 'Kitchen', amount: 520281 },
  { id: 'PRD-0179', name: 'Folding Desk', category: 'Outdoor', amount: 616721 },
  { id: 'PRD-0180', name: 'Folding Tray', category: 'Office', amount: 62725 },
  { id: 'PRD-0181', name: 'Smart Clock', category: 'Office', amount: 971028 },
  { id: 'PRD-0182', name: 'Classic Planter', category: 'Lighting', amount: 818613 },
  { id: 'PRD-0183', name: 'Vintage Shelf', category: 'Lighting', amount: 909393 },
  { id: 'PRD-0184', name: 'Heavy Lamp', category: 'Kitchen', amount: 233569 },
  { id: 'PRD-0185', name: 'Vintage Kettle', category: 'Office', amount: 671180 },
  { id: 'PRD-0186', name: 'Modular Lamp', category: 'Garden', amount: 16521 },
  { id: 'PRD-0187', name: 'Heavy Lantern', category: 'Kitchen', amount: 476847 },
];

describe('ProductTable pagination', () => {
  it('filters, sorts and pages through 20 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0168');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0168');
    cy.get('input[name=filter]').clear().type('plante');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0168');
  });

  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Rusti');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
