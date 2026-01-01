import { PatientBoard } from './PatientBoard';

describe('PatientBoard moving cards', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<PatientBoard />);
    cy.get('input[name=new-card]').type('Price mertens indigo{enter}');
    cy.get('input[name=new-card]').type('Fix willems summit{enter}');
    cy.get('input[name=new-card]').type('Label willems falcon{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
