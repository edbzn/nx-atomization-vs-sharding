import { ShipmentWizard } from './ShipmentWizard';

describe('ShipmentWizard review', () => {
  it('creates a shipment in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ShipmentWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Zoe Verhoeven');
    cy.get('select[name=wizard-category]').select('Delivered');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('willow{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Zoe Verhoeven');
    cy.get('[data-testid=review-category]').should('have.text', 'Delivered');
    cy.get('[data-testid=review-tags]').should('have.text', 'willow');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Zoe Verhoeven","category":"Delivered","tags":["willow"]});
    cy.contains('[role=status]', 'Created Zoe Verhoeven').should('be.visible');
  });
});
