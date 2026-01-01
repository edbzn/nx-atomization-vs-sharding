import { InvoiceWizard } from './InvoiceWizard';

describe('InvoiceWizard validation', () => {
  it('creates a invoice in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<InvoiceWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Victor Verhoeven');
    cy.get('select[name=wizard-category]').select('Paid');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('amber nectar{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Victor Verhoeven');
    cy.get('[data-testid=review-category]').should('have.text', 'Paid');
    cy.get('[data-testid=review-tags]').should('have.text', 'amber-nectar');
    cy.contains('button', 'Create invoice').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Victor Verhoeven","category":"Paid","tags":["amber-nectar"]});
    cy.contains('[role=status]', 'Created Victor Verhoeven').should('be.visible');
  });
});
