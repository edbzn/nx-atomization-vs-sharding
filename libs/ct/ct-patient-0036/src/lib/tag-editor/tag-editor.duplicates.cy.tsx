import { TagEditor } from './TagEditor';

describe('TagEditor duplicates', () => {
  it('edits a list of 5 tag operations', () => {
    const onChange = cy.stub().as('change');
    cy.mount(<TagEditor onChange={onChange} />);
    cy.get('input[name=new-tag]').type('topaz tundra{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('lumen54{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('mesa aurora{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('coral39{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '4 tags');
    cy.get('[data-testid=tag]').should('have.length', 4);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('button[aria-label="Remove lumen54"]').click();
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('@change').should('have.callCount', 5);
    cy.get('@change').its('lastCall.args.0').should('deep.equal', ["topaz-tundra","mesa-aurora","coral39"]);
  });
});
