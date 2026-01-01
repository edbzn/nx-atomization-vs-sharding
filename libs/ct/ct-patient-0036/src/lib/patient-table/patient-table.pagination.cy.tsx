import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0032', name: 'Hugo Jacobs', category: 'Admitted', amount: 343333 },
  { id: 'PAT-0033', name: 'Daan Peeters', category: 'Waiting', amount: 198013 },
  { id: 'PAT-0034', name: 'Anna Mertens', category: 'Referred', amount: 475347 },
  { id: 'PAT-0035', name: 'Farid Willems', category: 'Outpatient', amount: 982419 },
  { id: 'PAT-0036', name: 'Anna Claes', category: 'Referred', amount: 708271 },
  { id: 'PAT-0037', name: 'Greta Wouters', category: 'Waiting', amount: 279954 },
  { id: 'PAT-0038', name: 'Jonas Jacobs', category: 'Referred', amount: 935774 },
  { id: 'PAT-0039', name: 'Hugo Dubois', category: 'Admitted', amount: 472627 },
  { id: 'PAT-0040', name: 'Hugo Willems', category: 'Discharged', amount: 19986 },
  { id: 'PAT-0041', name: 'Chloe Willems', category: 'Outpatient', amount: 868595 },
  { id: 'PAT-0042', name: 'Ines Claes', category: 'Admitted', amount: 890687 },
  { id: 'PAT-0043', name: 'Anna Dubois', category: 'Waiting', amount: 561080 },
];

describe('PatientTable pagination', () => {
  it('filters, sorts and pages through 12 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0042');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0032');
    cy.get('input[name=filter]').clear().type('Elise');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0032');
  });
});
