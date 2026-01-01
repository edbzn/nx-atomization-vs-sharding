import { BookingWizard } from './BookingWizard';

describe('BookingWizard happy path 2', () => {
  it('creates a booking in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<BookingWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Zoe Verhoeven');
    cy.get('select[name=wizard-category]').select('Train');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('pebble prism{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Zoe Verhoeven');
    cy.get('[data-testid=review-category]').should('have.text', 'Train');
    cy.get('[data-testid=review-tags]').should('have.text', 'pebble-prism');
    cy.contains('button', 'Create booking').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Zoe Verhoeven","category":"Train","tags":["pebble-prism"]});
    cy.contains('[role=status]', 'Created Zoe Verhoeven').should('be.visible');
  });
});
