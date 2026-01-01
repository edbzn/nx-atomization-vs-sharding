import { ShipmentBoard } from './ShipmentBoard';

describe('ShipmentBoard moving cards', () => {
  it('moves 1 cards across the board', () => {
    cy.mount(<ShipmentBoard />);
    cy.get('input[name=new-card]').type('Test box maple{enter}');
    cy.get('input[name=new-card]').type('Draft bundle summit{enter}');
    cy.get('button[aria-label="Delete Draft bundle summit"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });

  it('moves 2 cards across the board', () => {
    cy.mount(<ShipmentBoard />);
    cy.get('input[name=new-card]').type('Archive tube aurora{enter}');
    cy.get('input[name=new-card]').type('Plan crate falcon{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
