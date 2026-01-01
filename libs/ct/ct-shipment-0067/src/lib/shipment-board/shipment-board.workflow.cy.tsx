import { ShipmentBoard } from './ShipmentBoard';

describe('ShipmentBoard workflow', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<ShipmentBoard />);
    cy.get('input[name=new-card]').type('Audit crate ridge{enter}');
    cy.get('input[name=new-card]').type('Label crate river{enter}');
    cy.get('input[name=card-filter]').clear().type('Labe');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });

  it('moves 1 cards across the board', () => {
    cy.mount(<ShipmentBoard />);
    cy.get('input[name=new-card]').type('Archive bundle pebble{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
