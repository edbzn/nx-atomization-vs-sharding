import { InvoiceWizard } from './InvoiceWizard';

describe('InvoiceWizard validation', () => {
  it('creates a invoice in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<InvoiceWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Uma Hendrickx');
    cy.get('select[name=wizard-category]').select('Draft');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('jade tundra{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Uma Hendrickx');
    cy.get('[data-testid=review-category]').should('have.text', 'Draft');
    cy.get('[data-testid=review-tags]').should('have.text', 'jade-tundra');
    cy.contains('button', 'Create invoice').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Uma Hendrickx","category":"Draft","tags":["jade-tundra"]});
    cy.contains('[role=status]', 'Created Uma Hendrickx').should('be.visible');
  });
});
