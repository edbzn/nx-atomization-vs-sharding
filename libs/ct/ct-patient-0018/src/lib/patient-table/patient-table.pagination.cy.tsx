import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0011', name: 'Chloe Claes', category: 'Referred', amount: 945916 },
  { id: 'PAT-0012', name: 'Farid Jacobs', category: 'Discharged', amount: 488414 },
  { id: 'PAT-0013', name: 'Elise Wouters', category: 'Outpatient', amount: 826316 },
  { id: 'PAT-0014', name: 'Bruno Mertens', category: 'Waiting', amount: 715523 },
  { id: 'PAT-0015', name: 'Jonas Wouters', category: 'Waiting', amount: 661715 },
  { id: 'PAT-0016', name: 'Jonas Peeters', category: 'Outpatient', amount: 446086 },
  { id: 'PAT-0017', name: 'Jonas Goossens', category: 'Outpatient', amount: 535648 },
  { id: 'PAT-0018', name: 'Greta Peeters', category: 'Discharged', amount: 742186 },
  { id: 'PAT-0019', name: 'Elise Maes', category: 'Referred', amount: 578110 },
  { id: 'PAT-0020', name: 'Elise Claes', category: 'Discharged', amount: 930351 },
  { id: 'PAT-0021', name: 'Ines Willems', category: 'Waiting', amount: 6450 },
  { id: 'PAT-0022', name: 'Hugo Jacobs', category: 'Outpatient', amount: 158246 },
  { id: 'PAT-0023', name: 'Farid Goossens', category: 'Outpatient', amount: 744365 },
  { id: 'PAT-0024', name: 'Jonas Peeters', category: 'Discharged', amount: 555672 },
  { id: 'PAT-0025', name: 'Elise Jacobs', category: 'Referred', amount: 123600 },
  { id: 'PAT-0026', name: 'Ines Willems', category: 'Outpatient', amount: 35348 },
  { id: 'PAT-0027', name: 'Chloe Maes', category: 'Discharged', amount: 650961 },
  { id: 'PAT-0028', name: 'Chloe Peeters', category: 'Referred', amount: 991864 },
  { id: 'PAT-0029', name: 'Ines Maes', category: 'Waiting', amount: 524689 },
];

describe('PatientTable pagination', () => {
  it('filters, sorts and pages through 19 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('waiting');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear().type('pat-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear().type('dub');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0011');
  });

  it('filters, sorts and pages through 19 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('pat-001');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-9 of 9');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.contains('th button', 'Name').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-9 of 9');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0014');
  });

  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0011');
  });
});
