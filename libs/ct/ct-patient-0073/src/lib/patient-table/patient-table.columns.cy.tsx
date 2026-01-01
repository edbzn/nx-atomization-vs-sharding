import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0084', name: 'Elise Wouters', category: 'Admitted', amount: 641285 },
  { id: 'PAT-0085', name: 'Chloe Peeters', category: 'Waiting', amount: 162172 },
  { id: 'PAT-0086', name: 'Greta Janssens', category: 'Admitted', amount: 837203 },
  { id: 'PAT-0087', name: 'Anna Mertens', category: 'Waiting', amount: 9617 },
  { id: 'PAT-0088', name: 'Greta Janssens', category: 'Discharged', amount: 83009 },
  { id: 'PAT-0089', name: 'Hugo Goossens', category: 'Discharged', amount: 290944 },
  { id: 'PAT-0090', name: 'Farid Peeters', category: 'Waiting', amount: 730113 },
  { id: 'PAT-0091', name: 'Anna Claes', category: 'Referred', amount: 502542 },
  { id: 'PAT-0092', name: 'Farid Janssens', category: 'Admitted', amount: 36143 },
  { id: 'PAT-0093', name: 'Ines Willems', category: 'Referred', amount: 946835 },
  { id: 'PAT-0094', name: 'Daan Maes', category: 'Admitted', amount: 865808 },
  { id: 'PAT-0095', name: 'Chloe Goossens', category: 'Referred', amount: 788291 },
  { id: 'PAT-0096', name: 'Farid Jacobs', category: 'Waiting', amount: 446465 },
  { id: 'PAT-0097', name: 'Farid Maes', category: 'Referred', amount: 837679 },
  { id: 'PAT-0098', name: 'Chloe Maes', category: 'Referred', amount: 691656 },
  { id: 'PAT-0099', name: 'Jonas Wouters', category: 'Outpatient', amount: 216219 },
];

describe('PatientTable columns', () => {
  it('filters, sorts and pages through 16 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0084');
    cy.get('input[name=filter]').clear().type('pat-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('Farid');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.contains('th button', 'Reference').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0090');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0092');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0087');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0090');
    cy.get('input[name=filter]').clear().type('PAT-0092');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });

  it('filters, sorts and pages through 16 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-16 of 16');
    cy.get('[data-testid=row]').should('have.length', 6);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0094');
    cy.get('input[name=filter]').clear().type('maes');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-3 of 3');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0084');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 16');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0091');
    cy.get('input[name=filter]').clear().type('outpatient');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
