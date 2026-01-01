import { TicketBoard } from './TicketBoard';

describe('TicketBoard deleting', () => {
  it('moves 1 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Plan dashboard lumen{enter}');
    cy.get('input[name=new-card]').type('PLAN DASHBOARD LUMEN{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"PLAN DASHBOARD LUMEN" already exists');
    cy.get('input[name=new-card]').type('PLAN DASHBOARD LUMEN{enter}');
    cy.get('[data-testid=board-message]').should('have.text', '"PLAN DASHBOARD LUMEN" already exists');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 1 done');
  });
});
