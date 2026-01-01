import { TicketWizard } from './TicketWizard';

describe('TicketWizard validation', () => {
  it('creates a ticket in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<TicketWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Pia Van Damme');
    cy.get('select[name=wizard-category]').select('Feature');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('meadow36{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Pia Van Damme');
    cy.get('[data-testid=review-category]').should('have.text', 'Feature');
    cy.get('[data-testid=review-tags]').should('have.text', 'meadow36');
    cy.contains('button', 'Create ticket').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Pia Van Damme","category":"Feature","tags":["meadow36"]});
    cy.contains('[role=status]', 'Created Pia Van Damme').should('be.visible');
  });
});
