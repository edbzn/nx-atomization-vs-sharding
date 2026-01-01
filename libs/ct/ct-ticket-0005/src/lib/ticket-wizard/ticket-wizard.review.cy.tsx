import { TicketWizard } from './TicketWizard';

describe('TicketWizard review', () => {
  it('creates a ticket in three steps with 2 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<TicketWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Lena Michiels');
    cy.get('select[name=wizard-category]').select('Incident');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('tundra{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('SUMMIT{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Lena Michiels');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Lena Michiels');
    cy.get('[data-testid=review-category]').should('have.text', 'Incident');
    cy.get('[data-testid=review-tags]').should('have.text', 'tundra, summit');
    cy.contains('button', 'Create ticket').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Lena Michiels","category":"Incident","tags":["tundra","summit"]});
    cy.contains('[role=status]', 'Created Lena Michiels').should('be.visible');
  });
});
