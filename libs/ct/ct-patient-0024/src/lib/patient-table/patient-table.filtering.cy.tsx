import { PatientTable } from './PatientTable';
import type { PatientRow } from '../types';

const ROWS: PatientRow[] = [
  { id: 'PAT-0367', name: 'Hugo Claes', category: 'Admitted', amount: 489406 },
  { id: 'PAT-0368', name: 'Elise Willems', category: 'Discharged', amount: 461691 },
  { id: 'PAT-0369', name: 'Elise Janssens', category: 'Discharged', amount: 721321 },
  { id: 'PAT-0370', name: 'Chloe Jacobs', category: 'Waiting', amount: 31390 },
  { id: 'PAT-0371', name: 'Jonas Jacobs', category: 'Outpatient', amount: 535192 },
  { id: 'PAT-0372', name: 'Elise Wouters', category: 'Outpatient', amount: 192028 },
  { id: 'PAT-0373', name: 'Ines Mertens', category: 'Referred', amount: 932138 },
  { id: 'PAT-0374', name: 'Chloe Jacobs', category: 'Referred', amount: 143914 },
  { id: 'PAT-0375', name: 'Jonas Goossens', category: 'Referred', amount: 33895 },
  { id: 'PAT-0376', name: 'Elise Dubois', category: 'Outpatient', amount: 25181 },
  { id: 'PAT-0377', name: 'Farid Wouters', category: 'Waiting', amount: 533049 },
  { id: 'PAT-0378', name: 'Anna Goossens', category: 'Discharged', amount: 730912 },
  { id: 'PAT-0379', name: 'Farid Jacobs', category: 'Waiting', amount: 407948 },
  { id: 'PAT-0380', name: 'Hugo Janssens', category: 'Outpatient', amount: 737490 },
  { id: 'PAT-0381', name: 'Farid Dubois', category: 'Outpatient', amount: 643848 },
  { id: 'PAT-0382', name: 'Greta Peeters', category: 'Referred', amount: 619505 },
  { id: 'PAT-0383', name: 'Anna Peeters', category: 'Discharged', amount: 831644 },
  { id: 'PAT-0384', name: 'Farid Dubois', category: 'Outpatient', amount: 537089 },
  { id: 'PAT-0385', name: 'Hugo Maes', category: 'Waiting', amount: 677272 },
];

describe('PatientTable filtering', () => {
  it('filters, sorts and pages through 18 patients', () => {
    const rows = ROWS.slice(0, 18);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 11-18 of 18');
    cy.get('[data-testid=row]').should('have.length', 8);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0377');
    cy.contains('button', 'Previous').click();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0367');
    cy.get('input[name=filter]').clear();
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 18');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('[data-testid=row]').first().should('contain.text', 'PAT-0367');
  });

  it('filters, sorts and pages through 17 patients', () => {
    const rows = ROWS.slice(0, 17);
    cy.mount(<PatientTable rows={rows} />);
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-10 of 17');
    cy.get('[data-testid=row]').should('have.length', 10);
    cy.get('input[name=filter]').clear().type('referred');
    cy.get('[data-testid=table-status]').should('have.text', 'Showing 1-4 of 4');
    cy.get('[data-testid=row]').should('have.length', 4);
  });
});
