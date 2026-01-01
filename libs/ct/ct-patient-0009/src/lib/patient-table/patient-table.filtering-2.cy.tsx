import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0333', name: 'Chloe Mertens', category: 'Admitted', amount: 417234 },
  { id: 'PAT-0334', name: 'Elise Willems', category: 'Waiting', amount: 704846 },
  { id: 'PAT-0335', name: 'Chloe Janssens', category: 'Waiting', amount: 806642 },
  { id: 'PAT-0336', name: 'Chloe Dubois', category: 'Outpatient', amount: 916799 },
  { id: 'PAT-0337', name: 'Elise Willems', category: 'Waiting', amount: 431944 },
  { id: 'PAT-0338', name: 'Bruno Maes', category: 'Referred', amount: 331067 },
  { id: 'PAT-0339', name: 'Farid Janssens', category: 'Waiting', amount: 737573 },
  { id: 'PAT-0340', name: 'Greta Jacobs', category: 'Admitted', amount: 920165 },
  { id: 'PAT-0341', name: 'Jonas Wouters', category: 'Waiting', amount: 496209 },
  { id: 'PAT-0342', name: 'Greta Jacobs', category: 'Waiting', amount: 249673 },
  { id: 'PAT-0343', name: 'Chloe Janssens', category: 'Outpatient', amount: 859217 },
  { id: 'PAT-0344', name: 'Daan Claes', category: 'Outpatient', amount: 519950 },
  { id: 'PAT-0345', name: 'Farid Dubois', category: 'Discharged', amount: 747219 },
  { id: 'PAT-0346', name: 'Chloe Willems', category: 'Waiting', amount: 696620 },
  { id: 'PAT-0347', name: 'Chloe Claes', category: 'Outpatient', amount: 555215 },
];

describe('PatientTable filtering 2', () => {
  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0343');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0333');
    cy.get('input[name=filter]').clear().type('PAT-0344');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0333');
  });

  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0342');
  });

  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0338');
  });
});
