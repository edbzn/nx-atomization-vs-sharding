import { TagEditor } from './TagEditor';

describe('TagEditor adding', () => {
  it('edits a list of 6 tag operations', () => {
    const onChange = cy.stub().as('change');
    cy.mount(<TagEditor onChange={onChange} />);
    cy.get('input[name=new-tag]').type('delta flint{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('zinc juniper{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('lumen solstice{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('button[aria-label="Remove delta-flint"]').click();
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('velvet ridge{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('ZINC{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '4 tags');
    cy.get('[data-testid=tag]').should('have.length', 4);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('@change').should('have.callCount', 6);
    cy.get('@change').its('lastCall.args.0').should('deep.equal', ["zinc-juniper","lumen-solstice","velvet-ridge","zinc"]);
  });
});
