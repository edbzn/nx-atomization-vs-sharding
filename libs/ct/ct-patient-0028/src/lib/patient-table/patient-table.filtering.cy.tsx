import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0089', name: 'Bruno Wouters', category: 'Admitted', amount: 591189 },
  { id: 'PAT-0090', name: 'Chloe Mertens', category: 'Admitted', amount: 779669 },
  { id: 'PAT-0091', name: 'Bruno Claes', category: 'Discharged', amount: 662693 },
  { id: 'PAT-0092', name: 'Chloe Claes', category: 'Discharged', amount: 77048 },
  { id: 'PAT-0093', name: 'Anna Dubois', category: 'Discharged', amount: 634939 },
  { id: 'PAT-0094', name: 'Bruno Willems', category: 'Waiting', amount: 271092 },
  { id: 'PAT-0095', name: 'Farid Janssens', category: 'Outpatient', amount: 204165 },
  { id: 'PAT-0096', name: 'Elise Dubois', category: 'Waiting', amount: 577824 },
  { id: 'PAT-0097', name: 'Jonas Maes', category: 'Discharged', amount: 790419 },
  { id: 'PAT-0098', name: 'Jonas Goossens', category: 'Admitted', amount: 234450 },
  { id: 'PAT-0099', name: 'Elise Jacobs', category: 'Admitted', amount: 581735 },
  { id: 'PAT-0100', name: 'Bruno Peeters', category: 'Admitted', amount: 717183 },
  { id: 'PAT-0101', name: 'Anna Dubois', category: 'Referred', amount: 267278 },
  { id: 'PAT-0102', name: 'Farid Mertens', category: 'Waiting', amount: 932853 },
  { id: 'PAT-0103', name: 'Jonas Dubois', category: 'Admitted', amount: 960263 },
  { id: 'PAT-0104', name: 'Bruno Janssens', category: 'Referred', amount: 57709 },
  { id: 'PAT-0105', name: 'Anna Maes', category: 'Admitted', amount: 288419 },
  { id: 'PAT-0106', name: 'Jonas Goossens', category: 'Referred', amount: 882069 },
  { id: 'PAT-0107', name: 'Elise Willems', category: 'Admitted', amount: 637916 },
  { id: 'PAT-0108', name: 'Hugo Jacobs', category: 'Admitted', amount: 518869 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 20 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('dub');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0089');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0104');
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0089');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0104');
  });

  it('filters, sorts and pages through 20 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0093');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-20 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0096');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 20');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0093');
  });

  it('filters, sorts and pages through 15 patients', () => {
    const rows = ROWS.slice(0, 15);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 15');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('PAT-0094');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
