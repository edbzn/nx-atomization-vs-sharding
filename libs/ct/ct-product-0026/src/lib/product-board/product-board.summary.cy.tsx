import { ProductBoard } from './ProductBoard';

describe('ProductBoard summary', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Fix planter lark{enter}');
    cy.get('input[name=new-card]').type('Price clock garnet{enter}');
    cy.get('button[aria-label="Start Fix planter lark"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });

  it('moves 1 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Review lantern prism{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
