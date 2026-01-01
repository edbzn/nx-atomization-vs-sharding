import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0198', name: 'Anna Claes', category: 'Referred', amount: 756662 },
  { id: 'PAT-0199', name: 'Daan Maes', category: 'Discharged', amount: 707042 },
  { id: 'PAT-0200', name: 'Elise Mertens', category: 'Outpatient', amount: 464982 },
  { id: 'PAT-0201', name: 'Chloe Willems', category: 'Outpatient', amount: 384913 },
  { id: 'PAT-0202', name: 'Bruno Goossens', category: 'Discharged', amount: 985414 },
  { id: 'PAT-0203', name: 'Jonas Willems', category: 'Discharged', amount: 467439 },
  { id: 'PAT-0204', name: 'Elise Peeters', category: 'Outpatient', amount: 783122 },
  { id: 'PAT-0205', name: 'Daan Claes', category: 'Referred', amount: 140858 },
  { id: 'PAT-0206', name: 'Bruno Goossens', category: 'Discharged', amount: 301564 },
  { id: 'PAT-0207', name: 'Anna Mertens', category: 'Referred', amount: 242616 },
  { id: 'PAT-0208', name: 'Jonas Willems', category: 'Waiting', amount: 813673 },
  { id: 'PAT-0209', name: 'Jonas Dubois', category: 'Outpatient', amount: 587173 },
  { id: 'PAT-0210', name: 'Hugo Maes', category: 'Waiting', amount: 999718 },
  { id: 'PAT-0211', name: 'Bruno Dubois', category: 'Outpatient', amount: 461000 },
  { id: 'PAT-0212', name: 'Ines Wouters', category: 'Referred', amount: 308704 },
];

describe('PatientTable sorting', () => {
  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0208');
    cy.get('input[name=filter]').clear().type('Farid');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('waiting');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0198');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0210');
  });

  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0208');
  });
});
