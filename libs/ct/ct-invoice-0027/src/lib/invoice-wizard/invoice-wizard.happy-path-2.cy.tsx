import { InvoiceWizard } from './InvoiceWizard';

describe('InvoiceWizard happy path 2', () => {
  it('creates a invoice in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<InvoiceWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').type('Al');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name must be at least 3 characters').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Wout Desmet');
    cy.get('select[name=wizard-category]').select('Sent');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('delta29{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Wout Desmet');
    cy.get('[data-testid=review-category]').should('have.text', 'Sent');
    cy.get('[data-testid=review-tags]').should('have.text', 'delta29');
    cy.contains('button', 'Create invoice').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Wout Desmet","category":"Sent","tags":["delta29"]});
    cy.contains('[role=status]', 'Created Wout Desmet').should('be.visible');
  });
});
