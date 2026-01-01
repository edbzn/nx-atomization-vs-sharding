import { ProductBoard } from './ProductBoard';

describe('ProductBoard deleting', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Archive lamp river{enter}');
    cy.get('input[name=new-card]').type('Plan lantern iris{enter}');
    cy.get('button[aria-label="Delete Plan lantern iris"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
    cy.get('input[name=new-card]').type('ARCHIVE LAMP RIVER{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"ARCHIVE LAMP RIVER" already exists');
    cy.get('input[name=new-card]').type('Label clock blaze{enter}');
    cy.get('input[name=card-filter]').clear().type('Labe');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=new-card]').type('LABEL CLOCK BLAZE{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"LABEL CLOCK BLAZE" already exists');
    cy.get('input[name=card-filter]').clear();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });

  it('moves 1 cards across the board', () => {
    cy.mount(<ProductBoard />);
    cy.get('input[name=new-card]').type('Plan bench velvet{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
