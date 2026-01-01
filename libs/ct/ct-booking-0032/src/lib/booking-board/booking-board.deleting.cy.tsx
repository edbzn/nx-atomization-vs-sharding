import { BookingBoard } from './BookingBoard';

describe('BookingBoard deleting', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<BookingBoard />);
    cy.get('input[name=new-card]').type('Draft lyon apex{enter}');
    cy.get('input[name=new-card]').type('Draft lyon cobalt{enter}');
    cy.get('button[aria-label="Start Draft lyon apex"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
