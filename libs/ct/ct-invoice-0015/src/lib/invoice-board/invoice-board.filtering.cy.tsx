import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard filtering', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Plan renewal indigo{enter}');
    cy.get('input[name=new-card]').type('PLAN RENEWAL INDIGO{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"PLAN RENEWAL INDIGO" already exists');
    cy.get('input[name=new-card]').type('Audit setup delta{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=new-card]').type('Test license solstice{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
  });
});
