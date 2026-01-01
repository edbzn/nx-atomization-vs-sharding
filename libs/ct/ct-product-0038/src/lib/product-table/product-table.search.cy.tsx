import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0114', name: 'Compact Planter', category: 'Lighting', amount: 195847 },
  { id: 'PRD-0115', name: 'Folding Tray', category: 'Office', amount: 506563 },
  { id: 'PRD-0116', name: 'Heavy Desk', category: 'Lighting', amount: 856994 },
  { id: 'PRD-0117', name: 'Heavy Tray', category: 'Kitchen', amount: 722697 },
  { id: 'PRD-0118', name: 'Compact Lantern', category: 'Outdoor', amount: 688670 },
  { id: 'PRD-0119', name: 'Smart Desk', category: 'Outdoor', amount: 55279 },
  { id: 'PRD-0120', name: 'Heavy Lamp', category: 'Lighting', amount: 98138 },
  { id: 'PRD-0121', name: 'Vintage Stool', category: 'Outdoor', amount: 15914 },
  { id: 'PRD-0122', name: 'Folding Kettle', category: 'Lighting', amount: 137614 },
  { id: 'PRD-0123', name: 'Vintage Planter', category: 'Kitchen', amount: 735690 },
  { id: 'PRD-0124', name: 'Classic Lantern', category: 'Outdoor', amount: 106133 },
  { id: 'PRD-0125', name: 'Folding Shelf', category: 'Garden', amount: 861156 },
  { id: 'PRD-0126', name: 'Heavy Clock', category: 'Office', amount: 937447 },
  { id: 'PRD-0127', name: 'Folding Clock', category: 'Kitchen', amount: 721703 },
  { id: 'PRD-0128', name: 'Smart Planter', category: 'Outdoor', amount: 603737 },
  { id: 'PRD-0129', name: 'Compact Lamp', category: 'Outdoor', amount: 508698 },
  { id: 'PRD-0130', name: 'Smart Tray', category: 'Kitchen', amount: 540822 },
  { id: 'PRD-0131', name: 'Heavy Tray', category: 'Kitchen', amount: 620986 },
];

describe('ProductTable search', () => {
  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0124');
    cy.get('input[name=filter]').clear().type('Rusti');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0114');
    cy.get('input[name=filter]').clear().type('prd-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('shel');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 16 products', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0124');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0114');
  });

  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0124');
  });
});
