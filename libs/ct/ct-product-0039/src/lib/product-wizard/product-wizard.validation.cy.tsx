import { ProductWizard } from './ProductWizard';

describe('ProductWizard validation', () => {
  it('creates a product in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Brushed Shelf');
    cy.get('select[name=wizard-category]').select('Kitchen');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('flint72{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Brushed Shelf');
    cy.get('[data-testid=review-category]').should('have.text', 'Kitchen');
    cy.get('[data-testid=review-tags]').should('have.text', 'flint72');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Brushed Shelf","category":"Kitchen","tags":["flint72"]});
    cy.contains('[role=status]', 'Created Brushed Shelf').should('be.visible');
  });
});
