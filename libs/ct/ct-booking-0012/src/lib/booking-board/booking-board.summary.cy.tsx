import { BookingBoard } from './BookingBoard';

describe('BookingBoard summary', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<BookingBoard />);
    cy.get('input[name=new-card]').type('Fix seville quartz{enter}');
    cy.get('input[name=new-card]').type('Ship bruges delta{enter}');
    cy.get('input[name=card-filter]').clear().type('brug');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Start Ship bruges delta"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });

  it('moves 2 cards across the board', () => {
    cy.mount(<BookingBoard />);
    cy.get('input[name=new-card]').type('Test bruges zephyr{enter}');
    cy.get('input[name=new-card]').type('TEST BRUGES ZEPHYR{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"TEST BRUGES ZEPHYR" already exists');
    cy.get('input[name=new-card]').type('Test tallinn garnet{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });

  it('moves 1 cards across the board', () => {
    cy.mount(<BookingBoard />);
    cy.get('input[name=new-card]').type('Ship turin falcon{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
