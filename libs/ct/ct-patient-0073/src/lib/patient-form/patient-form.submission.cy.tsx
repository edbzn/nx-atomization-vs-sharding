import { PatientForm } from './PatientForm';

describe('PatientForm submission', () => {
  it('validates and saves a patient (9 interactions)', () => {
    const onSubmit = cy.stub().as('submit');
    cy.mount(<PatientForm onSubmit={onSubmit} />);
    cy.contains('button', 'Save patient').click();
    cy.get('[data-testid=error-summary]').should('have.text', '4 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('textarea[name=notes]').clear().type('lark hazel birch amber blaze topaz tide lagoon mesa jade solstice lark reef tundra solstice onyx willow fern prism quartz alpha tundra ember iris lagoon drift nectar willow lagoon glade lagoon comet no', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('[data-testid=error-summary]').should('have.text', '5 errors');
    cy.contains('[role=alert]', 'Name is required').should('be.visible');
    cy.contains('[role=alert]', 'Email is required').should('be.visible');
    cy.contains('[role=alert]', 'Category is required').should('be.visible');
    cy.contains('[role=alert]', 'Amount is required').should('be.visible');
    cy.contains('[role=alert]', 'Notes must be at most 200 characters').should('be.visible');
    cy.get('@submit').should('have.callCount', 0);
    cy.get('input[name=name]').clear().type('Ines Goossens 60');
    cy.get('input[name=name]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=email]').clear().type('noor.claessens16@example.com', { delay: 0 });
    cy.get('input[name=email]').should('not.have.attr', 'aria-invalid');
    cy.get('input[name=amount]').clear().type('38636');
    cy.get('input[name=amount]').should('not.have.attr', 'aria-invalid');
    cy.get('textarea[name=notes]').clear().type('jade cedar amber jade velvet indigo frost quartz glade', { delay: 0 });
    cy.get('textarea[name=notes]').should('not.have.attr', 'aria-invalid');
    cy.get('select[name=category]').select('Waiting');
    cy.get('select[name=category]').should('not.have.attr', 'aria-invalid');
    cy.contains('button', 'Save patient').click();
    cy.get('@submit').should('have.callCount', 1);
    cy.get('@submit').its('lastCall.args.0').should('deep.equal', {"name":"Ines Goossens 60","email":"noor.claessens16@example.com","category":"Waiting","amount":38636,"notes":"jade cedar amber jade velvet indigo frost quartz glade"});
    cy.get('[data-testid=error-summary]').should('not.exist');
  });
});
