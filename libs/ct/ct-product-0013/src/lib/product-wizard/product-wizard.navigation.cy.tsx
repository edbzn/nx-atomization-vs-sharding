import { ProductWizard } from './ProductWizard';

describe('ProductWizard navigation', () => {
  it('creates a product in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Cas Cools');
    cy.get('select[name=wizard-category]').select('Garden');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('BLAZE{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Cas Cools');
    cy.get('[data-testid=review-category]').should('have.text', 'Garden');
    cy.get('[data-testid=review-tags]').should('have.text', 'blaze');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Cas Cools","category":"Garden","tags":["blaze"]});
    cy.contains('[role=status]', 'Created Cas Cools').should('be.visible');
  });
});
