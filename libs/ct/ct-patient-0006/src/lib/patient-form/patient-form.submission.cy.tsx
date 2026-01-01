import { PatientForm } from './PatientForm';

describe('PatientForm submission', () => {
  it('validates and saves a patient (6 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<PatientForm onSubmit={onSubmit} />);
    cy.get('select[name=category]').select('Admitted');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('[data-testid=error-summary]').should('have.text', '3 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Zoe Coppens');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('lena.martens24@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('83228');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Zoe Coppens","email":"lena.martens24@example.com","category":"Admitted","amount":83228,"notes":""});
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
    cy.get('input[name=amount]').clear().type('81548');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Ruben De Smet');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('wout.de.smet82@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Outpatient');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Ruben De Smet","email":"wout.de.smet82@example.com","category":"Outpatient","amount":81548,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
