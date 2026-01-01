import { ProductBoard } from './ProductBoard';

describe('ProductBoard moving cards', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Ship lantern orbit{enter}');
    cy.get('input[name=new-card]').type('Review kettle birch{enter}');
    cy.get('button[aria-label="Start Ship lantern orbit"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Start Review kettle birch"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Pause Review kettle birch"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Pause Ship lantern orbit"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Start Ship lantern orbit"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });

  it('moves 1 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Plan clock birch{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
