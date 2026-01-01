import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0035', name: 'Greta Maes', category: 'Outpatient', amount: 589125 },
  { id: 'PAT-0036', name: 'Ines Wouters', category: 'Outpatient', amount: 942827 },
  { id: 'PAT-0037', name: 'Chloe Goossens', category: 'Referred', amount: 467042 },
  { id: 'PAT-0038', name: 'Elise Dubois', category: 'Discharged', amount: 1281 },
  { id: 'PAT-0039', name: 'Greta Jacobs', category: 'Admitted', amount: 712148 },
  { id: 'PAT-0040', name: 'Ines Willems', category: 'Admitted', amount: 469063 },
  { id: 'PAT-0041', name: 'Chloe Maes', category: 'Admitted', amount: 147288 },
  { id: 'PAT-0042', name: 'Greta Peeters', category: 'Referred', amount: 674676 },
  { id: 'PAT-0043', name: 'Hugo Dubois', category: 'Admitted', amount: 39827 },
  { id: 'PAT-0044', name: 'Jonas Claes', category: 'Outpatient', amount: 56285 },
  { id: 'PAT-0045', name: 'Hugo Peeters', category: 'Waiting', amount: 124771 },
  { id: 'PAT-0046', name: 'Bruno Willems', category: 'Referred', amount: 948190 },
  { id: 'PAT-0047', name: 'Jonas Dubois', category: 'Admitted', amount: 723670 },
  { id: 'PAT-0048', name: 'Jonas Dubois', category: 'Admitted', amount: 832361 },
  { id: 'PAT-0049', name: 'Hugo Willems', category: 'Waiting', amount: 619071 },
  { id: 'PAT-0050', name: 'Bruno Willems', category: 'Outpatient', amount: 576358 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 16 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0035');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0035');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0038');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0046');
    cy.get('input[name=filter]').clear().type('PAT-0046');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('outpatient');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
  });

  it('filters, sorts and pages through 16 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0046');
  });
});
