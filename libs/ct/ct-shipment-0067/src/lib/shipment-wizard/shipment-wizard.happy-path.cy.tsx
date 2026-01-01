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
    cy.get('input[name=wizard-name]').clear().type('Express Sack');
    cy.get('select[name=wizard-category]').select('Delivered');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('quartz topaz{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('QUARTZ-TOPAZ{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"quartz-topaz" is already added');
    cy.get('input[name=new-tag]').type('juniper20{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Express Sack');
    cy.get('[data-testid=review-category]').should('have.text', 'Delivered');
    cy.get('[data-testid=review-tags]').should('have.text', 'quartz-topaz, juniper20');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Express Sack","category":"Delivered","tags":["quartz-topaz","juniper20"]});
    cy.contains('[role=status]', 'Created Express Sack').should('be.visible');
  });
});
