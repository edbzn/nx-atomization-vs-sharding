import { ProductBoard } from './ProductBoard';

describe('ProductBoard moving cards', () => {
  it('moves 4 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Review tray falcon{enter}');
    cy.get('input[name=new-card]').type('Archive bench velvet{enter}');
    cy.get('input[name=new-card]').type('Draft clock oak{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
    cy.get('input[name=new-card]').type('DRAFT CLOCK OAK{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"DRAFT CLOCK OAK" already exists');
    cy.get('input[name=new-card]').type('Audit kettle zinc{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 4);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 4 done');
  });
});
