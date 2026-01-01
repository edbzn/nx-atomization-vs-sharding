import { ProductForm } from './ProductForm';

describe('ProductForm validation', () => {
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
    cy.get('input[name=name]').clear().type('Jo');
    cy.get('input[name=name]').should('have.attr', 'aria-invalid', 'true');
    cy.get('input[name=name]').parent().find('[role=alert]').should('have.text', 'Name must be at least 3 characters');
    cy.contains('button', 'Save product').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name must be at least 3 characters').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('select[name=category]').select('Outdoor');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('81921');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Vintage Kettle 51');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('wout.desmet81@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save product').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Vintage Kettle 51","email":"wout.desmet81@example.com","category":"Outdoor","amount":81921,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
