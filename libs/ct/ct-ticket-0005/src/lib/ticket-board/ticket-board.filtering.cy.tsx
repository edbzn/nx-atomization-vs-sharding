import { TicketBoard } from './TicketBoard';

describe('TicketBoard filtering', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Archive webhook atlas{enter}');
    cy.get('input[name=new-card]').type('ARCHIVE WEBHOOK ATLAS{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"ARCHIVE WEBHOOK ATLAS" already exists');
    cy.get('input[name=new-card]').type('Draft export garnet{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });

  it('moves 3 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Audit payment velvet{enter}');
    cy.get('input[name=new-card]').type('Test webhook river{enter}');
    cy.get('input[name=new-card]').type('Audit invoice nectar{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
