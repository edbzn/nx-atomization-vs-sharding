import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0359', name: 'Brushed Lamp', category: 'Kitchen', amount: 5473 },
  { id: 'PRD-0360', name: 'Vintage Desk', category: 'Garden', amount: 659085 },
  { id: 'PRD-0361', name: 'Slim Lamp', category: 'Office', amount: 693990 },
  { id: 'PRD-0362', name: 'Modular Lamp', category: 'Garden', amount: 331017 },
  { id: 'PRD-0363', name: 'Folding Tray', category: 'Office', amount: 739101 },
  { id: 'PRD-0364', name: 'Compact Kettle', category: 'Garden', amount: 57069 },
  { id: 'PRD-0365', name: 'Rustic Desk', category: 'Lighting', amount: 168075 },
  { id: 'PRD-0366', name: 'Folding Desk', category: 'Office', amount: 656235 },
  { id: 'PRD-0367', name: 'Compact Planter', category: 'Kitchen', amount: 278932 },
  { id: 'PRD-0368', name: 'Folding Lamp', category: 'Kitchen', amount: 487220 },
  { id: 'PRD-0369', name: 'Smart Lamp', category: 'Garden', amount: 873895 },
  { id: 'PRD-0370', name: 'Modular Bench', category: 'Office', amount: 373263 },
  { id: 'PRD-0371', name: 'Vintage Lamp', category: 'Kitchen', amount: 443546 },
  { id: 'PRD-0372', name: 'Compact Clock', category: 'Office', amount: 338177 },
  { id: 'PRD-0373', name: 'Modular Stool', category: 'Garden', amount: 831975 },
  { id: 'PRD-0374', name: 'Heavy Lantern', category: 'Garden', amount: 521348 },
  { id: 'PRD-0375', name: 'Vintage Clock', category: 'Office', amount: 390859 },
  { id: 'PRD-0376', name: 'Brushed Desk', category: 'Office', amount: 916157 },
];

describe('ProductTable pagination', () => {
  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0369');
    cy.get('input[name=filter]').clear().type('PRD-0372');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('Heav');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 18 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0369');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0359');
  });

  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0359');
  });
});
