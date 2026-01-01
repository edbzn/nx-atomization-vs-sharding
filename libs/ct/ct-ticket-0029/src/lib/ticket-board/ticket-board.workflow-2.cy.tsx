import { TicketBoard } from './TicketBoard';

describe('TicketBoard workflow 2', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Draft webhook hazel{enter}');
    cy.get('input[name=new-card]').type('Draft sidebar indigo{enter}');
    cy.get('input[name=new-card]').type('Plan dashboard river{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
