import { BookingWizard } from './BookingWizard';

describe('BookingWizard happy path', () => {
  it('creates a booking in three steps with 2 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<BookingWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Family Ghent');
    cy.get('select[name=wizard-category]').select('Hotel');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('fern{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('  fern {enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"fern" is already added');
    cy.get('input[name=new-tag]').type('velvet83{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Family Ghent');
    cy.get('[data-testid=review-category]').should('have.text', 'Hotel');
    cy.get('[data-testid=review-tags]').should('have.text', 'fern, velvet83');
    cy.contains('button', 'Create booking').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Family Ghent","category":"Hotel","tags":["fern","velvet83"]});
    cy.contains('[role=status]', 'Created Family Ghent').should('be.visible');
  });
});
