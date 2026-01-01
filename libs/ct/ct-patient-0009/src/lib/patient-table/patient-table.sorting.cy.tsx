import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0228', name: 'Jonas Dubois', category: 'Discharged', amount: 798341 },
  { id: 'PAT-0229', name: 'Ines Maes', category: 'Discharged', amount: 777070 },
  { id: 'PAT-0230', name: 'Greta Claes', category: 'Referred', amount: 615753 },
  { id: 'PAT-0231', name: 'Farid Peeters', category: 'Referred', amount: 673464 },
  { id: 'PAT-0232', name: 'Elise Maes', category: 'Waiting', amount: 282862 },
  { id: 'PAT-0233', name: 'Daan Janssens', category: 'Discharged', amount: 431219 },
  { id: 'PAT-0234', name: 'Farid Peeters', category: 'Waiting', amount: 677677 },
  { id: 'PAT-0235', name: 'Hugo Willems', category: 'Admitted', amount: 282280 },
  { id: 'PAT-0236', name: 'Chloe Jacobs', category: 'Discharged', amount: 194180 },
  { id: 'PAT-0237', name: 'Anna Claes', category: 'Outpatient', amount: 352060 },
  { id: 'PAT-0238', name: 'Jonas Peeters', category: 'Outpatient', amount: 703866 },
  { id: 'PAT-0239', name: 'Jonas Peeters', category: 'Outpatient', amount: 19517 },
  { id: 'PAT-0240', name: 'Daan Jacobs', category: 'Referred', amount: 184138 },
  { id: 'PAT-0241', name: 'Chloe Dubois', category: 'Waiting', amount: 706008 },
  { id: 'PAT-0242', name: 'Bruno Janssens', category: 'Outpatient', amount: 579039 },
  { id: 'PAT-0243', name: 'Anna Janssens', category: 'Admitted', amount: 97264 },
  { id: 'PAT-0244', name: 'Bruno Mertens', category: 'Referred', amount: 384462 },
  { id: 'PAT-0245', name: 'Bruno Mertens', category: 'Waiting', amount: 856825 },
  { id: 'PAT-0246', name: 'Elise Janssens', category: 'Referred', amount: 919191 },
];

describe('PatientTable sorting', () => {
  it('filters, sorts and pages through 19 patients', () => {
    const rows = ROWS;
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('pee');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear().type('Fari');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-2 of 2');
    cy.get('[data-testid=row]').should('have.length', 2);
    cy.get('input[name=filter]').clear().type('pat-001');
    cy.get('[data-testid=table-status]').should('have.text', 'No results');
    cy.get('[data-testid=row]').should('have.length', 0);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0228');
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0239');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-19 of 19');
    cy.get('[data-testid=row]').should('have.length', 9);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0230');
    cy.get('input[name=filter]').clear().type('janss');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.contains('th button', 'Amount').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0246');
    cy.get('input[name=filter]').clear().type('PAT-0246');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
    cy.get('input[name=filter]').clear().type('jans');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 19');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0246');
  });

  it('filters, sorts and pages through 13 patients', () => {
    const rows = ROWS.slice(0, 13);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 13');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('admitted');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-1 of 1');
    cy.get('[data-testid=row]').should('have.length', 1);
  });
});
