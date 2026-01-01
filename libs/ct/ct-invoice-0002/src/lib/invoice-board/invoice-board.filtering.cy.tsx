import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard filtering', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Plan retainer flint{enter}');
    cy.get('input[name=new-card]').type('Review upgrade amber{enter}');
    cy.get('input[name=card-filter]').clear().type('Plan');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Delete Plan retainer flint"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
    cy.get('input[name=new-card]').type('Label retainer tundra{enter}');
    cy.get('input[name=card-filter]').clear();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });

  it('moves 1 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Archive setup orbit{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
