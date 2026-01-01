import { InvoiceForm } from './InvoiceForm';

describe('InvoiceForm validation', () => {
  it('validates and saves a invoice (7 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<InvoiceForm onSubmit={onSubmit} />);
    cy.get('input[name=email]').clear().type('ruben.michiels29@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('[data-testid=error-summary]').should('have.text', '3 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('select[name=category]').select('Overdue');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('[data-testid=error-summary]').should('have.text', '2 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Deferred Setup 53');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('75918');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Deferred Setup 53","email":"ruben.michiels29@example.com","category":"Overdue","amount":75918,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
