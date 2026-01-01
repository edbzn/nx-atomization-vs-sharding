import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0186', name: 'Smart Stool', category: 'Office', amount: 299193 },
  { id: 'PRD-0187', name: 'Classic Bench', category: 'Kitchen', amount: 953302 },
  { id: 'PRD-0188', name: 'Folding Desk', category: 'Lighting', amount: 213406 },
  { id: 'PRD-0189', name: 'Classic Lamp', category: 'Kitchen', amount: 16760 },
  { id: 'PRD-0190', name: 'Slim Clock', category: 'Outdoor', amount: 641295 },
  { id: 'PRD-0191', name: 'Smart Clock', category: 'Office', amount: 197933 },
  { id: 'PRD-0192', name: 'Vintage Desk', category: 'Lighting', amount: 287809 },
  { id: 'PRD-0193', name: 'Compact Lantern', category: 'Outdoor', amount: 80183 },
  { id: 'PRD-0194', name: 'Heavy Bench', category: 'Outdoor', amount: 952071 },
  { id: 'PRD-0195', name: 'Smart Lamp', category: 'Outdoor', amount: 983826 },
  { id: 'PRD-0196', name: 'Smart Clock', category: 'Outdoor', amount: 437800 },
  { id: 'PRD-0197', name: 'Slim Lantern', category: 'Office', amount: 862492 },
  { id: 'PRD-0198', name: 'Smart Desk', category: 'Outdoor', amount: 522082 },
  { id: 'PRD-0199', name: 'Classic Lamp', category: 'Kitchen', amount: 83432 },
];

describe('ProductTable sorting', () => {
  it('filters, sorts and pages through 14 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0196');
    cy.get('input[name=filter]').clear().type('garden');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0186');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0186');
    cy.get('input[name=filter]').clear().type('prd-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0186');
    cy.get('input[name=filter]').clear().type('lamp');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0186');
  });
});
