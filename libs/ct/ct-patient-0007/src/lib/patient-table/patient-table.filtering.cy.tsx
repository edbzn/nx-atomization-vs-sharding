import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0077', name: 'Greta Goossens', category: 'Waiting', amount: 723296 },
  { id: 'PAT-0078', name: 'Daan Janssens', category: 'Outpatient', amount: 478555 },
  { id: 'PAT-0079', name: 'Anna Jacobs', category: 'Outpatient', amount: 456244 },
  { id: 'PAT-0080', name: 'Elise Willems', category: 'Referred', amount: 500423 },
  { id: 'PAT-0081', name: 'Greta Claes', category: 'Referred', amount: 985951 },
  { id: 'PAT-0082', name: 'Daan Claes', category: 'Waiting', amount: 402521 },
  { id: 'PAT-0083', name: 'Jonas Janssens', category: 'Waiting', amount: 841722 },
  { id: 'PAT-0084', name: 'Elise Maes', category: 'Waiting', amount: 843482 },
  { id: 'PAT-0085', name: 'Chloe Claes', category: 'Discharged', amount: 177521 },
  { id: 'PAT-0086', name: 'Ines Wouters', category: 'Discharged', amount: 766647 },
  { id: 'PAT-0087', name: 'Greta Maes', category: 'Waiting', amount: 949514 },
  { id: 'PAT-0088', name: 'Bruno Claes', category: 'Admitted', amount: 677327 },
  { id: 'PAT-0089', name: 'Anna Dubois', category: 'Admitted', amount: 733644 },
  { id: 'PAT-0090', name: 'Jonas Maes', category: 'Discharged', amount: 909129 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0089');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0089');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0085');
    cy.get('input[name=filter]').clear().type('PAT-0090');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('pat-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('referred');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });
});
