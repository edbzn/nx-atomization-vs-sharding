import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0046', name: 'Elise Peeters', category: 'Waiting', amount: 994243 },
  { id: 'PAT-0047', name: 'Jonas Maes', category: 'Outpatient', amount: 130446 },
  { id: 'PAT-0048', name: 'Ines Mertens', category: 'Discharged', amount: 729407 },
  { id: 'PAT-0049', name: 'Daan Goossens', category: 'Admitted', amount: 496441 },
  { id: 'PAT-0050', name: 'Farid Mertens', category: 'Referred', amount: 780416 },
  { id: 'PAT-0051', name: 'Bruno Goossens', category: 'Discharged', amount: 336552 },
  { id: 'PAT-0052', name: 'Daan Claes', category: 'Discharged', amount: 76245 },
  { id: 'PAT-0053', name: 'Hugo Maes', category: 'Waiting', amount: 613346 },
  { id: 'PAT-0054', name: 'Bruno Dubois', category: 'Admitted', amount: 198049 },
  { id: 'PAT-0055', name: 'Farid Wouters', category: 'Referred', amount: 499733 },
  { id: 'PAT-0056', name: 'Greta Wouters', category: 'Referred', amount: 399746 },
  { id: 'PAT-0057', name: 'Farid Mertens', category: 'Outpatient', amount: 876832 },
  { id: 'PAT-0058', name: 'Elise Maes', category: 'Admitted', amount: 333198 },
  { id: 'PAT-0059', name: 'Ines Claes', category: 'Outpatient', amount: 237896 },
  { id: 'PAT-0060', name: 'Chloe Peeters', category: 'Discharged', amount: 147039 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0056');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0046');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0046');
    cy.get('input[name=filter]').clear().type('wil');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0060');
  });
});
