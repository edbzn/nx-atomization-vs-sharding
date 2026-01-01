import { TicketWizard } from './TicketWizard';

describe('TicketWizard back and forth', () => {
  it('creates a ticket in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<TicketWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').type('Al');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name must be at least 3 characters').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Wrong Invoice');
    cy.get('select[name=wizard-category]').select('Question');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('nova nova{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Wrong Invoice');
    cy.get('[data-testid=review-category]').should('have.text', 'Question');
    cy.get('[data-testid=review-tags]').should('have.text', 'nova-nova');
    cy.contains('button', 'Create ticket').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Wrong Invoice","category":"Question","tags":["nova-nova"]});
    cy.contains('[role=status]', 'Created Wrong Invoice').should('be.visible');
  });
});
