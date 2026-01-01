import { PatientBoard } from './PatientBoard';

describe('PatientBoard workflow', () => {
  it('moves 1 cards across the board', () => {
    cy.mount(<PatientBoard />);
    cy.get('input[name=new-card]').type('Archive maes iris{enter}');
    cy.get('input[name=new-card]').type('ARCHIVE MAES IRIS{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"ARCHIVE MAES IRIS" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
