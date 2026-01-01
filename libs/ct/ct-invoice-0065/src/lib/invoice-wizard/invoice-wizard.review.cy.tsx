import { InvoiceWizard } from './InvoiceWizard';

describe('InvoiceWizard review', () => {
  it('creates a invoice in three steps with 2 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<InvoiceWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Urgent Hosting');
    cy.get('select[name=wizard-category]').select('Sent');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('pebble oak{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('coral{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Urgent Hosting');
    cy.get('[data-testid=review-category]').should('have.text', 'Sent');
    cy.get('[data-testid=review-tags]').should('have.text', 'pebble-oak, coral');
    cy.contains('button', 'Create invoice').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Urgent Hosting","category":"Sent","tags":["pebble-oak","coral"]});
    cy.contains('[role=status]', 'Created Urgent Hosting').should('be.visible');
  });
});
