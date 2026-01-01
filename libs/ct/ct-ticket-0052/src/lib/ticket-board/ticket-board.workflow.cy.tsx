import { TicketBoard } from './TicketBoard';

describe('TicketBoard workflow', () => {
  it('moves 4 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Fix report onyx{enter}');
    cy.get('input[name=new-card]').type('Draft export mesa{enter}');
    cy.get('input[name=new-card]').type('Test report jade{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
    cy.get('input[name=new-card]').type('Audit export cedar{enter}');
    cy.get('input[name=card-filter]').clear().type('repo');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 4 done');
  });
});
