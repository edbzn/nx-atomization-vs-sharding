import { ProductWizard } from './ProductWizard';

describe('ProductWizard happy path', () => {
  it('creates a product in three steps with 2 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Smart Clock');
    cy.get('select[name=wizard-category]').select('Kitchen');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('raven{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('FLINT{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Smart Clock');
    cy.get('[data-testid=review-category]').should('have.text', 'Kitchen');
    cy.get('[data-testid=review-tags]').should('have.text', 'raven, flint');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Smart Clock","category":"Kitchen","tags":["raven","flint"]});
    cy.contains('[role=status]', 'Created Smart Clock').should('be.visible');
  });
});
