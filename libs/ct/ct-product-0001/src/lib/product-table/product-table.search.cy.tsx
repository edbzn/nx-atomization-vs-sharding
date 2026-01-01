import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0393', name: 'Brushed Kettle', category: 'Outdoor', amount: 104407 },
  { id: 'PRD-0394', name: 'Brushed Desk', category: 'Kitchen', amount: 564693 },
  { id: 'PRD-0395', name: 'Heavy Stool', category: 'Lighting', amount: 833435 },
  { id: 'PRD-0396', name: 'Compact Stool', category: 'Garden', amount: 203417 },
  { id: 'PRD-0397', name: 'Heavy Stool', category: 'Office', amount: 736401 },
  { id: 'PRD-0398', name: 'Heavy Lantern', category: 'Garden', amount: 126172 },
  { id: 'PRD-0399', name: 'Rustic Clock', category: 'Outdoor', amount: 401109 },
  { id: 'PRD-0400', name: 'Compact Lamp', category: 'Lighting', amount: 305542 },
  { id: 'PRD-0401', name: 'Slim Stool', category: 'Office', amount: 559326 },
  { id: 'PRD-0402', name: 'Rustic Lamp', category: 'Outdoor', amount: 673416 },
  { id: 'PRD-0403', name: 'Rustic Lamp', category: 'Office', amount: 628088 },
  { id: 'PRD-0404', name: 'Smart Tray', category: 'Garden', amount: 841460 },
  { id: 'PRD-0405', name: 'Compact Planter', category: 'Lighting', amount: 303397 },
  { id: 'PRD-0406', name: 'Vintage Lamp', category: 'Lighting', amount: 326077 },
  { id: 'PRD-0407', name: 'Rustic Bench', category: 'Office', amount: 46375 },
  { id: 'PRD-0408', name: 'Smart Desk', category: 'Outdoor', amount: 896403 },
  { id: 'PRD-0409', name: 'Modular Lamp', category: 'Office', amount: 365019 },
  { id: 'PRD-0410', name: 'Vintage Kettle', category: 'Kitchen', amount: 640460 },
];

describe('ProductTable search', () => {
  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0393');
    cy.get('input[name=filter]').clear().type('prd-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0393');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0407');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0407');
    cy.get('input[name=filter]').clear().type('Slim');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
