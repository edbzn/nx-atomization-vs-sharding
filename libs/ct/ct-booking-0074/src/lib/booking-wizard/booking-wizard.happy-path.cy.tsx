import { BookingWizard } from './BookingWizard';

describe('BookingWizard happy path', () => {
  it('creates a booking in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<BookingWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Weekend Seville');
    cy.get('select[name=wizard-category]').select('Train');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('lagoon{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Weekend Seville');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Weekend Seville');
    cy.get('[data-testid=review-category]').should('have.text', 'Train');
    cy.get('[data-testid=review-tags]').should('have.text', 'lagoon');
    cy.contains('button', 'Create booking').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Weekend Seville","category":"Train","tags":["lagoon"]});
    cy.contains('[role=status]', 'Created Weekend Seville').should('be.visible');
  });
});
