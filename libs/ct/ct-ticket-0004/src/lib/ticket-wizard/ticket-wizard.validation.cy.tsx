import { TicketWizard } from './TicketWizard';

describe('TicketWizard validation', () => {
  it('creates a ticket in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<TicketWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Wrong Sidebar');
    cy.get('select[name=wizard-category]').select('Bug');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('meadow{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Wrong Sidebar');
    cy.get('[data-testid=review-category]').should('have.text', 'Bug');
    cy.get('[data-testid=review-tags]').should('have.text', 'meadow');
    cy.contains('button', 'Create ticket').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Wrong Sidebar","category":"Bug","tags":["meadow"]});
    cy.contains('[role=status]', 'Created Wrong Sidebar').should('be.visible');
  });
});
