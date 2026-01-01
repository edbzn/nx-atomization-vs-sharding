import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0034', name: 'Chloe Willems', category: 'Admitted', amount: 960803 },
  { id: 'PAT-0035', name: 'Anna Maes', category: 'Waiting', amount: 793781 },
  { id: 'PAT-0036', name: 'Ines Claes', category: 'Referred', amount: 677570 },
  { id: 'PAT-0037', name: 'Chloe Maes', category: 'Referred', amount: 97476 },
  { id: 'PAT-0038', name: 'Chloe Peeters', category: 'Outpatient', amount: 366291 },
  { id: 'PAT-0039', name: 'Anna Maes', category: 'Outpatient', amount: 308805 },
  { id: 'PAT-0040', name: 'Greta Jacobs', category: 'Discharged', amount: 570577 },
  { id: 'PAT-0041', name: 'Anna Jacobs', category: 'Admitted', amount: 28412 },
  { id: 'PAT-0042', name: 'Farid Wouters', category: 'Outpatient', amount: 880231 },
  { id: 'PAT-0043', name: 'Bruno Maes', category: 'Outpatient', amount: 481151 },
  { id: 'PAT-0044', name: 'Hugo Goossens', category: 'Outpatient', amount: 172651 },
  { id: 'PAT-0045', name: 'Elise Willems', category: 'Admitted', amount: 388234 },
  { id: 'PAT-0046', name: 'Farid Claes', category: 'Discharged', amount: 734634 },
];

describe('PatientTable pagination', () => {
  it('filters, sorts and pages through 13 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0044');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0034');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0034');
    cy.get('input[name=filter]').clear().type('pat-000');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
  });

  it('filters, sorts and pages through 13 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0044');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0034');
  });

  it('filters, sorts and pages through 13 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-13 of 13');
    cy.get('[data-testid=row]').should('have.length', 3);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0044');
  });
});
