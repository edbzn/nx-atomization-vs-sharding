import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0005', name: 'Farid Peeters', category: 'Outpatient', amount: 859459 },
  { id: 'PAT-0006', name: 'Hugo Mertens', category: 'Referred', amount: 555767 },
  { id: 'PAT-0007', name: 'Hugo Janssens', category: 'Admitted', amount: 422223 },
  { id: 'PAT-0008', name: 'Hugo Maes', category: 'Admitted', amount: 277695 },
  { id: 'PAT-0009', name: 'Greta Janssens', category: 'Referred', amount: 918398 },
  { id: 'PAT-0010', name: 'Daan Goossens', category: 'Waiting', amount: 314294 },
  { id: 'PAT-0011', name: 'Ines Maes', category: 'Referred', amount: 890963 },
  { id: 'PAT-0012', name: 'Daan Wouters', category: 'Discharged', amount: 463451 },
  { id: 'PAT-0013', name: 'Jonas Peeters', category: 'Outpatient', amount: 860688 },
  { id: 'PAT-0014', name: 'Daan Claes', category: 'Admitted', amount: 955119 },
  { id: 'PAT-0015', name: 'Hugo Dubois', category: 'Discharged', amount: 166372 },
  { id: 'PAT-0016', name: 'Jonas Goossens', category: 'Admitted', amount: 929199 },
  { id: 'PAT-0017', name: 'Hugo Mertens', category: 'Outpatient', amount: 831982 },
  { id: 'PAT-0018', name: 'Chloe Janssens', category: 'Discharged', amount: 813185 },
  { id: 'PAT-0019', name: 'Farid Willems', category: 'Discharged', amount: 34341 },
  { id: 'PAT-0020', name: 'Hugo Jacobs', category: 'Referred', amount: 606395 },
  { id: 'PAT-0021', name: 'Bruno Janssens', category: 'Admitted', amount: 464089 },
];

describe('PatientTable empty results', () => {
  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0015');
    cy.get('input[name=filter]').clear().type('PAT-0015');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0015');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0021');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0007');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0013');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0019');
    cy.get('input[name=filter]').clear().type('mert');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0006');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0021');
  });

  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0021');
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0013');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0013');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-17 of 17');
    cy.get('[data-testid=row]').should('have.length', 7);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0019');
  });
});
