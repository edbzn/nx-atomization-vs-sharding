import { PatientWizard } from './PatientWizard';

describe('PatientWizard back and forth', () => {
  it('creates a patient in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<PatientWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Farid Maes');
    cy.get('select[name=wizard-category]').select('Outpatient');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('zephyr ember{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Farid Maes');
    cy.get('[data-testid=review-category]').should('have.text', 'Outpatient');
    cy.get('[data-testid=review-tags]').should('have.text', 'zephyr-ember');
    cy.contains('button', 'Create patient').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Farid Maes","category":"Outpatient","tags":["zephyr-ember"]});
    cy.contains('[role=status]', 'Created Farid Maes').should('be.visible');
  });
});
