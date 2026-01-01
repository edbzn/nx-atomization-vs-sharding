import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0256', name: 'Ines Peeters', category: 'Admitted', amount: 85705 },
  { id: 'PAT-0257', name: 'Ines Wouters', category: 'Referred', amount: 73467 },
  { id: 'PAT-0258', name: 'Ines Wouters', category: 'Discharged', amount: 946500 },
  { id: 'PAT-0259', name: 'Bruno Claes', category: 'Admitted', amount: 857281 },
  { id: 'PAT-0260', name: 'Daan Claes', category: 'Discharged', amount: 69019 },
  { id: 'PAT-0261', name: 'Hugo Maes', category: 'Admitted', amount: 38552 },
  { id: 'PAT-0262', name: 'Ines Claes', category: 'Admitted', amount: 923931 },
  { id: 'PAT-0263', name: 'Bruno Willems', category: 'Referred', amount: 788495 },
  { id: 'PAT-0264', name: 'Chloe Janssens', category: 'Admitted', amount: 846721 },
  { id: 'PAT-0265', name: 'Farid Jacobs', category: 'Waiting', amount: 142507 },
  { id: 'PAT-0266', name: 'Ines Jacobs', category: 'Waiting', amount: 133914 },
  { id: 'PAT-0267', name: 'Bruno Goossens', category: 'Referred', amount: 688605 },
  { id: 'PAT-0268', name: 'Elise Janssens', category: 'Referred', amount: 258056 },
  { id: 'PAT-0269', name: 'Greta Mertens', category: 'Outpatient', amount: 251084 },
  { id: 'PAT-0270', name: 'Elise Goossens', category: 'Referred', amount: 504034 },
  { id: 'PAT-0271', name: 'Hugo Wouters', category: 'Admitted', amount: 189823 },
  { id: 'PAT-0272', name: 'Chloe Peeters', category: 'Outpatient', amount: 203103 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0261');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0270');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0258');
  });

  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0261');
  });

  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('PAT-0269');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
