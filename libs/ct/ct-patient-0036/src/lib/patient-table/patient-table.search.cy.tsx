import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0221', name: 'Elise Peeters', category: 'Referred', amount: 793499 },
  { id: 'PAT-0222', name: 'Hugo Maes', category: 'Admitted', amount: 90758 },
  { id: 'PAT-0223', name: 'Ines Jacobs', category: 'Discharged', amount: 249652 },
  { id: 'PAT-0224', name: 'Elise Claes', category: 'Referred', amount: 490790 },
  { id: 'PAT-0225', name: 'Jonas Willems', category: 'Discharged', amount: 125646 },
  { id: 'PAT-0226', name: 'Chloe Peeters', category: 'Discharged', amount: 343199 },
  { id: 'PAT-0227', name: 'Jonas Maes', category: 'Outpatient', amount: 292575 },
  { id: 'PAT-0228', name: 'Jonas Dubois', category: 'Waiting', amount: 378339 },
  { id: 'PAT-0229', name: 'Bruno Maes', category: 'Referred', amount: 80404 },
  { id: 'PAT-0230', name: 'Hugo Goossens', category: 'Waiting', amount: 416698 },
  { id: 'PAT-0231', name: 'Ines Dubois', category: 'Waiting', amount: 468500 },
  { id: 'PAT-0232', name: 'Bruno Wouters', category: 'Outpatient', amount: 639025 },
  { id: 'PAT-0233', name: 'Elise Claes', category: 'Waiting', amount: 203369 },
  { id: 'PAT-0234', name: 'Jonas Claes', category: 'Discharged', amount: 160167 },
  { id: 'PAT-0235', name: 'Anna Jacobs', category: 'Admitted', amount: 227012 },
  { id: 'PAT-0236', name: 'Jonas Dubois', category: 'Discharged', amount: 65035 },
  { id: 'PAT-0237', name: 'Ines Goossens', category: 'Admitted', amount: 380020 },
  { id: 'PAT-0238', name: 'Farid Mertens', category: 'Referred', amount: 291520 },
  { id: 'PAT-0239', name: 'Farid Peeters', category: 'Discharged', amount: 400609 },
];

describe('PatientTable search', () => {
  it('filters, sorts and pages through 19 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0221');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0221');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0221');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0236');
    cy.get('input[name=filter]').clear().type('Daa');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('PAT-0221');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0236');
  });

  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS.slice(0, 14);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0231');
  });
});
