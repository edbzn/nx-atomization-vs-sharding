import { TicketBoard } from './TicketBoard';

describe('TicketBoard filtering', () => {
  it('moves 5 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Test invoice falcon{enter}');
    cy.get('input[name=new-card]').type('Fix export cobalt{enter}');
    cy.get('button[aria-label="Start Test invoice falcon"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('input[name=new-card]').type('Test sidebar iris{enter}');
    cy.get('input[name=new-card]').type('Test report aurora{enter}');
    cy.get('input[name=new-card]').type('Label payment glade{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 4);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 5 done');
  });
});
