import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0256', name: 'Jonas Jacobs', category: 'Admitted', amount: 497053 },
  { id: 'PAT-0257', name: 'Jonas Peeters', category: 'Outpatient', amount: 808553 },
  { id: 'PAT-0258', name: 'Bruno Dubois', category: 'Outpatient', amount: 653065 },
  { id: 'PAT-0259', name: 'Greta Dubois', category: 'Outpatient', amount: 169589 },
  { id: 'PAT-0260', name: 'Greta Goossens', category: 'Referred', amount: 989555 },
  { id: 'PAT-0261', name: 'Jonas Janssens', category: 'Outpatient', amount: 484779 },
  { id: 'PAT-0262', name: 'Farid Dubois', category: 'Discharged', amount: 395011 },
  { id: 'PAT-0263', name: 'Hugo Claes', category: 'Outpatient', amount: 775181 },
  { id: 'PAT-0264', name: 'Hugo Maes', category: 'Discharged', amount: 924961 },
  { id: 'PAT-0265', name: 'Greta Mertens', category: 'Admitted', amount: 75718 },
  { id: 'PAT-0266', name: 'Chloe Willems', category: 'Discharged', amount: 838885 },
  { id: 'PAT-0267', name: 'Ines Peeters', category: 'Waiting', amount: 949118 },
  { id: 'PAT-0268', name: 'Elise Willems', category: 'Referred', amount: 768707 },
  { id: 'PAT-0269', name: 'Farid Maes', category: 'Outpatient', amount: 272520 },
  { id: 'PAT-0270', name: 'Ines Dubois', category: 'Discharged', amount: 411303 },
  { id: 'PAT-0271', name: 'Farid Jacobs', category: 'Discharged', amount: 83724 },
  { id: 'PAT-0272', name: 'Elise Peeters', category: 'Outpatient', amount: 360724 },
];

describe('PatientTable sorting', () => {
  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0256');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0256');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0256');
    cy.get('input[name=filter]').clear().type('goosse');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0256');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0258');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0263');
  });

  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0256');
  });
});
