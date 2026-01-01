import { TicketBoard } from './TicketBoard';

describe('TicketBoard filtering', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Fix upload iris{enter}');
    cy.get('input[name=new-card]').type('Draft search amber{enter}');
    cy.get('input[name=card-filter]').clear().type('uplo');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=new-card]').type('FIX UPLOAD IRIS{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"FIX UPLOAD IRIS" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
