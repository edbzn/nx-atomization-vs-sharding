import { PatientBoard } from './PatientBoard';

describe('PatientBoard deleting', () => {
  it('moves 4 cards across the board', () => {
    cy.mount(<PatientBoard />);
    cy.get('input[name=new-card]').type('Fix goossens meadow{enter}');
    cy.get('input[name=new-card]').type('Draft goossens oak{enter}');
    cy.get('input[name=new-card]').type('Audit mertens coral{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 3);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 3 done');
    cy.get('input[name=new-card]').type('Price dubois aurora{enter}');
    cy.get('[data-testid=column-todo] [data-testid=card]').should('have.length', 4);
    cy.get('[data-testid=column-doing] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=column-done] [data-testid=card]').should('have.length', 0);
    cy.get('[data-testid=board-summary]').should('have.text', '0 of 4 done');
  });
});
