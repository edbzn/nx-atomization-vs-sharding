import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard columns', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Label setup summit{enter}');
    cy.get('input[name=new-card]').type('LABEL SETUP SUMMIT{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"LABEL SETUP SUMMIT" already exists');
    cy.get('input[name=new-card]').type('Archive audit harbor{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=card-filter]').clear().type('harb');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
