import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0052', name: 'Elise Wouters', category: 'Admitted', amount: 119120 },
  { id: 'PAT-0053', name: 'Jonas Claes', category: 'Discharged', amount: 261309 },
  { id: 'PAT-0054', name: 'Hugo Dubois', category: 'Outpatient', amount: 384377 },
  { id: 'PAT-0055', name: 'Chloe Maes', category: 'Outpatient', amount: 657885 },
  { id: 'PAT-0056', name: 'Elise Claes', category: 'Waiting', amount: 999596 },
  { id: 'PAT-0057', name: 'Bruno Janssens', category: 'Discharged', amount: 553939 },
  { id: 'PAT-0058', name: 'Bruno Claes', category: 'Referred', amount: 402702 },
  { id: 'PAT-0059', name: 'Jonas Jacobs', category: 'Referred', amount: 253608 },
  { id: 'PAT-0060', name: 'Ines Wouters', category: 'Discharged', amount: 50621 },
  { id: 'PAT-0061', name: 'Chloe Wouters', category: 'Referred', amount: 806439 },
  { id: 'PAT-0062', name: 'Chloe Dubois', category: 'Waiting', amount: 389818 },
  { id: 'PAT-0063', name: 'Elise Claes', category: 'Waiting', amount: 309206 },
];

describe('PatientTable navigation', () => {
  it('filters, sorts and pages through 12 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0062');
    cy.get('input[name=filter]').clear().type('pat-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('PAT-0057');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 12 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-12 of 12');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0062');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 12');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0060');
  });
});
