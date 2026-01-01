import { PatientBoard } from './PatientBoard';

describe('PatientBoard filtering', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<PatientBoard />);
    cy.get('input[name=new-card]').type('Fix jacobs nectar{enter}');
    cy.get('input[name=new-card]').type('Price claes zephyr{enter}');
    cy.get('button[aria-label="Start Price claes zephyr"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });

  it('moves 2 cards across the board', () => {
    cy.mount(<PatientBoard />);
    cy.get('input[name=new-card]').type('Audit maes vale{enter}');
    cy.get('input[name=new-card]').type('AUDIT MAES VALE{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"AUDIT MAES VALE" already exists');
    cy.get('input[name=new-card]').type('Plan mertens flint{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
