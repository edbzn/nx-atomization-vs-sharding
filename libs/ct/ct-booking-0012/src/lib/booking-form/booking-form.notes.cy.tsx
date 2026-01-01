import { BookingForm } from './BookingForm';

describe('BookingForm notes', () => {
  it('validates and saves a booking (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save booking').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('select[name=category]').select('Hotel');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Jo');
    cy.get('input[name=name]').should('have.attr', 'aria-invalid', 'true');
    cy.get('input[name=name]').parent().find('[role=alert]').should('have.text', 'Name must be at least 3 characters');
    cy.contains('button', 'Save booking').click();
    cy.get('[data-testid=error-summary]').should('have.text', '3 errors');
    cy.contains('[role=alert]', 'Name must be at least 3 characters').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Premium Bruges 15');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('noor.verhoeven86@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('10344');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Premium Bruges 15","email":"noor.verhoeven86@example.com","category":"Hotel","amount":10344,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });

  it('validates and saves a booking (5 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.get('input[name=email]').clear().type('ruben.claessens21@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Group Ghent 20');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('583');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Car');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Group Ghent 20","email":"ruben.claessens21@example.com","category":"Car","amount":583,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
