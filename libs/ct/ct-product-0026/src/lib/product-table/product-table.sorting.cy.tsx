import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0294', name: 'Vintage Clock', category: 'Outdoor', amount: 309380 },
  { id: 'PRD-0295', name: 'Compact Stool', category: 'Garden', amount: 324635 },
  { id: 'PRD-0296', name: 'Brushed Shelf', category: 'Office', amount: 924572 },
  { id: 'PRD-0297', name: 'Compact Desk', category: 'Office', amount: 897912 },
  { id: 'PRD-0298', name: 'Rustic Planter', category: 'Outdoor', amount: 456718 },
  { id: 'PRD-0299', name: 'Heavy Bench', category: 'Office', amount: 552221 },
  { id: 'PRD-0300', name: 'Smart Desk', category: 'Kitchen', amount: 225956 },
  { id: 'PRD-0301', name: 'Brushed Planter', category: 'Lighting', amount: 431331 },
  { id: 'PRD-0302', name: 'Heavy Tray', category: 'Kitchen', amount: 625092 },
  { id: 'PRD-0303', name: 'Brushed Lamp', category: 'Garden', amount: 469213 },
  { id: 'PRD-0304', name: 'Heavy Clock', category: 'Outdoor', amount: 429790 },
  { id: 'PRD-0305', name: 'Slim Kettle', category: 'Office', amount: 620656 },
  { id: 'PRD-0306', name: 'Classic Bench', category: 'Kitchen', amount: 880398 },
  { id: 'PRD-0307', name: 'Brushed Kettle', category: 'Outdoor', amount: 396285 },
  { id: 'PRD-0308', name: 'Slim Tray', category: 'Kitchen', amount: 101875 },
  { id: 'PRD-0309', name: 'Brushed Kettle', category: 'Kitchen', amount: 259249 },
  { id: 'PRD-0310', name: 'Slim Bench', category: 'Garden', amount: 848137 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0294');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0308');
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
