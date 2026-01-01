import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard moving cards', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Archive upgrade mesa{enter}');
    cy.get('input[name=new-card]').type('Price hosting iris{enter}');
    cy.get('button[aria-label="Start Price hosting iris"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
