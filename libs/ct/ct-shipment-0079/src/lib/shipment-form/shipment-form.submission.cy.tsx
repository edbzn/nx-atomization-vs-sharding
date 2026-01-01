import { ShipmentForm } from './ShipmentForm';

describe('ShipmentForm submission', () => {
  it('validates and saves a shipment (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<ShipmentForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save shipment').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('select[name=category]').select('Packed');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Pending');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save shipment').click();
    cy.get('[data-testid=error-summary]').should('have.text', '3 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Cas Desmet');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('pia.claessens69@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('25602');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save shipment').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Cas Desmet","email":"pia.claessens69@example.com","category":"Pending","amount":25602,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
