import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard summary', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Review audit onyx{enter}');
    cy.get('input[name=new-card]').type('REVIEW AUDIT ONYX{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"REVIEW AUDIT ONYX" already exists');
    cy.get('input[name=new-card]').type('Archive upgrade ember{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=new-card]').type('Label renewal zinc{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });

  it('moves 2 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Audit training indigo{enter}');
    cy.get('input[name=new-card]').type('Draft audit ember{enter}');
    cy.get('input[name=card-filter]').clear().type('Draf');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
