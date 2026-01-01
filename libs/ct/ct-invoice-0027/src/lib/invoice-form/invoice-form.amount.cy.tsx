import { InvoiceForm } from './InvoiceForm';

describe('InvoiceForm amount', () => {
  it('validates and saves a invoice (6 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<InvoiceForm onSubmit={onSubmit} />);
    cy.get('input[name=name]').clear().type('Jo');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Deferred Audit 53');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('noor.bogaert99@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('43035');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Draft');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Deferred Audit 53","email":"noor.bogaert99@example.com","category":"Draft","amount":43035,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
