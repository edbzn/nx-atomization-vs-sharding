import { ShipmentForm } from './ShipmentForm';

describe('ShipmentForm submission', () => {
  it('validates and saves a shipment (5 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<ShipmentForm onSubmit={onSubmit} />);
    cy.get('select[name=category]').select('Returned');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('80688');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Standard Sack 93');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('arne.cools4@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save shipment').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Standard Sack 93","email":"arne.cools4@example.com","category":"Returned","amount":80688,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
