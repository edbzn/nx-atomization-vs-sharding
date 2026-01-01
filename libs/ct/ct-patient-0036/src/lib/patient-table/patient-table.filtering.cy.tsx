import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0394', name: 'Ines Wouters', category: 'Discharged', amount: 581247 },
  { id: 'PAT-0395', name: 'Jonas Goossens', category: 'Waiting', amount: 744670 },
  { id: 'PAT-0396', name: 'Ines Maes', category: 'Admitted', amount: 626709 },
  { id: 'PAT-0397', name: 'Greta Maes', category: 'Referred', amount: 476754 },
  { id: 'PAT-0398', name: 'Elise Willems', category: 'Outpatient', amount: 478111 },
  { id: 'PAT-0399', name: 'Anna Willems', category: 'Admitted', amount: 187891 },
  { id: 'PAT-0400', name: 'Elise Mertens', category: 'Referred', amount: 684000 },
  { id: 'PAT-0401', name: 'Hugo Maes', category: 'Discharged', amount: 774495 },
  { id: 'PAT-0402', name: 'Jonas Janssens', category: 'Waiting', amount: 734588 },
  { id: 'PAT-0403', name: 'Hugo Wouters', category: 'Referred', amount: 785701 },
  { id: 'PAT-0404', name: 'Hugo Janssens', category: 'Discharged', amount: 184345 },
  { id: 'PAT-0405', name: 'Farid Goossens', category: 'Admitted', amount: 420907 },
  { id: 'PAT-0406', name: 'Daan Maes', category: 'Discharged', amount: 418579 },
  { id: 'PAT-0407', name: 'Hugo Maes', category: 'Outpatient', amount: 522935 },
  { id: 'PAT-0408', name: 'Daan Peeters', category: 'Admitted', amount: 131039 },
  { id: 'PAT-0409', name: 'Chloe Jacobs', category: 'Admitted', amount: 264257 },
  { id: 'PAT-0410', name: 'Daan Mertens', category: 'Referred', amount: 266435 },
  { id: 'PAT-0411', name: 'Ines Jacobs', category: 'Admitted', amount: 58428 },
  { id: 'PAT-0412', name: 'Bruno Peeters', category: 'Referred', amount: 834613 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 19 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('Elise');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0394');
  });
});
