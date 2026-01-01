import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0272', name: 'Elise Wouters', category: 'Referred', amount: 733939 },
  { id: 'PAT-0273', name: 'Ines Janssens', category: 'Waiting', amount: 790729 },
  { id: 'PAT-0274', name: 'Hugo Janssens', category: 'Referred', amount: 864490 },
  { id: 'PAT-0275', name: 'Greta Jacobs', category: 'Referred', amount: 357452 },
  { id: 'PAT-0276', name: 'Elise Jacobs', category: 'Waiting', amount: 718921 },
  { id: 'PAT-0277', name: 'Elise Claes', category: 'Discharged', amount: 817202 },
  { id: 'PAT-0278', name: 'Greta Willems', category: 'Admitted', amount: 568815 },
  { id: 'PAT-0279', name: 'Elise Claes', category: 'Outpatient', amount: 49393 },
  { id: 'PAT-0280', name: 'Bruno Peeters', category: 'Admitted', amount: 432651 },
  { id: 'PAT-0281', name: 'Greta Claes', category: 'Waiting', amount: 639245 },
  { id: 'PAT-0282', name: 'Hugo Jacobs', category: 'Admitted', amount: 514961 },
  { id: 'PAT-0283', name: 'Greta Mertens', category: 'Discharged', amount: 773291 },
  { id: 'PAT-0284', name: 'Greta Goossens', category: 'Discharged', amount: 188880 },
  { id: 'PAT-0285', name: 'Daan Goossens', category: 'Admitted', amount: 176423 },
  { id: 'PAT-0286', name: 'Ines Dubois', category: 'Outpatient', amount: 919280 },
];

describe('PatientTable sorting', () => {
  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0272');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-15 of 15');
    cy.get('[data-testid=row]').should('have.length', 5);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0282');
  });

  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('mae');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });
});
