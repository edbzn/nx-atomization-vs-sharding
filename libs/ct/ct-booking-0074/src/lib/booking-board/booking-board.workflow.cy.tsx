import { BookingBoard } from './BookingBoard';

describe('BookingBoard workflow', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<BookingBoard />);
    cy.get('input[name=new-card]').type('Plan porto prism{enter}');
    cy.get('input[name=new-card]').type('PLAN PORTO PRISM{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"PLAN PORTO PRISM" already exists');
    cy.get('input[name=new-card]').type('PLAN PORTO PRISM{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"PLAN PORTO PRISM" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
    cy.get('input[name=new-card]').type('Label porto kestrel{enter}');
    cy.get('button[aria-label="Start Plan porto prism"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
