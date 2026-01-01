import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0302', name: 'Smart Clock', category: 'Garden', amount: 429510 },
  { id: 'PRD-0303', name: 'Slim Stool', category: 'Kitchen', amount: 595373 },
  { id: 'PRD-0304', name: 'Slim Lantern', category: 'Lighting', amount: 629642 },
  { id: 'PRD-0305', name: 'Heavy Clock', category: 'Kitchen', amount: 685892 },
  { id: 'PRD-0306', name: 'Vintage Kettle', category: 'Lighting', amount: 794919 },
  { id: 'PRD-0307', name: 'Modular Clock', category: 'Outdoor', amount: 963874 },
  { id: 'PRD-0308', name: 'Brushed Bench', category: 'Lighting', amount: 616268 },
  { id: 'PRD-0309', name: 'Folding Planter', category: 'Garden', amount: 318940 },
  { id: 'PRD-0310', name: 'Folding Stool', category: 'Office', amount: 179321 },
  { id: 'PRD-0311', name: 'Brushed Planter', category: 'Lighting', amount: 376214 },
  { id: 'PRD-0312', name: 'Folding Tray', category: 'Outdoor', amount: 177575 },
  { id: 'PRD-0313', name: 'Classic Lantern', category: 'Outdoor', amount: 426651 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 12 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0302');
    cy.get('input[name=filter]').clear().type('kitchen');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0302');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0312');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0313');
    cy.get('input[name=filter]').clear().type('PRD-0303');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0303');
  });

  it('filters, sorts and pages through 12 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0302');
  });
});
