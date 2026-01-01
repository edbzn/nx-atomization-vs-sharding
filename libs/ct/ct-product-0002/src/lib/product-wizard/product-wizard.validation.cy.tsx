import { ProductWizard } from './ProductWizard';

describe('ProductWizard validation', () => {
  it('creates a product in three steps with 3 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Tom Hendrickx');
    cy.get('select[name=wizard-category]').select('Office');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('pine frost{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('river40{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('coral kestrel{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Tom Hendrickx');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Tom Hendrickx');
    cy.get('[data-testid=review-category]').should('have.text', 'Office');
    cy.get('[data-testid=review-tags]').should('have.text', 'pine-frost, river40, coral-kestrel');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Tom Hendrickx","category":"Office","tags":["pine-frost","river40","coral-kestrel"]});
    cy.contains('[role=status]', 'Created Tom Hendrickx').should('be.visible');
  });
});
