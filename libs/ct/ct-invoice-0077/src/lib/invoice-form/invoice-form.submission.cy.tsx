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
    cy.get('input[name=amount]').clear().type('abc');
    cy.get('input[name=amount]').should('have.attr', 'aria-invalid', 'true');
    cy.get('input[name=amount]').parent().find('[role=alert]').should('have.text', 'Amount must be between 1 and 100000');
    cy.get('select[name=category]').select('Void');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Tom Verhoeven');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('uma.hendrickx18@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('20746');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Tom Verhoeven","email":"uma.hendrickx18@example.com","category":"Void","amount":20746,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
