import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard duplicates', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Ship renewal alpha{enter}');
    cy.get('input[name=new-card]').type('Draft license quartz{enter}');
    cy.get('input[name=new-card]').type('Review renewal sage{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
