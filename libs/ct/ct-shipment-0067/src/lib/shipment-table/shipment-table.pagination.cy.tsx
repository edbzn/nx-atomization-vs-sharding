import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0040', name: 'Local Box', category: 'Packed', amount: 759773 },
  { id: 'SHP-0041', name: 'Insured Bundle', category: 'Delivered', amount: 215207 },
  { id: 'SHP-0042', name: 'Oversize Drum', category: 'Packed', amount: 890504 },
  { id: 'SHP-0043', name: 'Bulk Box', category: 'Transit', amount: 938915 },
  { id: 'SHP-0044', name: 'Bulk Drum', category: 'Pending', amount: 941330 },
  { id: 'SHP-0045', name: 'Priority Drum', category: 'Returned', amount: 611723 },
  { id: 'SHP-0046', name: 'Express Box', category: 'Returned', amount: 907715 },
  { id: 'SHP-0047', name: 'Express Bundle', category: 'Transit', amount: 488901 },
  { id: 'SHP-0048', name: 'Overseas Tube', category: 'Transit', amount: 247815 },
  { id: 'SHP-0049', name: 'Frozen Envelope', category: 'Pending', amount: 234715 },
  { id: 'SHP-0050', name: 'Priority Envelope', category: 'Transit', amount: 644193 },
  { id: 'SHP-0051', name: 'Local Sack', category: 'Returned', amount: 722824 },
  { id: 'SHP-0052', name: 'Priority Drum', category: 'Packed', amount: 504690 },
  { id: 'SHP-0053', name: 'Insured Envelope', category: 'Returned', amount: 361890 },
];

describe('ShipmentTable pagination', () => {
  it('filters, sorts and pages through 14 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('SHP-0047');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0040');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0050');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0040');
    cy.get('input[name=filter]').clear().type('SHP-0049');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0049');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0049');
  });
});
