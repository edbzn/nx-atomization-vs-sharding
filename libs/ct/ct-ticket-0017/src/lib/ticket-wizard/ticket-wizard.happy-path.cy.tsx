import { TicketWizard } from './TicketWizard';

describe('TicketWizard happy path', () => {
  it('creates a ticket in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<TicketWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Stale Search');
    cy.get('select[name=wizard-category]').select('Bug');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('nectar{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Stale Search');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Stale Search');
    cy.get('[data-testid=review-category]').should('have.text', 'Bug');
    cy.get('[data-testid=review-tags]').should('have.text', 'nectar');
    cy.contains('button', 'Create ticket').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Stale Search","category":"Bug","tags":["nectar"]});
    cy.contains('[role=status]', 'Created Stale Search').should('be.visible');
  });
});
