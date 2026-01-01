import { InvoiceWizard } from './InvoiceWizard';

describe('InvoiceWizard happy path', () => {
  it('creates a invoice in three steps with 1 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<InvoiceWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Noor Coppens');
    cy.get('select[name=wizard-category]').select('Draft');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('indigo lumen{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Back').click();
    cy.get('input[name=wizard-name]').should('have.value', 'Noor Coppens');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Noor Coppens');
    cy.get('[data-testid=review-category]').should('have.text', 'Draft');
    cy.get('[data-testid=review-tags]').should('have.text', 'indigo-lumen');
    cy.contains('button', 'Create invoice').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Noor Coppens","category":"Draft","tags":["indigo-lumen"]});
    cy.contains('[role=status]', 'Created Noor Coppens').should('be.visible');
  });
});
