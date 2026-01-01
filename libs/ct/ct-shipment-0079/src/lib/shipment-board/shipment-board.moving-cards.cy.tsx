import { ShipmentBoard } from './ShipmentBoard';

describe('ShipmentBoard moving cards', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<ShipmentBoard />);
    cy.get('input[name=new-card]').type('Label pallet willow{enter}');
    cy.get('input[name=new-card]').type('Review parcel quartz{enter}');
    cy.get('input[name=new-card]').type('Plan envelope pebble{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
