import { TicketBoard } from './TicketBoard';

describe('TicketBoard columns', () => {
  it('moves 4 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Audit search cedar{enter}');
    cy.get('input[name=new-card]').type('Price webhook meadow{enter}');
    cy.get('input[name=new-card]').type('Archive invoice drift{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
    cy.get('input[name=new-card]').type('Price report jade{enter}');
    cy.get('input[name=new-card]').type('PRICE REPORT JADE{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"PRICE REPORT JADE" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 4);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 4 done');
  });
});
