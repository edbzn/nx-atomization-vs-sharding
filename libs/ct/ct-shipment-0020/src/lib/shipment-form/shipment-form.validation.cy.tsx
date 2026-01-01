import { ShipmentForm } from './ShipmentForm';

describe('ShipmentForm validation', () => {
  it('validates and saves a shipment (10 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<ShipmentForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save shipment').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN', { delay: 0 });
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Returned');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Delivered');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('pebble kestrel cobalt sable mesa lark maple delta falcon alpha prism raven solstice birch', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('wout.van.damme55@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save shipment').click();
    cy.get('[data-testid=error-summary]').should('have.text', '2 errors');
    cy.contains('[role=alert]', 'Name must be at most 60 characters').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Express Parcel 73');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('91156');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save shipment').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Express Parcel 73","email":"wout.van.damme55@example.com","category":"Delivered","amount":91156,"notes":"pebble kestrel cobalt sable mesa lark maple delta falcon alpha prism raven solstice birch"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
