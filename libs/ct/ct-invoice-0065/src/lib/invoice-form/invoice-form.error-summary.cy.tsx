import { InvoiceForm } from './InvoiceForm';

describe('InvoiceForm error summary', () => {
  it('validates and saves a invoice (5 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<InvoiceForm onSubmit={onSubmit} />);
    cy.get('select[name=category]').select('Paid');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('sara.hendrickx50@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Oscar Cools');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('40556');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Oscar Cools","email":"sara.hendrickx50@example.com","category":"Paid","amount":40556,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });

  it('validates and saves a invoice (7 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<InvoiceForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save invoice').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('select[name=category]').select('Void');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('[data-testid=error-summary]').should('have.text', '3 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Arne Bogaert');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('bea.van.damme79@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('65992');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Arne Bogaert","email":"bea.van.damme79@example.com","category":"Void","amount":65992,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
