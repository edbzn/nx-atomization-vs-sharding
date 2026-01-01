import { ShipmentWizard } from './ShipmentWizard';

describe('ShipmentWizard validation', () => {
  it('creates a shipment in three steps with 3 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ShipmentWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Uma Claessens');
    cy.get('select[name=wizard-category]').select('Packed');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('falcon6{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('drift atlas{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('willow{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Uma Claessens');
    cy.get('[data-testid=review-category]').should('have.text', 'Packed');
    cy.get('[data-testid=review-tags]').should('have.text', 'falcon6, drift-atlas, willow');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Uma Claessens","category":"Packed","tags":["falcon6","drift-atlas","willow"]});
    cy.contains('[role=status]', 'Created Uma Claessens').should('be.visible');
  });
});
