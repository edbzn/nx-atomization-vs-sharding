import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0351', name: 'Compact Clock', category: 'Kitchen', amount: 287658 },
  { id: 'PRD-0352', name: 'Rustic Lantern', category: 'Office', amount: 977147 },
  { id: 'PRD-0353', name: 'Rustic Tray', category: 'Office', amount: 636483 },
  { id: 'PRD-0354', name: 'Vintage Stool', category: 'Outdoor', amount: 762010 },
  { id: 'PRD-0355', name: 'Compact Stool', category: 'Garden', amount: 478144 },
  { id: 'PRD-0356', name: 'Slim Tray', category: 'Kitchen', amount: 306262 },
  { id: 'PRD-0357', name: 'Modular Lantern', category: 'Kitchen', amount: 34731 },
  { id: 'PRD-0358', name: 'Compact Desk', category: 'Kitchen', amount: 968811 },
  { id: 'PRD-0359', name: 'Rustic Lamp', category: 'Outdoor', amount: 550268 },
  { id: 'PRD-0360', name: 'Modular Kettle', category: 'Outdoor', amount: 620138 },
  { id: 'PRD-0361', name: 'Modular Kettle', category: 'Lighting', amount: 658842 },
  { id: 'PRD-0362', name: 'Brushed Clock', category: 'Lighting', amount: 737857 },
  { id: 'PRD-0363', name: 'Vintage Stool', category: 'Office', amount: 161588 },
  { id: 'PRD-0364', name: 'Classic Tray', category: 'Lighting', amount: 599410 },
  { id: 'PRD-0365', name: 'Heavy Bench', category: 'Office', amount: 364535 },
  { id: 'PRD-0366', name: 'Rustic Planter', category: 'Garden', amount: 906840 },
  { id: 'PRD-0367', name: 'Rustic Kettle', category: 'Kitchen', amount: 460162 },
  { id: 'PRD-0368', name: 'Vintage Clock', category: 'Office', amount: 326446 },
  { id: 'PRD-0369', name: 'Classic Stool', category: 'Kitchen', amount: 281824 },
  { id: 'PRD-0370', name: 'Brushed Planter', category: 'Kitchen', amount: 496859 },
];

describe('ProductTable filtering', () => {
  it('filters, sorts and pages through 20 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('bench');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0365');
    cy.get('input[name=filter]').clear().type('PRD-0359');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('Smart');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 20 products', () => {
    const rows = ROWS;
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0362');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0357');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0359');
  });
});
