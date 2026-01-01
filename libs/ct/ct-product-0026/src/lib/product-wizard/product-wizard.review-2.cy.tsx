import { ProductWizard } from './ProductWizard';

describe('ProductWizard review 2', () => {
  it('creates a product in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').type('Al');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name must be at least 3 characters').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Heavy Tray');
    cy.get('select[name=wizard-category]').select('Office');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('sage97{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Heavy Tray');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Heavy Tray');
    cy.get('[data-testid=review-category]').should('have.text', 'Office');
    cy.get('[data-testid=review-tags]').should('have.text', 'sage97');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Heavy Tray","category":"Office","tags":["sage97"]});
    cy.contains('[role=status]', 'Created Heavy Tray').should('be.visible');
  });
});
