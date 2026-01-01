import { ProductBoard } from './ProductBoard';

describe('ProductBoard workflow', () => {
  it('moves 1 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Fix lantern fern{enter}');
    cy.get('input[name=new-card]').type('FIX LANTERN FERN{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"FIX LANTERN FERN" already exists');
    cy.get('input[name=new-card]').type('FIX LANTERN FERN{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"FIX LANTERN FERN" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });

  it('moves 1 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Ship shelf pebble{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
