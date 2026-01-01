import { TicketForm } from './TicketForm';

describe('TicketForm validation', () => {
  it('validates and saves a ticket (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<TicketForm onSubmit={onSubmit} />);
    cy.get('textarea[name=notes]').clear().type('lark tide apex tide pine alpha raven cobalt', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('abc');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save ticket').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount must be between 1 and 100000').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Blank Invoice 62');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('marco.coppens14@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('63274');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Bug');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save ticket').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Blank Invoice 62","email":"marco.coppens14@example.com","category":"Bug","amount":63274,"notes":"lark tide apex tide pine alpha raven cobalt"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
