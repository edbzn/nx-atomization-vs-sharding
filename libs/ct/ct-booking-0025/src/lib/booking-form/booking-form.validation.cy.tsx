import { BookingForm } from './BookingForm';

describe('BookingForm validation', () => {
  it('validates and saves a booking (7 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save booking').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=email]').clear().type('not-an-email');
    cy.get('input[name=email]').should('have.attr', 'aria-invalid', 'true');
    cy.get('input[name=email]').parent().find('[role=alert]').should('have.text', 'Enter a valid email address');
    cy.get('input[name=name]').clear().type('Group Ghent 35');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('oscar.desmet9@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('76292');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Tour');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Group Ghent 35","email":"oscar.desmet9@example.com","category":"Tour","amount":76292,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
