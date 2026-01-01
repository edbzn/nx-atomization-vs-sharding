import { TicketWizard } from './TicketWizard';

describe('TicketWizard happy path', () => {
  it('creates a ticket in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<TicketWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Stale Login');
    cy.get('select[name=wizard-category]').select('Bug');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('tundra{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('TUNDRA{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"tundra" is already added');
    cy.get('input[name=new-tag]').type('TUNDRA{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"tundra" is already added');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Stale Login');
    cy.get('[data-testid=review-category]').should('have.text', 'Bug');
    cy.get('[data-testid=review-tags]').should('have.text', 'tundra');
    cy.contains('button', 'Create ticket').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Stale Login","category":"Bug","tags":["tundra"]});
    cy.contains('[role=status]', 'Created Stale Login').should('be.visible');
  });
});
