import { PatientWizard } from './PatientWizard';

describe('PatientWizard happy path', () => {
  it('creates a patient in three steps with 3 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<PatientWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Arne Van Damme');
    cy.get('select[name=wizard-category]').select('Discharged');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('reef80{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('delta{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('ember{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Arne Van Damme');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Arne Van Damme');
    cy.get('[data-testid=review-category]').should('have.text', 'Discharged');
    cy.get('[data-testid=review-tags]').should('have.text', 'reef80, delta, ember');
    cy.contains('button', 'Create patient').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Arne Van Damme","category":"Discharged","tags":["reef80","delta","ember"]});
    cy.contains('[role=status]', 'Created Arne Van Damme').should('be.visible');
  });
});
