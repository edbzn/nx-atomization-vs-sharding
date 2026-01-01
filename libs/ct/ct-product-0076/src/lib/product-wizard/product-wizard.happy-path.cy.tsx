import { ProductWizard } from './ProductWizard';

describe('ProductWizard happy path', () => {
  it('creates a product in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Victor Coppens');
    cy.get('select[name=wizard-category]').select('Lighting');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('atlas{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Victor Coppens');
    cy.get('[data-testid=review-category]').should('have.text', 'Lighting');
    cy.get('[data-testid=review-tags]').should('have.text', 'atlas');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Victor Coppens","category":"Lighting","tags":["atlas"]});
    cy.contains('[role=status]', 'Created Victor Coppens').should('be.visible');
  });

  it('creates a product in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ProductWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Modular Planter');
    cy.get('select[name=wizard-category]').select('Office');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('quartz zephyr{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Modular Planter');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Modular Planter');
    cy.get('[data-testid=review-category]').should('have.text', 'Office');
    cy.get('[data-testid=review-tags]').should('have.text', 'quartz-zephyr');
    cy.contains('button', 'Create product').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Modular Planter","category":"Office","tags":["quartz-zephyr"]});
    cy.contains('[role=status]', 'Created Modular Planter').should('be.visible');
  });
});
