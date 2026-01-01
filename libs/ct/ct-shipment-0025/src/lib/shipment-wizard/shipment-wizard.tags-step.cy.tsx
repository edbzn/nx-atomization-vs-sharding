import { ShipmentWizard } from './ShipmentWizard';

describe('ShipmentWizard tags step', () => {
  it('creates a shipment in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ShipmentWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Insured Parcel');
    cy.get('select[name=wizard-category]').select('Pending');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('delta orbit{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Insured Parcel');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Insured Parcel');
    cy.get('[data-testid=review-category]').should('have.text', 'Pending');
    cy.get('[data-testid=review-tags]').should('have.text', 'delta-orbit');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Insured Parcel","category":"Pending","tags":["delta-orbit"]});
    cy.contains('[role=status]', 'Created Insured Parcel').should('be.visible');
  });
});
