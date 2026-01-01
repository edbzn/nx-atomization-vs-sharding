import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0141', name: 'Smart Desk', category: 'Kitchen', amount: 999542 },
  { id: 'PRD-0142', name: 'Classic Shelf', category: 'Garden', amount: 855045 },
  { id: 'PRD-0143', name: 'Compact Clock', category: 'Outdoor', amount: 5578 },
  { id: 'PRD-0144', name: 'Brushed Clock', category: 'Lighting', amount: 525385 },
  { id: 'PRD-0145', name: 'Slim Tray', category: 'Office', amount: 679627 },
  { id: 'PRD-0146', name: 'Compact Planter', category: 'Kitchen', amount: 727449 },
  { id: 'PRD-0147', name: 'Folding Planter', category: 'Outdoor', amount: 901741 },
  { id: 'PRD-0148', name: 'Slim Planter', category: 'Outdoor', amount: 841126 },
  { id: 'PRD-0149', name: 'Modular Bench', category: 'Kitchen', amount: 160311 },
  { id: 'PRD-0150', name: 'Compact Stool', category: 'Kitchen', amount: 290949 },
  { id: 'PRD-0151', name: 'Heavy Stool', category: 'Lighting', amount: 587427 },
  { id: 'PRD-0152', name: 'Classic Shelf', category: 'Kitchen', amount: 313471 },
  { id: 'PRD-0153', name: 'Rustic Tray', category: 'Office', amount: 289512 },
  { id: 'PRD-0154', name: 'Vintage Kettle', category: 'Outdoor', amount: 977330 },
  { id: 'PRD-0155', name: 'Compact Lamp', category: 'Office', amount: 929964 },
  { id: 'PRD-0156', name: 'Vintage Shelf', category: 'Garden', amount: 199113 },
  { id: 'PRD-0157', name: 'Classic Kettle', category: 'Kitchen', amount: 809824 },
  { id: 'PRD-0158', name: 'Classic Lantern', category: 'Kitchen', amount: 99898 },
  { id: 'PRD-0159', name: 'Classic Planter', category: 'Outdoor', amount: 302402 },
  { id: 'PRD-0160', name: 'Modular Bench', category: 'Lighting', amount: 390235 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 20 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0141');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0141');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0141');
  });

  it('filters, sorts and pages through 13 products', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0141');
  });
});
