import { PatientBoard } from './PatientBoard';

describe('PatientBoard filtering', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<PatientBoard />);
    cy.get('input[name=new-card]').type('Review janssens orbit{enter}');
    cy.get('input[name=new-card]').type('Draft jacobs summit{enter}');
    cy.get('button[aria-label="Start Draft jacobs summit"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
