import { BookingBoard } from './BookingBoard';

describe('BookingBoard deleting 2', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<BookingBoard />);
    cy.get('input[name=new-card]').type('Label seville flint{enter}');
    cy.get('input[name=new-card]').type('Archive bergen solstice{enter}');
    cy.get('input[name=new-card]').type('LABEL SEVILLE FLINT{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"LABEL SEVILLE FLINT" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
