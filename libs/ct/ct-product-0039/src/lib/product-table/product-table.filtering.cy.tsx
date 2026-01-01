import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0236', name: 'Compact Desk', category: 'Outdoor', amount: 810371 },
  { id: 'PRD-0237', name: 'Brushed Kettle', category: 'Office', amount: 15200 },
  { id: 'PRD-0238', name: 'Classic Tray', category: 'Garden', amount: 130724 },
  { id: 'PRD-0239', name: 'Compact Stool', category: 'Office', amount: 898375 },
  { id: 'PRD-0240', name: 'Slim Kettle', category: 'Kitchen', amount: 908191 },
  { id: 'PRD-0241', name: 'Modular Lantern', category: 'Kitchen', amount: 656294 },
  { id: 'PRD-0242', name: 'Slim Lamp', category: 'Lighting', amount: 545847 },
  { id: 'PRD-0243', name: 'Slim Lantern', category: 'Office', amount: 728604 },
  { id: 'PRD-0244', name: 'Modular Tray', category: 'Office', amount: 48331 },
  { id: 'PRD-0245', name: 'Heavy Clock', category: 'Outdoor', amount: 635718 },
  { id: 'PRD-0246', name: 'Folding Lamp', category: 'Lighting', amount: 418915 },
  { id: 'PRD-0247', name: 'Compact Lantern', category: 'Garden', amount: 185729 },
  { id: 'PRD-0248', name: 'Slim Kettle', category: 'Kitchen', amount: 544252 },
  { id: 'PRD-0249', name: 'Compact Kettle', category: 'Office', amount: 764901 },
  { id: 'PRD-0250', name: 'Rustic Clock', category: 'Kitchen', amount: 470892 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 15 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Clas');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0236');
    cy.get('input[name=filter]').clear().type('garden');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0238');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0237');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0243');
  });

  it('filters, sorts and pages through 15 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0236');
  });
});
