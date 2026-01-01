import { TicketForm } from './TicketForm';

describe('TicketForm required fields', () => {
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
    cy.get('textarea[name=notes]').clear().type('jade aurora reef vale cedar tide willow coral iris atlas solstice glade mesa tide raven juniper aurora sable pine solstice zephyr juniper vale nova fern frost nectar indigo alpha kestrel zephyr onyx ra', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Stale Upload 16');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('tom.van.damme44@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('49921');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('topaz jade lagoon maple ember sage delta spruce sable cedar atlas garnet', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Incident');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save ticket').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Stale Upload 16","email":"tom.van.damme44@example.com","category":"Incident","amount":49921,"notes":"topaz jade lagoon maple ember sage delta spruce sable cedar atlas garnet"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
