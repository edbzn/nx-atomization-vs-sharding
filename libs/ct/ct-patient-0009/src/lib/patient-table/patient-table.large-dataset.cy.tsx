import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0157', name: 'Bruno Claes', category: 'Referred', amount: 99381 },
  { id: 'PAT-0158', name: 'Chloe Claes', category: 'Waiting', amount: 415147 },
  { id: 'PAT-0159', name: 'Chloe Janssens', category: 'Referred', amount: 945865 },
  { id: 'PAT-0160', name: 'Greta Peeters', category: 'Admitted', amount: 215377 },
  { id: 'PAT-0161', name: 'Greta Janssens', category: 'Outpatient', amount: 464679 },
  { id: 'PAT-0162', name: 'Jonas Peeters', category: 'Discharged', amount: 294710 },
  { id: 'PAT-0163', name: 'Farid Jacobs', category: 'Outpatient', amount: 913840 },
  { id: 'PAT-0164', name: 'Farid Peeters', category: 'Outpatient', amount: 202574 },
  { id: 'PAT-0165', name: 'Bruno Maes', category: 'Discharged', amount: 194060 },
  { id: 'PAT-0166', name: 'Farid Dubois', category: 'Waiting', amount: 181106 },
  { id: 'PAT-0167', name: 'Farid Peeters', category: 'Admitted', amount: 833519 },
  { id: 'PAT-0168', name: 'Ines Wouters', category: 'Waiting', amount: 608243 },
  { id: 'PAT-0169', name: 'Ines Wouters', category: 'Waiting', amount: 827791 },
  { id: 'PAT-0170', name: 'Jonas Willems', category: 'Referred', amount: 515508 },
  { id: 'PAT-0171', name: 'Farid Janssens', category: 'Outpatient', amount: 902643 },
  { id: 'PAT-0172', name: 'Jonas Goossens', category: 'Outpatient', amount: 889953 },
  { id: 'PAT-0173', name: 'Anna Janssens', category: 'Waiting', amount: 98973 },
  { id: 'PAT-0174', name: 'Farid Dubois', category: 'Waiting', amount: 620931 },
  { id: 'PAT-0175', name: 'Bruno Wouters', category: 'Outpatient', amount: 734047 },
];

describe('PatientTable large dataset', () => {
  it('filters, sorts and pages through 19 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0167');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0167');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0157');
  });

  it('filters, sorts and pages through 19 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('janss');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear().type('PAT-0158');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
