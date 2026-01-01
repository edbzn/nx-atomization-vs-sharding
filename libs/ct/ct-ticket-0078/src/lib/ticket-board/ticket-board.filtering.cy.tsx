import { TicketBoard } from './TicketBoard';

describe('TicketBoard filtering', () => {
  it('moves 2 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Review upload prism{enter}');
    cy.get('input[name=new-card]').type('Audit report hazel{enter}');
    cy.get('button[aria-label="Start Review upload prism"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=new-card]').type('AUDIT REPORT HAZEL{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"AUDIT REPORT HAZEL" already exists');
    cy.get('input[name=new-card]').type('Label payment tide{enter}');
    cy.get('button[aria-label="Delete Audit report hazel"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
  });
});
