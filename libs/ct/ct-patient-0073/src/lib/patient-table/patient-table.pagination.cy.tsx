import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0321', name: 'Jonas Wouters', category: 'Discharged', amount: 552774 },
  { id: 'PAT-0322', name: 'Jonas Dubois', category: 'Discharged', amount: 882845 },
  { id: 'PAT-0323', name: 'Jonas Jacobs', category: 'Outpatient', amount: 925242 },
  { id: 'PAT-0324', name: 'Bruno Wouters', category: 'Admitted', amount: 145529 },
  { id: 'PAT-0325', name: 'Farid Willems', category: 'Outpatient', amount: 918675 },
  { id: 'PAT-0326', name: 'Jonas Goossens', category: 'Discharged', amount: 188882 },
  { id: 'PAT-0327', name: 'Anna Mertens', category: 'Waiting', amount: 16916 },
  { id: 'PAT-0328', name: 'Elise Claes', category: 'Waiting', amount: 898076 },
  { id: 'PAT-0329', name: 'Ines Goossens', category: 'Admitted', amount: 82945 },
  { id: 'PAT-0330', name: 'Greta Peeters', category: 'Waiting', amount: 836234 },
  { id: 'PAT-0331', name: 'Daan Mertens', category: 'Waiting', amount: 414914 },
  { id: 'PAT-0332', name: 'Daan Willems', category: 'Referred', amount: 880297 },
  { id: 'PAT-0333', name: 'Daan Maes', category: 'Admitted', amount: 165284 },
  { id: 'PAT-0334', name: 'Elise Maes', category: 'Referred', amount: 663269 },
  { id: 'PAT-0335', name: 'Ines Peeters', category: 'Outpatient', amount: 410254 },
  { id: 'PAT-0336', name: 'Bruno Mertens', category: 'Admitted', amount: 507053 },
  { id: 'PAT-0337', name: 'Chloe Mertens', category: 'Referred', amount: 832778 },
];

describe('PatientTable pagination', () => {
  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0327');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0321');
    cy.get('input[name=filter]').clear().type('goosse');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
  });

  it('filters, sorts and pages through 14 patients', () => {
    const rows = ROWS.slice(0, 14);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 14');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-14 of 14');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0331');
  });
});
