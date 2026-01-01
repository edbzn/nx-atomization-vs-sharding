import { TicketWizard } from './TicketWizard';

describe('TicketWizard navigation', () => {
  it('creates a ticket in three steps with 4 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<TicketWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Stuck Webhook');
    cy.get('select[name=wizard-category]').select('Question');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('summit lark{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('OAK{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('garnet{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('blaze82{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '4 tags');
    cy.get('[data-testid=tag]').should('have.length', 4);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Stuck Webhook');
    cy.get('[data-testid=review-category]').should('have.text', 'Question');
    cy.get('[data-testid=review-tags]').should('have.text', 'summit-lark, oak, garnet, blaze82');
    cy.contains('button', 'Create ticket').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Stuck Webhook","category":"Question","tags":["summit-lark","oak","garnet","blaze82"]});
    cy.contains('[role=status]', 'Created Stuck Webhook').should('be.visible');
  });
});
