import { PatientWizard } from './PatientWizard';

describe('PatientWizard validation', () => {
  it('creates a patient in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<PatientWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Ines Jacobs');
    cy.get('select[name=wizard-category]').select('Admitted');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('pebble maple{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Ines Jacobs');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Ines Jacobs');
    cy.get('[data-testid=review-category]').should('have.text', 'Admitted');
    cy.get('[data-testid=review-tags]').should('have.text', 'pebble-maple');
    cy.contains('button', 'Create patient').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Ines Jacobs","category":"Admitted","tags":["pebble-maple"]});
    cy.contains('[role=status]', 'Created Ines Jacobs').should('be.visible');
  });
});
