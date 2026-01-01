import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0012', name: 'Anna Claes', category: 'Admitted', amount: 213013 },
  { id: 'PAT-0013', name: 'Anna Mertens', category: 'Discharged', amount: 620086 },
  { id: 'PAT-0014', name: 'Greta Willems', category: 'Discharged', amount: 625315 },
  { id: 'PAT-0015', name: 'Farid Claes', category: 'Admitted', amount: 510807 },
  { id: 'PAT-0016', name: 'Bruno Claes', category: 'Referred', amount: 290433 },
  { id: 'PAT-0017', name: 'Greta Mertens', category: 'Outpatient', amount: 707662 },
  { id: 'PAT-0018', name: 'Daan Maes', category: 'Outpatient', amount: 442007 },
  { id: 'PAT-0019', name: 'Ines Wouters', category: 'Outpatient', amount: 132801 },
  { id: 'PAT-0020', name: 'Anna Peeters', category: 'Admitted', amount: 146366 },
  { id: 'PAT-0021', name: 'Daan Jacobs', category: 'Admitted', amount: 591487 },
  { id: 'PAT-0022', name: 'Bruno Dubois', category: 'Admitted', amount: 673656 },
  { id: 'PAT-0023', name: 'Greta Goossens', category: 'Waiting', amount: 131244 },
  { id: 'PAT-0024', name: 'Bruno Goossens', category: 'Referred', amount: 154550 },
  { id: 'PAT-0025', name: 'Daan Goossens', category: 'Outpatient', amount: 480471 },
  { id: 'PAT-0026', name: 'Jonas Dubois', category: 'Admitted', amount: 375220 },
  { id: 'PAT-0027', name: 'Ines Janssens', category: 'Referred', amount: 713397 },
  { id: 'PAT-0028', name: 'Elise Maes', category: 'Outpatient', amount: 996751 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0012');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0015');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0023');
    cy.get('input[name=filter]').clear().type('Jon');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 16 patients', () => {
    const rows = ROWS.slice(0, 16);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0022');
  });
});
