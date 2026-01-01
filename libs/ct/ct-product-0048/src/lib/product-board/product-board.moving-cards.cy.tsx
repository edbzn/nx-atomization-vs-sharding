import { ProductBoard } from './ProductBoard';

describe('ProductBoard moving cards', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Review kettle aurora{enter}');
    cy.get('input[name=new-card]').type('Audit clock comet{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
