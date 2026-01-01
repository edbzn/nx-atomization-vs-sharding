import { InvoiceForm } from './InvoiceForm';

describe('InvoiceForm submission', () => {
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
    cy.get('input[name=email]').clear().type('a@b.c');
    cy.get('input[name=email]').should('have.attr', 'aria-invalid', 'true');
    cy.get('input[name=email]').parent().find('[role=alert]').should('have.text', 'Enter a valid email address');
    cy.get('input[name=name]').clear().type('Deferred Support 79');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('oscar.van.damme51@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('45805');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Paid');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Deferred Support 79","email":"oscar.van.damme51@example.com","category":"Paid","amount":45805,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
