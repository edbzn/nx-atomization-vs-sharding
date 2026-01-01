import { BookingForm } from './BookingForm';

describe('BookingForm submission', () => {
  it('validates and saves a booking (11 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.get('input[name=name]').clear().type('Noor Verhoeven');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Jo');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('79272');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('a@b.c');
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('marco.bogaert86@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('solstice frost raven prism', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('ruben.van.damme57@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('[data-testid=error-summary]').should('have.text', '2 errors');
    cy.contains('[role=alert]', 'Name must be at least 3 characters').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Yara Desmet');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Tour');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Yara Desmet","email":"ruben.van.damme57@example.com","category":"Tour","amount":79272,"notes":"solstice frost raven prism"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
