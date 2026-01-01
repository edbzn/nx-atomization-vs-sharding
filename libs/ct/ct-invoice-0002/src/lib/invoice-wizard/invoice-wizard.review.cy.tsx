import { InvoiceWizard } from './InvoiceWizard';

describe('InvoiceWizard review', () => {
  it('creates a invoice in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<InvoiceWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Interim Setup');
    cy.get('select[name=wizard-category]').select('Sent');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('KESTREL{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Interim Setup');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Interim Setup');
    cy.get('[data-testid=review-category]').should('have.text', 'Sent');
    cy.get('[data-testid=review-tags]').should('have.text', 'kestrel');
    cy.contains('button', 'Create invoice').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Interim Setup","category":"Sent","tags":["kestrel"]});
    cy.contains('[role=status]', 'Created Interim Setup').should('be.visible');
  });
});
