import { InvoiceForm } from './InvoiceForm';

describe('InvoiceForm notes', () => {
  it('validates and saves a invoice (6 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<InvoiceForm onSubmit={onSubmit} />);
    cy.get('input[name=name]').clear().type('Uma De Smet');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Urgent Setup 67');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Draft');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('lena.lemmens36@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('84402');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save invoice').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Urgent Setup 67","email":"lena.lemmens36@example.com","category":"Draft","amount":84402,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
