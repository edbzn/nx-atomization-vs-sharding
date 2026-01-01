import { ProductForm } from './ProductForm';

describe('ProductForm editing', () => {
  it('validates and saves a product (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<ProductForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save product').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=amount]').clear().type('7874');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('90509');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('marco.de.smet85@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save product').click();
    cy.get('[data-testid=error-summary]').should('have.text', '2 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('select[name=category]').select('Office');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Sara Claessens');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save product').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Sara Claessens","email":"marco.de.smet85@example.com","category":"Office","amount":90509,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
