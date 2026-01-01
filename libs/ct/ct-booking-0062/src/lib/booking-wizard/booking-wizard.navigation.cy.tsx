import { BookingWizard } from './BookingWizard';

describe('BookingWizard navigation', () => {
  it('creates a booking in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<BookingWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Marco Desmet');
    cy.get('select[name=wizard-category]').select('Flight');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('harbor summit{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Marco Desmet');
    cy.get('[data-testid=review-category]').should('have.text', 'Flight');
    cy.get('[data-testid=review-tags]').should('have.text', 'harbor-summit');
    cy.contains('button', 'Create booking').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Marco Desmet","category":"Flight","tags":["harbor-summit"]});
    cy.contains('[role=status]', 'Created Marco Desmet').should('be.visible');
  });
});
