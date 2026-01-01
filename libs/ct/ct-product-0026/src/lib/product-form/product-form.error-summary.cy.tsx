import { ProductForm } from './ProductForm';

describe('ProductForm error summary', () => {
  it('validates and saves a product (9 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<ProductForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save product').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=amount]').clear().type('0');
    cy.get('input[name=amount]').should('have.attr', 'aria-invalid', 'true');
    cy.get('input[name=amount]').parent().find('[role=alert]').should('have.text', 'Amount must be between 1 and 100000');
    cy.get('textarea[name=notes]').clear().type('quartz tundra lark delta onyx onyx', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('250000');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Folding Bench 22');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('pia.verhoeven72@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('5698');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Outdoor');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save product').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Folding Bench 22","email":"pia.verhoeven72@example.com","category":"Outdoor","amount":5698,"notes":"quartz tundra lark delta onyx onyx"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
