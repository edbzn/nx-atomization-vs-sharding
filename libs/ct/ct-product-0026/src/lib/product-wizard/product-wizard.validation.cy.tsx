import { ProductWizard } from './ProductWizard';

describe('ProductWizard validation', () => {
  it('creates a product in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Heavy Kettle');
    cy.get('select[name=wizard-category]').select('Garden');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('umber{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Heavy Kettle');
    cy.get('[data-testid=review-category]').should('have.text', 'Garden');
    cy.get('[data-testid=review-tags]').should('have.text', 'umber');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Heavy Kettle","category":"Garden","tags":["umber"]});
    cy.contains('[role=status]', 'Created Heavy Kettle').should('be.visible');
  });

  it('creates a product in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Victor Claessens');
    cy.get('select[name=wizard-category]').select('Kitchen');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('ember27{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Victor Claessens');
    cy.get('[data-testid=review-category]').should('have.text', 'Kitchen');
    cy.get('[data-testid=review-tags]').should('have.text', 'ember27');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Victor Claessens","category":"Kitchen","tags":["ember27"]});
    cy.contains('[role=status]', 'Created Victor Claessens').should('be.visible');
  });
});
