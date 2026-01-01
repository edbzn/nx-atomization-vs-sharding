import { PatientWizard } from './PatientWizard';

describe('PatientWizard validation', () => {
  it('creates a patient in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<PatientWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Sara Desmet');
    cy.get('select[name=wizard-category]').select('Admitted');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('glade{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Sara Desmet');
    cy.get('[data-testid=review-category]').should('have.text', 'Admitted');
    cy.get('[data-testid=review-tags]').should('have.text', 'glade');
    cy.contains('button', 'Create patient').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Sara Desmet","category":"Admitted","tags":["glade"]});
    cy.contains('[role=status]', 'Created Sara Desmet').should('be.visible');
  });
});
