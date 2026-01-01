import { PatientForm } from './PatientForm';

describe('PatientForm validation', () => {
  it('validates and saves a patient (7 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<PatientForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save patient').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('textarea[name=notes]').clear().type('tide tide cobalt jade jade juniper lumen sage cobalt cedar pebble comet', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Elise Dubois 34');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('oscar.de.smet70@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('54757');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Referred');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Elise Dubois 34","email":"oscar.de.smet70@example.com","category":"Referred","amount":54757,"notes":"tide tide cobalt jade jade juniper lumen sage cobalt cedar pebble comet"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
