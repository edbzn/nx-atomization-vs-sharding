import { PatientWizard } from './PatientWizard';

describe('PatientWizard tags step', () => {
  it('creates a patient in three steps with 2 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<PatientWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Jonas Wouters');
    cy.get('select[name=wizard-category]').select('Referred');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('river78{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('zinc{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Jonas Wouters');
    cy.get('[data-testid=review-category]').should('have.text', 'Referred');
    cy.get('[data-testid=review-tags]').should('have.text', 'river78, zinc');
    cy.contains('button', 'Create patient').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Jonas Wouters","category":"Referred","tags":["river78","zinc"]});
    cy.contains('[role=status]', 'Created Jonas Wouters').should('be.visible');
  });
});
