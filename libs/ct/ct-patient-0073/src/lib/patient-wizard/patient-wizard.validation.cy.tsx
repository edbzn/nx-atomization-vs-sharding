import { PatientWizard } from './PatientWizard';

describe('PatientWizard validation', () => {
  it('creates a patient in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<PatientWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').type('Al');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name must be at least 3 characters').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Yara Claessens');
    cy.get('select[name=wizard-category]').select('Outpatient');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('garnet{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Yara Claessens');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Yara Claessens');
    cy.get('[data-testid=review-category]').should('have.text', 'Outpatient');
    cy.get('[data-testid=review-tags]').should('have.text', 'garnet');
    cy.contains('button', 'Create patient').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Yara Claessens","category":"Outpatient","tags":["garnet"]});
    cy.contains('[role=status]', 'Created Yara Claessens').should('be.visible');
  });
});
