import { PatientBoard } from './PatientBoard';

describe('PatientBoard moving cards', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<PatientBoard />);
    cy.get('input[name=new-card]').type('Review claes sage{enter}');
    cy.get('input[name=new-card]').type('REVIEW CLAES SAGE{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"REVIEW CLAES SAGE" already exists');
    cy.get('input[name=new-card]').type('Fix jacobs lark{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Start Review claes sage"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
