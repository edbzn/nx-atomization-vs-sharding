import { PatientWizard } from './PatientWizard';

describe('PatientWizard happy path 2', () => {
  it('creates a patient in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<PatientWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Ines Dubois');
    cy.get('select[name=wizard-category]').select('Waiting');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('raven{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Ines Dubois');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Ines Dubois');
    cy.get('[data-testid=review-category]').should('have.text', 'Waiting');
    cy.get('[data-testid=review-tags]').should('have.text', 'raven');
    cy.contains('button', 'Create patient').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Ines Dubois","category":"Waiting","tags":["raven"]});
    cy.contains('[role=status]', 'Created Ines Dubois').should('be.visible');
  });
});
