import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0341', name: 'Farid Wouters', category: 'Waiting', amount: 466278 },
  { id: 'PAT-0342', name: 'Bruno Dubois', category: 'Referred', amount: 973742 },
  { id: 'PAT-0343', name: 'Ines Wouters', category: 'Waiting', amount: 659449 },
  { id: 'PAT-0344', name: 'Ines Jacobs', category: 'Admitted', amount: 232522 },
  { id: 'PAT-0345', name: 'Anna Janssens', category: 'Waiting', amount: 107431 },
  { id: 'PAT-0346', name: 'Jonas Claes', category: 'Referred', amount: 148706 },
  { id: 'PAT-0347', name: 'Bruno Jacobs', category: 'Discharged', amount: 856452 },
  { id: 'PAT-0348', name: 'Daan Dubois', category: 'Referred', amount: 355632 },
  { id: 'PAT-0349', name: 'Farid Wouters', category: 'Discharged', amount: 827807 },
  { id: 'PAT-0350', name: 'Elise Maes', category: 'Discharged', amount: 99372 },
  { id: 'PAT-0351', name: 'Anna Jacobs', category: 'Admitted', amount: 507037 },
  { id: 'PAT-0352', name: 'Bruno Maes', category: 'Waiting', amount: 751836 },
  { id: 'PAT-0353', name: 'Daan Willems', category: 'Admitted', amount: 31116 },
];

describe('PatientTable pagination', () => {
  it('filters, sorts and pages through 13 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0341');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0351');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0341');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0353');
    cy.get('input[name=filter]').clear().type('PAT-0347');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
