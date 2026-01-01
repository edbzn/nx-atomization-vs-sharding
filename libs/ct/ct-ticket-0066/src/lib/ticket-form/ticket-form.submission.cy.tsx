import { TicketForm } from './TicketForm';

describe('TicketForm submission', () => {
  it('validates and saves a ticket (7 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<TicketForm onSubmit={onSubmit} />);
    cy.get('textarea[name=notes]').clear().type('tide ridge iris delta jade mesa mesa onyx reef sage onyx frost fern sage pebble zinc iris lumen nova flint coral pebble amber garnet vale drift comet summit spruce garnet mesa comet tide drift vale atl', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Flaky Report 9');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('oscar.hendrickx4@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('99712');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('aurora summit coral cedar lagoon spruce', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Feature');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save ticket').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Flaky Report 9","email":"oscar.hendrickx4@example.com","category":"Feature","amount":99712,"notes":"aurora summit coral cedar lagoon spruce"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
