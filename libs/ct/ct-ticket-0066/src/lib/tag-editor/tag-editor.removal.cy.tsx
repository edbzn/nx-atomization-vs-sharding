import { TagEditor } from './TagEditor';

describe('TagEditor removal', () => {
  it('edits a list of 2 tag operations', () => {
    const onChange = cy.stub().as('change');
    cy.mount(<TagEditor onChange={onChange} />);
    cy.get('input[name=new-tag]').type('nectar26{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('  nectar26 {enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('have.text', '"nectar26" is already added');
    cy.get('@change').should('have.callCount', 1);
    cy.get('@change').its('lastCall.args.0').should('deep.equal', ["nectar26"]);
  });
});
