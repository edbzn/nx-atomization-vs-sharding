import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard workflow', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Review support cedar{enter}');
    cy.get('input[name=new-card]').type('REVIEW SUPPORT CEDAR{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"REVIEW SUPPORT CEDAR" already exists');
    cy.get('input[name=new-card]').type('Price renewal kestrel{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
