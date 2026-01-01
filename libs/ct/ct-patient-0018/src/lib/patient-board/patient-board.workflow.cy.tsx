import { PatientBoard } from './PatientBoard';

describe('PatientBoard workflow', () => {
  it('moves 4 cards across the board', () => {
    cy.mount(<PatientBoard />);
    cy.get('input[name=new-card]').type('Audit maes vale{enter}');
    cy.get('input[name=new-card]').type('Plan wouters apex{enter}');
    cy.get('input[name=new-card]').type('Draft willems cobalt{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
    cy.get('input[name=new-card]').type('Draft peeters vale{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 4);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 4 done');
  });
});
