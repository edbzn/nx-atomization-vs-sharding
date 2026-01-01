import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0025', name: 'Ines Wouters', category: 'Discharged', amount: 583165 },
  { id: 'PAT-0026', name: 'Jonas Peeters', category: 'Referred', amount: 599886 },
  { id: 'PAT-0027', name: 'Greta Peeters', category: 'Waiting', amount: 997224 },
  { id: 'PAT-0028', name: 'Farid Janssens', category: 'Referred', amount: 657469 },
  { id: 'PAT-0029', name: 'Daan Mertens', category: 'Discharged', amount: 755617 },
  { id: 'PAT-0030', name: 'Bruno Maes', category: 'Discharged', amount: 281250 },
  { id: 'PAT-0031', name: 'Ines Wouters', category: 'Discharged', amount: 92465 },
  { id: 'PAT-0032', name: 'Greta Maes', category: 'Referred', amount: 279067 },
  { id: 'PAT-0033', name: 'Bruno Goossens', category: 'Waiting', amount: 51227 },
  { id: 'PAT-0034', name: 'Elise Janssens', category: 'Discharged', amount: 108895 },
  { id: 'PAT-0035', name: 'Greta Claes', category: 'Waiting', amount: 68058 },
  { id: 'PAT-0036', name: 'Anna Peeters', category: 'Outpatient', amount: 544042 },
  { id: 'PAT-0037', name: 'Anna Maes', category: 'Referred', amount: 563858 },
  { id: 'PAT-0038', name: 'Chloe Peeters', category: 'Outpatient', amount: 470007 },
  { id: 'PAT-0039', name: 'Anna Claes', category: 'Admitted', amount: 140531 },
  { id: 'PAT-0040', name: 'Daan Jacobs', category: 'Referred', amount: 31598 },
  { id: 'PAT-0041', name: 'Ines Maes', category: 'Referred', amount: 971163 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('merte');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0025');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0040');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0040');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0040');
  });

  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0025');
  });
});
