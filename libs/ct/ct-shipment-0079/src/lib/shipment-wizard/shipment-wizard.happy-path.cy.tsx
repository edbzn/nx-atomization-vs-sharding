import { ShipmentWizard } from './ShipmentWizard';

describe('ShipmentWizard happy path', () => {
  it('creates a shipment in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ShipmentWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').type('Al');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name must be at least 3 characters').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Sara Lemmens');
    cy.get('select[name=wizard-category]').select('Pending');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('umber comet{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('  umber-comet {enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"umber-comet" is already added');
    cy.get('input[name=new-tag]').type('UMBER-COMET{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"umber-comet" is already added');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Sara Lemmens');
    cy.get('[data-testid=review-category]').should('have.text', 'Pending');
    cy.get('[data-testid=review-tags]').should('have.text', 'umber-comet');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Sara Lemmens","category":"Pending","tags":["umber-comet"]});
    cy.contains('[role=status]', 'Created Sara Lemmens').should('be.visible');
  });
});
