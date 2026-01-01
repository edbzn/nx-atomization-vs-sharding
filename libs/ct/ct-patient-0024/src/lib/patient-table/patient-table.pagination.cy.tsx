import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0016', name: 'Hugo Peeters', category: 'Outpatient', amount: 99695 },
  { id: 'PAT-0017', name: 'Bruno Wouters', category: 'Waiting', amount: 154445 },
  { id: 'PAT-0018', name: 'Farid Willems', category: 'Outpatient', amount: 315141 },
  { id: 'PAT-0019', name: 'Hugo Claes', category: 'Waiting', amount: 337914 },
  { id: 'PAT-0020', name: 'Hugo Mertens', category: 'Waiting', amount: 974702 },
  { id: 'PAT-0021', name: 'Hugo Maes', category: 'Discharged', amount: 165439 },
  { id: 'PAT-0022', name: 'Elise Wouters', category: 'Referred', amount: 10296 },
  { id: 'PAT-0023', name: 'Ines Janssens', category: 'Admitted', amount: 987757 },
  { id: 'PAT-0024', name: 'Daan Claes', category: 'Outpatient', amount: 324572 },
  { id: 'PAT-0025', name: 'Greta Dubois', category: 'Outpatient', amount: 657430 },
  { id: 'PAT-0026', name: 'Jonas Janssens', category: 'Waiting', amount: 602622 },
  { id: 'PAT-0027', name: 'Elise Wouters', category: 'Waiting', amount: 637720 },
  { id: 'PAT-0028', name: 'Ines Janssens', category: 'Admitted', amount: 493817 },
  { id: 'PAT-0029', name: 'Chloe Claes', category: 'Outpatient', amount: 358284 },
];

describe('PatientTable pagination', () => {
  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0026');
    cy.get('input[name=filter]').clear().type('peete');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0016');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0026');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0022');
    cy.get('input[name=filter]').clear().type('Bru');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0022');
  });
});
