import { BookingForm } from './BookingForm';

describe('BookingForm email', () => {
  it('validates and saves a booking (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.get('textarea[name=notes]').clear().type('indigo meadow ember cedar umber nectar zinc cobalt topaz solstice ridge cobalt iris frost pebble spruce cedar willow coral oak lagoon sage reef quartz blaze frost zinc solstice prism tundra lark harbor', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('[data-testid=error-summary]').should('have.text', '5 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.contains('[role=alert]', 'Notes must be at most 200 characters').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Late Seville 52');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('yara.desmet68@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('15353');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('topaz kestrel fern jade prism zinc river zinc drift juniper raven zinc oak maple', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Car');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Late Seville 52","email":"yara.desmet68@example.com","category":"Car","amount":15353,"notes":"topaz kestrel fern jade prism zinc river zinc drift juniper raven zinc oak maple"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
