import { PatientForm } from './PatientForm';

describe('PatientForm required fields', () => {
  it('validates and saves a patient (5 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<PatientForm onSubmit={onSubmit} />);
    cy.get('select[name=category]').select('Admitted');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Elise Dubois 8');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('zoe.lemmens5@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('99162');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Elise Dubois 8","email":"zoe.lemmens5@example.com","category":"Admitted","amount":99162,"notes":""});
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
    cy.get('select[name=category]').select('Outpatient');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Bea Van Damme');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('yara.claessens8@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('41021');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Bea Van Damme","email":"yara.claessens8@example.com","category":"Outpatient","amount":41021,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
