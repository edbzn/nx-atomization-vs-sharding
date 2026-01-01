import { BookingForm } from './BookingForm';

describe('BookingForm validation', () => {
  it('validates and saves a booking (5 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.get('select[name=category]').select('Hotel');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Bea Lemmens');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('victor.michiels88@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('94315');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Bea Lemmens","email":"victor.michiels88@example.com","category":"Hotel","amount":94315,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });

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
    cy.get('input[name=name]').clear().type('Budget Seville 92');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('lena.cools10@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('42364');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Hotel');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Budget Seville 92","email":"lena.cools10@example.com","category":"Hotel","amount":42364,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
