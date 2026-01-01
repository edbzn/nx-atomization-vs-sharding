import { TicketForm } from './TicketForm';

describe('TicketForm required fields', () => {
  it('validates and saves a ticket (6 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<TicketForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save ticket').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=amount]').clear().type('58571');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Oscar Claessens');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('victor.martens52@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Question');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save ticket').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Oscar Claessens","email":"victor.martens52@example.com","category":"Question","amount":58571,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
