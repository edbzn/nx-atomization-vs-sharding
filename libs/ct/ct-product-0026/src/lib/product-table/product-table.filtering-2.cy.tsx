import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0352', name: 'Brushed Tray', category: 'Garden', amount: 585781 },
  { id: 'PRD-0353', name: 'Folding Desk', category: 'Office', amount: 783381 },
  { id: 'PRD-0354', name: 'Rustic Tray', category: 'Garden', amount: 21030 },
  { id: 'PRD-0355', name: 'Brushed Desk', category: 'Outdoor', amount: 905563 },
  { id: 'PRD-0356', name: 'Folding Clock', category: 'Outdoor', amount: 510309 },
  { id: 'PRD-0357', name: 'Slim Desk', category: 'Outdoor', amount: 94883 },
  { id: 'PRD-0358', name: 'Folding Shelf', category: 'Outdoor', amount: 887880 },
  { id: 'PRD-0359', name: 'Slim Bench', category: 'Kitchen', amount: 687719 },
  { id: 'PRD-0360', name: 'Rustic Lamp', category: 'Lighting', amount: 952608 },
  { id: 'PRD-0361', name: 'Compact Shelf', category: 'Outdoor', amount: 485176 },
  { id: 'PRD-0362', name: 'Modular Desk', category: 'Kitchen', amount: 24499 },
  { id: 'PRD-0363', name: 'Vintage Tray', category: 'Outdoor', amount: 626443 },
  { id: 'PRD-0364', name: 'Classic Kettle', category: 'Outdoor', amount: 859655 },
  { id: 'PRD-0365', name: 'Smart Lantern', category: 'Garden', amount: 478713 },
  { id: 'PRD-0366', name: 'Folding Shelf', category: 'Office', amount: 132711 },
  { id: 'PRD-0367', name: 'Slim Stool', category: 'Lighting', amount: 698299 },
];

describe('ProductTable filtering 2', () => {
  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Smart');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('PRD-0356');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('kitchen');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });

  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0355');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0355');
  });
});
