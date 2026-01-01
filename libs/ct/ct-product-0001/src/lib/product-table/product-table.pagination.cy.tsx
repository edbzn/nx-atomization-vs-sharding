import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0203', name: 'Compact Lantern', category: 'Kitchen', amount: 987579 },
  { id: 'PRD-0204', name: 'Slim Kettle', category: 'Garden', amount: 773398 },
  { id: 'PRD-0205', name: 'Compact Stool', category: 'Office', amount: 531926 },
  { id: 'PRD-0206', name: 'Classic Shelf', category: 'Garden', amount: 557090 },
  { id: 'PRD-0207', name: 'Slim Planter', category: 'Outdoor', amount: 117142 },
  { id: 'PRD-0208', name: 'Slim Bench', category: 'Office', amount: 560226 },
  { id: 'PRD-0209', name: 'Modular Clock', category: 'Kitchen', amount: 407836 },
  { id: 'PRD-0210', name: 'Classic Lamp', category: 'Kitchen', amount: 966700 },
  { id: 'PRD-0211', name: 'Modular Kettle', category: 'Office', amount: 721865 },
  { id: 'PRD-0212', name: 'Vintage Shelf', category: 'Lighting', amount: 67490 },
  { id: 'PRD-0213', name: 'Brushed Stool', category: 'Kitchen', amount: 466021 },
  { id: 'PRD-0214', name: 'Smart Kettle', category: 'Office', amount: 171427 },
  { id: 'PRD-0215', name: 'Compact Planter', category: 'Lighting', amount: 949922 },
  { id: 'PRD-0216', name: 'Heavy Tray', category: 'Kitchen', amount: 414394 },
  { id: 'PRD-0217', name: 'Brushed Shelf', category: 'Outdoor', amount: 588326 },
  { id: 'PRD-0218', name: 'Brushed Shelf', category: 'Office', amount: 578420 },
  { id: 'PRD-0219', name: 'Brushed Planter', category: 'Office', amount: 486057 },
  { id: 'PRD-0220', name: 'Brushed Stool', category: 'Office', amount: 240224 },
];

describe('ProductTable pagination', () => {
  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0213');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0203');
    cy.get('input[name=filter]').clear().type('prd-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0213');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0203');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0219');
    cy.get('input[name=filter]').clear().type('plan');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0219');
    cy.get('input[name=filter]').clear().type('prd-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
