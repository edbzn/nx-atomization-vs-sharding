import { TicketForm } from './TicketForm';

describe('TicketForm submission', () => {
  it('validates and saves a ticket (7 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<TicketForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save ticket').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('textarea[name=notes]').clear().type('nova pebble ridge prism nectar lagoon harbor solstice lark nova fern willow solstice harbor juniper tundra river mesa blaze prism quartz quartz prism tide frost cedar quartz tide apex oak kestrel sage ', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Cas Desmet');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('ruben.desmet78@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('76473');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Feature');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save ticket').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Cas Desmet","email":"ruben.desmet78@example.com","category":"Feature","amount":76473,"notes":"nova pebble ridge prism nectar lagoon harbor solstice lark nova fern willow solstice harbor juniper tundra river mesa blaze prism quartz quartz prism tide frost cedar quartz tide apex oak kestrel sage "});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
