import { InvoiceForm } from './InvoiceForm';

describe('InvoiceForm required fields', () => {
  it('validates and saves a invoice (9 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<InvoiceForm onSubmit={onSubmit} />);
    cy.get('input[name=name]').clear().type('Jo');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('51994');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('indigo nectar apex iris delta flint', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('drift prism harbor onyx onyx sable alpha umber garnet lagoon reef amber drift velvet raven meadow glade velvet jade spruce garnet velvet tundra ember pebble hazel mesa oak topaz solstice quartz lark al', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Partial Training 95');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('lena.de.smet35@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('orbit falcon lark frost vale tide meadow cobalt velvet tide indigo reef blaze flint', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Sent');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Partial Training 95","email":"lena.de.smet35@example.com","category":"Sent","amount":51994,"notes":"orbit falcon lark frost vale tide meadow cobalt velvet tide indigo reef blaze flint"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
