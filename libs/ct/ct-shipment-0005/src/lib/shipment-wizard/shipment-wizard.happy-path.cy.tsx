import { ShipmentWizard } from './ShipmentWizard';

describe('ShipmentWizard happy path', () => {
  it('creates a shipment in three steps with 2 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ShipmentWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Sara Cools');
    cy.get('select[name=wizard-category]').select('Transit');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('cedar{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('alpha80{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Sara Cools');
    cy.get('[data-testid=review-category]').should('have.text', 'Transit');
    cy.get('[data-testid=review-tags]').should('have.text', 'cedar, alpha80');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Sara Cools","category":"Transit","tags":["cedar","alpha80"]});
    cy.contains('[role=status]', 'Created Sara Cools').should('be.visible');
  });
});
