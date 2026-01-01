import { TicketBoard } from './TicketBoard';

describe('TicketBoard deleting', () => {
  it('moves 3 cards across the board', () => {
    cy.mount(<TicketBoard />);
    cy.get('input[name=new-card]').type('Fix upload jade{enter}');
    cy.get('input[name=new-card]').type('Ship webhook umber{enter}');
    cy.get('button[aria-label="Start Ship webhook umber"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Start Fix upload jade"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 2);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Pause Fix upload jade"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 2 done');
    cy.get('button[aria-label="Finish Ship webhook umber"]').click();
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=board-summary]').should('have.text', '1 of 2 done');
    cy.get('input[name=card-filter]').clear().type('umbe');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=board-summary]').should('have.text', '1 of 2 done');
    cy.get('input[name=new-card]').type('Label login mesa{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 1);
    cy.get('[data-testid=board-summary]').should('have.text', '1 of 3 done');
  });
});
