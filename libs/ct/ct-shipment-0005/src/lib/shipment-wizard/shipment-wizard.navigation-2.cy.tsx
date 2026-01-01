import { ShipmentWizard } from './ShipmentWizard';

describe('ShipmentWizard navigation 2', () => {
  it('creates a shipment in three steps with 3 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ShipmentWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Standard Tube');
    cy.get('select[name=wizard-category]').select('Transit');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('delta garnet{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('quartz{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('orbit meadow{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Standard Tube');
    cy.get('[data-testid=review-category]').should('have.text', 'Transit');
    cy.get('[data-testid=review-tags]').should('have.text', 'delta-garnet, quartz, orbit-meadow');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Standard Tube","category":"Transit","tags":["delta-garnet","quartz","orbit-meadow"]});
    cy.contains('[role=status]', 'Created Standard Tube').should('be.visible');
  });
});
