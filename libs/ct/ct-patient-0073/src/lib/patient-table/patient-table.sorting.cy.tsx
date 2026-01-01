import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0222', name: 'Jonas Wouters', category: 'Waiting', amount: 7024 },
  { id: 'PAT-0223', name: 'Greta Dubois', category: 'Admitted', amount: 63698 },
  { id: 'PAT-0224', name: 'Greta Janssens', category: 'Outpatient', amount: 246049 },
  { id: 'PAT-0225', name: 'Jonas Mertens', category: 'Outpatient', amount: 810949 },
  { id: 'PAT-0226', name: 'Hugo Jacobs', category: 'Waiting', amount: 617827 },
  { id: 'PAT-0227', name: 'Anna Dubois', category: 'Admitted', amount: 289466 },
  { id: 'PAT-0228', name: 'Hugo Jacobs', category: 'Referred', amount: 60077 },
  { id: 'PAT-0229', name: 'Greta Willems', category: 'Waiting', amount: 327478 },
  { id: 'PAT-0230', name: 'Daan Maes', category: 'Waiting', amount: 857504 },
  { id: 'PAT-0231', name: 'Anna Dubois', category: 'Outpatient', amount: 111620 },
  { id: 'PAT-0232', name: 'Chloe Willems', category: 'Waiting', amount: 641702 },
  { id: 'PAT-0233', name: 'Elise Janssens', category: 'Admitted', amount: 983259 },
  { id: 'PAT-0234', name: 'Greta Peeters', category: 'Referred', amount: 598646 },
  { id: 'PAT-0235', name: 'Daan Jacobs', category: 'Discharged', amount: 147515 },
];

describe('PatientTable sorting', () => {
  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0222');
    cy.get('input[name=filter]').clear().type('Daan');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });

  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('discharged');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
