import { BookingForm } from './BookingForm';

describe('BookingForm submission', () => {
  it('validates and saves a booking (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.get('textarea[name=notes]').clear().type('lark frost apex jade amber sage kestrel glade', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('not-an-email');
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('80779');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('[data-testid=error-summary]').should('have.text', '3 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Enter a valid email address').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=email]').clear().type('ruben.verhoeven27@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Budget Bergen 95');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Hotel');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Budget Bergen 95","email":"ruben.verhoeven27@example.com","category":"Hotel","amount":80779,"notes":"lark frost apex jade amber sage kestrel glade"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });

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
    cy.get('input[name=name]').clear().type('Early Lyon 97');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('arne.claessens92@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('86695');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Train');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Early Lyon 97","email":"arne.claessens92@example.com","category":"Train","amount":86695,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
