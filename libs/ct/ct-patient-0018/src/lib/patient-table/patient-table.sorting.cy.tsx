import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0132', name: 'Jonas Goossens', category: 'Referred', amount: 819565 },
  { id: 'PAT-0133', name: 'Anna Willems', category: 'Admitted', amount: 940503 },
  { id: 'PAT-0134', name: 'Anna Goossens', category: 'Discharged', amount: 165391 },
  { id: 'PAT-0135', name: 'Bruno Willems', category: 'Referred', amount: 754118 },
  { id: 'PAT-0136', name: 'Hugo Wouters', category: 'Waiting', amount: 389396 },
  { id: 'PAT-0137', name: 'Anna Dubois', category: 'Discharged', amount: 791475 },
  { id: 'PAT-0138', name: 'Elise Claes', category: 'Discharged', amount: 289157 },
  { id: 'PAT-0139', name: 'Ines Janssens', category: 'Referred', amount: 681719 },
  { id: 'PAT-0140', name: 'Ines Goossens', category: 'Referred', amount: 517498 },
  { id: 'PAT-0141', name: 'Elise Mertens', category: 'Outpatient', amount: 746779 },
  { id: 'PAT-0142', name: 'Bruno Willems', category: 'Admitted', amount: 224759 },
  { id: 'PAT-0143', name: 'Ines Janssens', category: 'Admitted', amount: 496949 },
  { id: 'PAT-0144', name: 'Jonas Jacobs', category: 'Waiting', amount: 978935 },
  { id: 'PAT-0145', name: 'Elise Peeters', category: 'Referred', amount: 53017 },
];

describe('PatientTable sorting', () => {
  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0142');
    cy.get('input[name=filter]').clear().type('pat-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0132');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0145');
    cy.get('input[name=filter]').clear().type('referred');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-5 of 5');
    cy.get('[data-testid=row]').should('have.length', 5);
  });

  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Ines');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
  });

  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('PAT-0135');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
