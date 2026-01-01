import { TicketBoard } from './TicketBoard';

describe('TicketBoard filtering', () => {
  it('moves 1 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Label payment nova{enter}');
    cy.get('input[name=new-card]').type('LABEL PAYMENT NOVA{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"LABEL PAYMENT NOVA" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
