import { BookingBoard } from './BookingBoard';

describe('BookingBoard duplicates 2', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<BookingBoard />);
    cy.get('input[name=new-card]').type('Audit krakow vale{enter}');
    cy.get('input[name=new-card]').type('Ship turin blaze{enter}');
    cy.get('button[aria-label="Start Audit krakow vale"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
