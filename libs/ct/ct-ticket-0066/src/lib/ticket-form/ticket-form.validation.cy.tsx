import { TicketForm } from './TicketForm';

describe('TicketForm validation', () => {
  it('validates and saves a ticket (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<TicketForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save ticket').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Lena Michiels');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('lena.desmet21@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('ruben.de.smet24@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('abc');
    cy.get('input[name=amount]').should('have.attr', 'aria-invalid', 'true');
    cy.get('input[name=amount]').parent().find('[role=alert]').should('have.text', 'Amount must be between 1 and 100000');
    cy.get('select[name=category]').select('Incident');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('28766');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save ticket').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Lena Michiels","email":"ruben.de.smet24@example.com","category":"Incident","amount":28766,"notes":""});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
