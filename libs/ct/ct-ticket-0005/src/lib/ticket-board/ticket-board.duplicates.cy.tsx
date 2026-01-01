import { TicketBoard } from './TicketBoard';

describe('TicketBoard duplicates', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Label sidebar garnet{enter}');
    cy.get('input[name=new-card]').type('Draft sidebar glade{enter}');
    cy.get('button[aria-label="Delete Label sidebar garnet"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
    cy.get('input[name=new-card]').type('Plan login mesa{enter}');
    cy.get('input[name=new-card]').type('Archive search drift{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
