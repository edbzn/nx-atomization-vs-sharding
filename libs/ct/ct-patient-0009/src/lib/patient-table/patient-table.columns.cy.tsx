import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0219', name: 'Ines Willems', category: 'Admitted', amount: 136527 },
  { id: 'PAT-0220', name: 'Greta Peeters', category: 'Discharged', amount: 403685 },
  { id: 'PAT-0221', name: 'Hugo Jacobs', category: 'Discharged', amount: 892449 },
  { id: 'PAT-0222', name: 'Jonas Claes', category: 'Discharged', amount: 162087 },
  { id: 'PAT-0223', name: 'Chloe Willems', category: 'Referred', amount: 874904 },
  { id: 'PAT-0224', name: 'Daan Wouters', category: 'Waiting', amount: 983009 },
  { id: 'PAT-0225', name: 'Bruno Goossens', category: 'Referred', amount: 657424 },
  { id: 'PAT-0226', name: 'Bruno Janssens', category: 'Discharged', amount: 951489 },
  { id: 'PAT-0227', name: 'Chloe Janssens', category: 'Outpatient', amount: 836244 },
  { id: 'PAT-0228', name: 'Anna Janssens', category: 'Discharged', amount: 903954 },
  { id: 'PAT-0229', name: 'Jonas Willems', category: 'Admitted', amount: 196598 },
  { id: 'PAT-0230', name: 'Elise Jacobs', category: 'Admitted', amount: 391879 },
  { id: 'PAT-0231', name: 'Farid Willems', category: 'Admitted', amount: 66422 },
  { id: 'PAT-0232', name: 'Hugo Jacobs', category: 'Discharged', amount: 604708 },
  { id: 'PAT-0233', name: 'Anna Maes', category: 'Waiting', amount: 718036 },
  { id: 'PAT-0234', name: 'Greta Claes', category: 'Waiting', amount: 304411 },
  { id: 'PAT-0235', name: 'Chloe Wouters', category: 'Waiting', amount: 350753 },
  { id: 'PAT-0236', name: 'Greta Goossens', category: 'Admitted', amount: 986969 },
  { id: 'PAT-0237', name: 'Hugo Maes', category: 'Outpatient', amount: 68767 },
];

describe('PatientTable columns', () => {
  it('filters, sorts and pages through 19 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0229');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0219');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0228');
    cy.get('input[name=filter]').clear().type('Ines');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('referred');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0219');
  });
});
