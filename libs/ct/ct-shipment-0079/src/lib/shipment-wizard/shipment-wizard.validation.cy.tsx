import { ShipmentWizard } from './ShipmentWizard';

describe('ShipmentWizard validation', () => {
  it('creates a shipment in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ShipmentWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Ruben Hendrickx');
    cy.get('select[name=wizard-category]').select('Returned');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('comet{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Ruben Hendrickx');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Ruben Hendrickx');
    cy.get('[data-testid=review-category]').should('have.text', 'Returned');
    cy.get('[data-testid=review-tags]').should('have.text', 'comet');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Ruben Hendrickx","category":"Returned","tags":["comet"]});
    cy.contains('[role=status]', 'Created Ruben Hendrickx').should('be.visible');
  });
});
