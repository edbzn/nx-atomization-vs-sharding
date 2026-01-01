import { InvoiceWizard } from './InvoiceWizard';

describe('InvoiceWizard back and forth', () => {
  it('creates a invoice in three steps with 2 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<InvoiceWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Uma Claessens');
    cy.get('select[name=wizard-category]').select('Void');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('COMET{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('amber spruce{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Uma Claessens');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Uma Claessens');
    cy.get('[data-testid=review-category]').should('have.text', 'Void');
    cy.get('[data-testid=review-tags]').should('have.text', 'comet, amber-spruce');
    cy.contains('button', 'Create invoice').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Uma Claessens","category":"Void","tags":["comet","amber-spruce"]});
    cy.contains('[role=status]', 'Created Uma Claessens').should('be.visible');
  });

  it('creates a invoice in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<InvoiceWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Pia De Smet');
    cy.get('select[name=wizard-category]').select('Paid');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('prism{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Pia De Smet');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Pia De Smet');
    cy.get('[data-testid=review-category]').should('have.text', 'Paid');
    cy.get('[data-testid=review-tags]').should('have.text', 'prism');
    cy.contains('button', 'Create invoice').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Pia De Smet","category":"Paid","tags":["prism"]});
    cy.contains('[role=status]', 'Created Pia De Smet').should('be.visible');
  });
});
