import { ShipmentTable } from './ShipmentTable';
import type { ShipmentRow } from '../types';

const ROWS: ShipmentRow[] = [
  { id: 'SHP-0374', name: 'Bulk Tube', category: 'Transit', amount: 470047 },
  { id: 'SHP-0375', name: 'Bulk Tube', category: 'Transit', amount: 221386 },
  { id: 'SHP-0376', name: 'Priority Container', category: 'Delivered', amount: 265811 },
  { id: 'SHP-0377', name: 'Fragile Envelope', category: 'Transit', amount: 313229 },
  { id: 'SHP-0378', name: 'Frozen Crate', category: 'Delivered', amount: 717164 },
  { id: 'SHP-0379', name: 'Overseas Crate', category: 'Packed', amount: 382588 },
  { id: 'SHP-0380', name: 'Bulk Envelope', category: 'Delivered', amount: 388128 },
  { id: 'SHP-0381', name: 'Insured Drum', category: 'Delivered', amount: 638430 },
  { id: 'SHP-0382', name: 'Oversize Envelope', category: 'Transit', amount: 191604 },
  { id: 'SHP-0383', name: 'Insured Crate', category: 'Packed', amount: 482325 },
  { id: 'SHP-0384', name: 'Express Box', category: 'Delivered', amount: 448578 },
  { id: 'SHP-0385', name: 'Standard Bundle', category: 'Packed', amount: 479923 },
  { id: 'SHP-0386', name: 'Oversize Tube', category: 'Pending', amount: 650860 },
  { id: 'SHP-0387', name: 'Fragile Box', category: 'Returned', amount: 949115 },
  { id: 'SHP-0388', name: 'Oversize Crate', category: 'Returned', amount: 434367 },
];

describe('ShipmentTable filtering 2', () => {
  it('filters, sorts and pages through 15 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0384');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0374');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0384');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0374');
    cy.get('input[name=filter]').clear().type('packed');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear().type('parc');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 15 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('box');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'SHP-0374');
    cy.get('input[name=filter]').clear().type('par');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 15 shipments', () => {
    const rows = ROWS;
    cy.mount(<ShipmentTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('SHP-0374');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
