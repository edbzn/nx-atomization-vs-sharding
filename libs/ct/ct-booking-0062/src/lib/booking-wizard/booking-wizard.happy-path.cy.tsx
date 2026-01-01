import { BookingWizard } from './BookingWizard';

describe('BookingWizard happy path', () => {
  it('creates a booking in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<BookingWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.contains('button', 'Next').click();
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Business Ghent');
    cy.get('select[name=wizard-category]').select('Tour');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('sable iris{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Business Ghent');
    cy.get('[data-testid=review-category]').should('have.text', 'Tour');
    cy.get('[data-testid=review-tags]').should('have.text', 'sable-iris');
    cy.contains('button', 'Create booking').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Business Ghent","category":"Tour","tags":["sable-iris"]});
    cy.contains('[role=status]', 'Created Business Ghent').should('be.visible');
  });
});
