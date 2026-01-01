import { PatientForm } from './PatientForm';

describe('PatientForm validation', () => {
  it('validates and saves a patient (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<PatientForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save patient').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('textarea[name=notes]').clear().type('garnet glade coral raven drift oak meadow lagoon zinc comet nova river apex indigo alpha garnet lagoon atlas alpha tide apex sage jade aurora umber iris sage lumen topaz willow solstice ember maple ree', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Daan Peeters 39');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('pia.van.damme21@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('46819');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('pebble ridge orbit onyx flint onyx nectar ember', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Waiting');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Daan Peeters 39","email":"pia.van.damme21@example.com","category":"Waiting","amount":46819,"notes":"pebble ridge orbit onyx flint onyx nectar ember"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
