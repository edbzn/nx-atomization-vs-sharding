import { ShipmentForm } from './ShipmentForm';

describe('ShipmentForm validation', () => {
  it('validates and saves a shipment (6 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<ShipmentForm onSubmit={onSubmit} />);
    cy.get('input[name=name]').clear().type('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN', { delay: 0 });
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Yara Desmet');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('marco.desmet60@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('66203');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Transit');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save shipment').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Yara Desmet","email":"marco.desmet60@example.com","category":"Transit","amount":66203,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
