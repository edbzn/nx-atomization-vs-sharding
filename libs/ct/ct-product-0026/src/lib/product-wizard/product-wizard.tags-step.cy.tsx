import { ProductWizard } from './ProductWizard';

describe('ProductWizard tags step', () => {
  it('creates a product in three steps with 3 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Tom Cools');
    cy.get('select[name=wizard-category]').select('Lighting');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('onyx19{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('ONYX19{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"onyx19" is already added');
    cy.get('input[name=new-tag]').type('mesa pine{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('prism{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Tom Cools');
    cy.get('[data-testid=review-category]').should('have.text', 'Lighting');
    cy.get('[data-testid=review-tags]').should('have.text', 'onyx19, mesa-pine, prism');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Tom Cools","category":"Lighting","tags":["onyx19","mesa-pine","prism"]});
    cy.contains('[role=status]', 'Created Tom Cools').should('be.visible');
  });
});
