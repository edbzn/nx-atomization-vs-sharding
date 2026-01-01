import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0198', name: 'Hugo Dubois', category: 'Outpatient', amount: 14204 },
  { id: 'PAT-0199', name: 'Hugo Jacobs', category: 'Waiting', amount: 760260 },
  { id: 'PAT-0200', name: 'Anna Jacobs', category: 'Referred', amount: 810809 },
  { id: 'PAT-0201', name: 'Elise Peeters', category: 'Discharged', amount: 857029 },
  { id: 'PAT-0202', name: 'Daan Claes', category: 'Outpatient', amount: 857774 },
  { id: 'PAT-0203', name: 'Farid Wouters', category: 'Waiting', amount: 768501 },
  { id: 'PAT-0204', name: 'Farid Claes', category: 'Waiting', amount: 145820 },
  { id: 'PAT-0205', name: 'Anna Willems', category: 'Waiting', amount: 902497 },
  { id: 'PAT-0206', name: 'Farid Claes', category: 'Waiting', amount: 496361 },
  { id: 'PAT-0207', name: 'Bruno Wouters', category: 'Waiting', amount: 68400 },
  { id: 'PAT-0208', name: 'Anna Maes', category: 'Waiting', amount: 326165 },
  { id: 'PAT-0209', name: 'Ines Janssens', category: 'Outpatient', amount: 534063 },
  { id: 'PAT-0210', name: 'Daan Mertens', category: 'Outpatient', amount: 341455 },
  { id: 'PAT-0211', name: 'Jonas Jacobs', category: 'Discharged', amount: 457300 },
  { id: 'PAT-0212', name: 'Hugo Mertens', category: 'Referred', amount: 158566 },
  { id: 'PAT-0213', name: 'Jonas Goossens', category: 'Discharged', amount: 626123 },
  { id: 'PAT-0214', name: 'Chloe Dubois', category: 'Outpatient', amount: 470174 },
  { id: 'PAT-0215', name: 'Chloe Willems', category: 'Discharged', amount: 626733 },
  { id: 'PAT-0216', name: 'Elise Willems', category: 'Discharged', amount: 472532 },
];

describe('PatientTable search', () => {
  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('pat-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0200');
  });
});
