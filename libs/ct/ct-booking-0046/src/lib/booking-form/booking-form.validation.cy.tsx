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
    cy.get('input[name=name]').clear().type('Zoe Desmet');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('juniper meadow falcon lark flint umber reef raven falcon solstice summit lagoon', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('ruben.desmet26@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('63568');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Car');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Zoe Desmet","email":"ruben.desmet26@example.com","category":"Car","amount":63568,"notes":"juniper meadow falcon lark flint umber reef raven falcon solstice summit lagoon"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
