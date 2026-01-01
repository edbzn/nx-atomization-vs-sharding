import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard filtering', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Plan training umber{enter}');
    cy.get('input[name=new-card]').type('Archive license apex{enter}');
    cy.get('input[name=new-card]').type('Price consulting jade{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
