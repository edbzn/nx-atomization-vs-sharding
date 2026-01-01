import { BookingBoard } from './BookingBoard';

describe('BookingBoard moving cards', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<BookingBoard />);
    cy.get('input[name=new-card]').type('Audit porto zinc{enter}');
    cy.get('input[name=new-card]').type('Plan porto frost{enter}');
    cy.get('input[name=new-card]').type('Archive krakow ridge{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
