import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0035', name: 'Farid Wouters', category: 'Outpatient', amount: 995940 },
  { id: 'PAT-0036', name: 'Farid Goossens', category: 'Outpatient', amount: 371875 },
  { id: 'PAT-0037', name: 'Ines Willems', category: 'Waiting', amount: 978484 },
  { id: 'PAT-0038', name: 'Jonas Wouters', category: 'Outpatient', amount: 306167 },
  { id: 'PAT-0039', name: 'Elise Claes', category: 'Waiting', amount: 323974 },
  { id: 'PAT-0040', name: 'Hugo Peeters', category: 'Outpatient', amount: 319961 },
  { id: 'PAT-0041', name: 'Greta Wouters', category: 'Waiting', amount: 180306 },
  { id: 'PAT-0042', name: 'Elise Goossens', category: 'Waiting', amount: 475245 },
  { id: 'PAT-0043', name: 'Farid Willems', category: 'Admitted', amount: 416673 },
  { id: 'PAT-0044', name: 'Ines Willems', category: 'Waiting', amount: 264406 },
  { id: 'PAT-0045', name: 'Anna Jacobs', category: 'Waiting', amount: 935587 },
  { id: 'PAT-0046', name: 'Daan Jacobs', category: 'Discharged', amount: 689722 },
  { id: 'PAT-0047', name: 'Farid Dubois', category: 'Waiting', amount: 923013 },
];

describe('PatientTable sorting', () => {
  it('filters, sorts and pages through 13 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0045');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0037');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0038');
    cy.get('input[name=filter]').clear().type('Elise');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0038');
    cy.get('input[name=filter]').clear().type('admitted');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0043');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0041');
  });

  it('filters, sorts and pages through 13 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Eli');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });
});
