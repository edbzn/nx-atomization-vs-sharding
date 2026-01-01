import { InvoiceForm } from './InvoiceForm';

describe('InvoiceForm validation', () => {
  it('validates and saves a invoice (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<InvoiceForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save invoice').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('textarea[name=notes]').clear().type('raven summit oak orbit coral coral garnet juniper birch raven amber zinc coral orbit frost nova apex nova orbit lumen comet blaze comet meadow apex lark harbor prism zephyr hazel nectar sable prism umb', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Recurring Support 44');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('lena.martens33@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('30147');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('delta summit sable vale lark ember raven cobalt pine tundra', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Void');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Recurring Support 44","email":"lena.martens33@example.com","category":"Void","amount":30147,"notes":"delta summit sable vale lark ember raven cobalt pine tundra"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
