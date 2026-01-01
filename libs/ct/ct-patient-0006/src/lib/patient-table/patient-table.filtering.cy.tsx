import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0265', name: 'Hugo Dubois', category: 'Discharged', amount: 121872 },
  { id: 'PAT-0266', name: 'Ines Wouters', category: 'Referred', amount: 593716 },
  { id: 'PAT-0267', name: 'Hugo Peeters', category: 'Admitted', amount: 301154 },
  { id: 'PAT-0268', name: 'Farid Goossens', category: 'Referred', amount: 177029 },
  { id: 'PAT-0269', name: 'Hugo Janssens', category: 'Admitted', amount: 836321 },
  { id: 'PAT-0270', name: 'Farid Peeters', category: 'Referred', amount: 180407 },
  { id: 'PAT-0271', name: 'Ines Peeters', category: 'Admitted', amount: 507082 },
  { id: 'PAT-0272', name: 'Chloe Peeters', category: 'Outpatient', amount: 754611 },
  { id: 'PAT-0273', name: 'Farid Mertens', category: 'Referred', amount: 929820 },
  { id: 'PAT-0274', name: 'Farid Dubois', category: 'Discharged', amount: 667697 },
  { id: 'PAT-0275', name: 'Ines Janssens', category: 'Discharged', amount: 588397 },
  { id: 'PAT-0276', name: 'Bruno Maes', category: 'Waiting', amount: 415812 },
  { id: 'PAT-0277', name: 'Anna Dubois', category: 'Outpatient', amount: 303203 },
  { id: 'PAT-0278', name: 'Jonas Janssens', category: 'Outpatient', amount: 659211 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0275');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0265');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0265');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0265');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0265');
    cy.get('input[name=filter]').clear().type('waiting');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0265');
  });
});
