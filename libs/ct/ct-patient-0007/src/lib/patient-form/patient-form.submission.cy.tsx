import { PatientForm } from './PatientForm';

describe('PatientForm submission', () => {
  it('validates and saves a patient (6 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<PatientForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save patient').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=email]').clear().type('ruben.bogaert9@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Bruno Wouters 26');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('88388');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Outpatient');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Bruno Wouters 26","email":"ruben.bogaert9@example.com","category":"Outpatient","amount":88388,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });

  it('validates and saves a patient (6 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<PatientForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save patient').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=email]').clear().type('uma.coppens33@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Bea Bogaert');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('66201');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Admitted');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Bea Bogaert","email":"uma.coppens33@example.com","category":"Admitted","amount":66201,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
