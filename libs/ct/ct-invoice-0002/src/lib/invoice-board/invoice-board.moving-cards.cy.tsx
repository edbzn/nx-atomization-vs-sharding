import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard moving cards', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Label renewal quartz{enter}');
    cy.get('input[name=new-card]').type('Archive hosting solstice{enter}');
    cy.get('button[aria-label="Delete Archive hosting solstice"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
    cy.get('input[name=new-card]').type('Test renewal sable{enter}');
    cy.get('button[aria-label="Start Test renewal sable"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
