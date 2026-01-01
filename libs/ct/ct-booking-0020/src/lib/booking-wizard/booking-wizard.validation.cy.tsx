import { BookingWizard } from './BookingWizard';

describe('BookingWizard validation', () => {
  it('creates a booking in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<BookingWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Budget Krakow');
    cy.get('select[name=wizard-category]').select('Tour');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('glade28{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('  glade28 {enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"glade28" is already added');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Budget Krakow');
    cy.get('[data-testid=review-category]').should('have.text', 'Tour');
    cy.get('[data-testid=review-tags]').should('have.text', 'glade28');
    cy.contains('button', 'Create booking').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Budget Krakow","category":"Tour","tags":["glade28"]});
    cy.contains('[role=status]', 'Created Budget Krakow').should('be.visible');
  });
});
