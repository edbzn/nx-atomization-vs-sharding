import { TicketWizard } from './TicketWizard';

describe('TicketWizard tags step', () => {
  it('creates a ticket in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<TicketWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Flaky Invoice');
    cy.get('select[name=wizard-category]').select('Incident');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('ORBIT{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Flaky Invoice');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Flaky Invoice');
    cy.get('[data-testid=review-category]').should('have.text', 'Incident');
    cy.get('[data-testid=review-tags]').should('have.text', 'orbit');
    cy.contains('button', 'Create ticket').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Flaky Invoice","category":"Incident","tags":["orbit"]});
    cy.contains('[role=status]', 'Created Flaky Invoice').should('be.visible');
  });
});
