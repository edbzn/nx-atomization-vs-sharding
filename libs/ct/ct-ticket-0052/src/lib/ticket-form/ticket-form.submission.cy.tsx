import { TicketForm } from './TicketForm';

describe('TicketForm submission', () => {
  it('validates and saves a ticket (7 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<TicketForm onSubmit={onSubmit} />);
    cy.get('input[name=name]').clear().type('X');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save ticket').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name must be at least 3 characters').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('select[name=category]').select('Incident');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Broken Report 7');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('victor.lemmens3@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('31888');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save ticket').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Broken Report 7","email":"victor.lemmens3@example.com","category":"Incident","amount":31888,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
