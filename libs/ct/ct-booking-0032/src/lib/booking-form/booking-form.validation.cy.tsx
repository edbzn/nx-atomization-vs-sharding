import { BookingForm } from './BookingForm';

describe('BookingForm validation', () => {
  it('validates and saves a booking (8 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.get('textarea[name=notes]').clear().type('delta pine nova vale indigo meadow spruce ridge pine', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=amount]').clear().type('15597');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Train');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Ab');
    cy.get('input[name=name]').should('have.attr', 'aria-invalid', 'true');
    cy.get('input[name=name]').parent().find('[role=alert]').should('have.text', 'Name must be at least 3 characters');
    cy.get('input[name=name]').clear().type('Lena Verhoeven');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('sara.claessens82@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Lena Verhoeven","email":"sara.claessens82@example.com","category":"Train","amount":15597,"notes":"delta pine nova vale indigo meadow spruce ridge pine"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });

  it('validates and saves a booking (7 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<BookingForm onSubmit={onSubmit} />);
    cy.get('textarea[name=notes]').clear().type('ember nectar onyx onyx summit topaz kestrel flint umber comet ridge summit frost orbit orbit pine lumen juniper glade reef alpha falcon ember tundra oak zinc nectar kestrel nova topaz pebble nova zephy', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=name]').clear().type('Ruben Cools');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('bea.verhoeven87@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('21512');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('harbor harbor tundra maple iris garnet kestrel pine iris iris pebble delta prism quartz', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Hotel');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save booking').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Ruben Cools","email":"bea.verhoeven87@example.com","category":"Hotel","amount":21512,"notes":"harbor harbor tundra maple iris garnet kestrel pine iris iris pebble delta prism quartz"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
