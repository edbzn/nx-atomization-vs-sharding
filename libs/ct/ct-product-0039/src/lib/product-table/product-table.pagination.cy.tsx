import { ProductTable } from './ProductTable';
import type { ProductRow } from '../types';

const ROWS: ProductRow[] = [
  { id: 'PRD-0357', name: 'Rustic Planter', category: 'Lighting', amount: 738363 },
  { id: 'PRD-0358', name: 'Modular Lamp', category: 'Outdoor', amount: 213941 },
  { id: 'PRD-0359', name: 'Folding Clock', category: 'Outdoor', amount: 382697 },
  { id: 'PRD-0360', name: 'Slim Desk', category: 'Garden', amount: 306794 },
  { id: 'PRD-0361', name: 'Heavy Bench', category: 'Office', amount: 416312 },
  { id: 'PRD-0362', name: 'Smart Bench', category: 'Outdoor', amount: 111435 },
  { id: 'PRD-0363', name: 'Modular Shelf', category: 'Kitchen', amount: 326512 },
  { id: 'PRD-0364', name: 'Heavy Bench', category: 'Kitchen', amount: 388468 },
  { id: 'PRD-0365', name: 'Modular Kettle', category: 'Kitchen', amount: 431181 },
  { id: 'PRD-0366', name: 'Vintage Planter', category: 'Outdoor', amount: 615071 },
  { id: 'PRD-0367', name: 'Brushed Bench', category: 'Outdoor', amount: 554867 },
  { id: 'PRD-0368', name: 'Folding Planter', category: 'Lighting', amount: 572434 },
  { id: 'PRD-0369', name: 'Compact Planter', category: 'Garden', amount: 849963 },
  { id: 'PRD-0370', name: 'Classic Clock', category: 'Garden', amount: 182506 },
  { id: 'PRD-0371', name: 'Modular Planter', category: 'Outdoor', amount: 935078 },
  { id: 'PRD-0372', name: 'Folding Bench', category: 'Outdoor', amount: 401696 },
  { id: 'PRD-0373', name: 'Smart Shelf', category: 'Kitchen', amount: 85021 },
  { id: 'PRD-0374', name: 'Compact Tray', category: 'Kitchen', amount: 507932 },
];

describe('ProductTable pagination', () => {
  it('filters, sorts and pages through 17 products', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<ProductTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PRD-0373');
    cy.get('input[name=filter]').clear().type('lanter');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
  });
});
