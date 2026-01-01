import { ShipmentBoard } from './ShipmentBoard';

describe('ShipmentBoard workflow', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<ShipmentBoard />);
    cy.get('input[name=new-card]').type('Plan sack delta{enter}');
    cy.get('input[name=new-card]').type('Test drum raven{enter}');
    cy.get('button[aria-label="Start Plan sack delta"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=card-filter]').clear().type('Plan');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=new-card]').type('Draft bundle sage{enter}');
    cy.get('input[name=new-card]').type('DRAFT BUNDLE SAGE{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"DRAFT BUNDLE SAGE" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
