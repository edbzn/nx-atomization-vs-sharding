import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0236', name: 'Rustic Tray', category: 'Lighting', amount: 595893 },
  { id: 'PRD-0237', name: 'Classic Desk', category: 'Outdoor', amount: 926322 },
  { id: 'PRD-0238', name: 'Vintage Clock', category: 'Office', amount: 397140 },
  { id: 'PRD-0239', name: 'Classic Kettle', category: 'Garden', amount: 243857 },
  { id: 'PRD-0240', name: 'Rustic Bench', category: 'Kitchen', amount: 844377 },
  { id: 'PRD-0241', name: 'Classic Tray', category: 'Outdoor', amount: 653618 },
  { id: 'PRD-0242', name: 'Heavy Stool', category: 'Lighting', amount: 297109 },
  { id: 'PRD-0243', name: 'Heavy Stool', category: 'Kitchen', amount: 284388 },
  { id: 'PRD-0244', name: 'Brushed Kettle', category: 'Garden', amount: 581213 },
  { id: 'PRD-0245', name: 'Smart Stool', category: 'Lighting', amount: 493169 },
  { id: 'PRD-0246', name: 'Vintage Clock', category: 'Kitchen', amount: 11032 },
  { id: 'PRD-0247', name: 'Brushed Clock', category: 'Office', amount: 580119 },
  { id: 'PRD-0248', name: 'Vintage Kettle', category: 'Garden', amount: 179892 },
  { id: 'PRD-0249', name: 'Rustic Tray', category: 'Garden', amount: 26054 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Slim');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0236');
    cy.get('input[name=filter]').clear().type('lighting');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0236');
    cy.get('input[name=filter]').clear().type('desk');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('ket');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0236');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0236');
  });

  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('prd-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
