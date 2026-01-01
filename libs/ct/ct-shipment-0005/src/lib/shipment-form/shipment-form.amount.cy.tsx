import { ShipmentForm } from './ShipmentForm';

describe('ShipmentForm amount', () => {
  it('validates and saves a shipment (6 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<ShipmentForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save shipment').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=email]').clear().type('noor.verhoeven46@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Noor Bogaert');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('7997');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Pending');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save shipment').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Noor Bogaert","email":"noor.verhoeven46@example.com","category":"Pending","amount":7997,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
