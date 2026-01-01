import { PatientWizard } from './PatientWizard';

describe('PatientWizard validation 2', () => {
  it('creates a patient in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<PatientWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Noor Hendrickx');
    cy.get('select[name=wizard-category]').select('Discharged');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('sable{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Noor Hendrickx');
    cy.get('[data-testid=review-category]').should('have.text', 'Discharged');
    cy.get('[data-testid=review-tags]').should('have.text', 'sable');
    cy.contains('button', 'Create patient').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Noor Hendrickx","category":"Discharged","tags":["sable"]});
    cy.contains('[role=status]', 'Created Noor Hendrickx').should('be.visible');
  });
});
