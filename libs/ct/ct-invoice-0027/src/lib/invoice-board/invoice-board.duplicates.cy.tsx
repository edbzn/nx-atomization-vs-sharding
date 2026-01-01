import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard duplicates', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Price consulting coral{enter}');
    cy.get('input[name=new-card]').type('Fix support hazel{enter}');
    cy.get('input[name=new-card]').type('FIX SUPPORT HAZEL{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"FIX SUPPORT HAZEL" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
