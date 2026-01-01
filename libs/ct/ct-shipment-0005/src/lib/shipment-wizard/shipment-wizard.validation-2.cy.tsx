import { ShipmentWizard } from './ShipmentWizard';

describe('ShipmentWizard validation 2', () => {
  it('creates a shipment in three steps with 2 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ShipmentWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Tom De Smet');
    cy.get('select[name=wizard-category]').select('Transit');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('ember blaze{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('  ember-blaze {enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"ember-blaze" is already added');
    cy.get('input[name=new-tag]').type('cedar{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Tom De Smet');
    cy.get('[data-testid=review-category]').should('have.text', 'Transit');
    cy.get('[data-testid=review-tags]').should('have.text', 'ember-blaze, cedar');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Tom De Smet","category":"Transit","tags":["ember-blaze","cedar"]});
    cy.contains('[role=status]', 'Created Tom De Smet').should('be.visible');
  });
});
