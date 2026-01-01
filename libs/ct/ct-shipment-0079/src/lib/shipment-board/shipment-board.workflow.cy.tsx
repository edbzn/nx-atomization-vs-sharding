import { ShipmentBoard } from './ShipmentBoard';

describe('ShipmentBoard workflow', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<ShipmentBoard />);
    cy.get('input[name=new-card]').type('Review tube solstice{enter}');
    cy.get('input[name=new-card]').type('Ship crate glade{enter}');
    cy.get('input[name=card-filter]').clear().type('sols');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=new-card]').type('Plan sack solstice{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
