import { InvoiceBoard } from './InvoiceBoard';

describe('InvoiceBoard workflow', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<InvoiceBoard />);
    cy.get('input[name=new-card]').type('Test consulting flint{enter}');
    cy.get('input[name=new-card]').type('Audit setup birch{enter}');
    cy.get('input[name=card-filter]').clear().type('Audi');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
