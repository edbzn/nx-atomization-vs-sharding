import { BookingForm } from './BookingForm';

describe('BookingForm required fields', () => {
  it('validates and saves a booking (6 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save booking').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=email]').clear().type('pia.desmet95@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Late Porto 28');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('60973');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Flight');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Late Porto 28","email":"pia.desmet95@example.com","category":"Flight","amount":60973,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
