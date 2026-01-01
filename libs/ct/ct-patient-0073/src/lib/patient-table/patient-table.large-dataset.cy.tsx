import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0195', name: 'Anna Wouters', category: 'Discharged', amount: 312787 },
  { id: 'PAT-0196', name: 'Chloe Willems', category: 'Referred', amount: 765840 },
  { id: 'PAT-0197', name: 'Bruno Maes', category: 'Waiting', amount: 30645 },
  { id: 'PAT-0198', name: 'Ines Wouters', category: 'Outpatient', amount: 718012 },
  { id: 'PAT-0199', name: 'Ines Wouters', category: 'Referred', amount: 606792 },
  { id: 'PAT-0200', name: 'Ines Jacobs', category: 'Referred', amount: 882098 },
  { id: 'PAT-0201', name: 'Anna Mertens', category: 'Referred', amount: 880322 },
  { id: 'PAT-0202', name: 'Hugo Willems', category: 'Outpatient', amount: 942107 },
  { id: 'PAT-0203', name: 'Greta Willems', category: 'Discharged', amount: 197961 },
  { id: 'PAT-0204', name: 'Greta Willems', category: 'Waiting', amount: 913551 },
  { id: 'PAT-0205', name: 'Jonas Janssens', category: 'Discharged', amount: 152331 },
  { id: 'PAT-0206', name: 'Daan Willems', category: 'Discharged', amount: 281258 },
  { id: 'PAT-0207', name: 'Elise Claes', category: 'Referred', amount: 304060 },
  { id: 'PAT-0208', name: 'Elise Peeters', category: 'Discharged', amount: 672804 },
];

describe('PatientTable large dataset', () => {
  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Far');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('goos');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('pat-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0195');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0197');
    cy.get('input[name=filter]').clear().type('duboi');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
