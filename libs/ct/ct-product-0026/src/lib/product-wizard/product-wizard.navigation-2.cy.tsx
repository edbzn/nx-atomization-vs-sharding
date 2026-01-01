import { ProductWizard } from './ProductWizard';

describe('ProductWizard navigation 2', () => {
  it('creates a product in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Smart Bench');
    cy.get('select[name=wizard-category]').select('Garden');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('topaz alpha{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Smart Bench');
    cy.get('[data-testid=review-category]').should('have.text', 'Garden');
    cy.get('[data-testid=review-tags]').should('have.text', 'topaz-alpha');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Smart Bench","category":"Garden","tags":["topaz-alpha"]});
    cy.contains('[role=status]', 'Created Smart Bench').should('be.visible');
  });
});
