import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0340', name: 'Anna Dubois', category: 'Discharged', amount: 140635 },
  { id: 'PAT-0341', name: 'Elise Claes', category: 'Admitted', amount: 190263 },
  { id: 'PAT-0342', name: 'Daan Janssens', category: 'Admitted', amount: 488625 },
  { id: 'PAT-0343', name: 'Chloe Wouters', category: 'Discharged', amount: 508846 },
  { id: 'PAT-0344', name: 'Jonas Janssens', category: 'Admitted', amount: 241597 },
  { id: 'PAT-0345', name: 'Daan Claes', category: 'Referred', amount: 705220 },
  { id: 'PAT-0346', name: 'Daan Janssens', category: 'Outpatient', amount: 82575 },
  { id: 'PAT-0347', name: 'Greta Claes', category: 'Referred', amount: 661924 },
  { id: 'PAT-0348', name: 'Bruno Willems', category: 'Waiting', amount: 792863 },
  { id: 'PAT-0349', name: 'Jonas Dubois', category: 'Referred', amount: 792023 },
  { id: 'PAT-0350', name: 'Daan Wouters', category: 'Outpatient', amount: 573338 },
  { id: 'PAT-0351', name: 'Ines Jacobs', category: 'Outpatient', amount: 141253 },
  { id: 'PAT-0352', name: 'Hugo Maes', category: 'Referred', amount: 576122 },
  { id: 'PAT-0353', name: 'Bruno Jacobs', category: 'Waiting', amount: 360841 },
];

describe('PatientTable search', () => {
  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0350');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0340');
    cy.get('input[name=filter]').clear().type('waiting');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0340');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0344');
  });

  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0340');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0340');
    cy.get('input[name=filter]').clear().type('pat-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
