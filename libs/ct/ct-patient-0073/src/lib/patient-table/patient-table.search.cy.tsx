import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0371', name: 'Farid Janssens', category: 'Admitted', amount: 136168 },
  { id: 'PAT-0372', name: 'Farid Claes', category: 'Admitted', amount: 990467 },
  { id: 'PAT-0373', name: 'Anna Dubois', category: 'Waiting', amount: 706707 },
  { id: 'PAT-0374', name: 'Anna Mertens', category: 'Outpatient', amount: 393768 },
  { id: 'PAT-0375', name: 'Ines Janssens', category: 'Outpatient', amount: 341086 },
  { id: 'PAT-0376', name: 'Hugo Janssens', category: 'Outpatient', amount: 996281 },
  { id: 'PAT-0377', name: 'Ines Janssens', category: 'Discharged', amount: 83094 },
  { id: 'PAT-0378', name: 'Anna Maes', category: 'Admitted', amount: 898379 },
  { id: 'PAT-0379', name: 'Anna Wouters', category: 'Admitted', amount: 178171 },
  { id: 'PAT-0380', name: 'Anna Wouters', category: 'Discharged', amount: 68224 },
  { id: 'PAT-0381', name: 'Greta Willems', category: 'Referred', amount: 213557 },
  { id: 'PAT-0382', name: 'Elise Wouters', category: 'Referred', amount: 57270 },
  { id: 'PAT-0383', name: 'Ines Maes', category: 'Waiting', amount: 765921 },
  { id: 'PAT-0384', name: 'Daan Wouters', category: 'Discharged', amount: 69301 },
  { id: 'PAT-0385', name: 'Farid Janssens', category: 'Discharged', amount: 263181 },
  { id: 'PAT-0386', name: 'Elise Maes', category: 'Discharged', amount: 58938 },
];

describe('PatientTable search', () => {
  it('filters, sorts and pages through 16 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0381');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0371');
    cy.get('input[name=filter]').clear().type('cla');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0372');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0382');
    cy.get('input[name=filter]').clear().type('Brun');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS.slice(0, 14);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0373');
  });
});
