import { TagEditor } from './TagEditor';

describe('TagEditor normalization 2', () => {
  it('edits a list of 6 tag operations', () => {
    const onChange = cy.stub().as('change');
    cy.mount(<TagEditor onChange={onChange} />);
    cy.get('input[name=new-tag]').type('topaz51{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('tide{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('zephyr{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('cedar apex{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '4 tags');
    cy.get('[data-testid=tag]').should('have.length', 4);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('RIVER{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '5 tags');
    cy.get('[data-testid=tag]').should('have.length', 5);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('EMBER{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '6 tags');
    cy.get('[data-testid=tag]').should('have.length', 6);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('@change').should('have.callCount', 6);
    cy.get('@change').its('lastCall.args.0').should('deep.equal', ["topaz51","tide","zephyr","cedar-apex","river","ember"]);
  });
});
