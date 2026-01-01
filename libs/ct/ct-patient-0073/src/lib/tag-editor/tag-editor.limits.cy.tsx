import { TagEditor } from './TagEditor';

describe('TagEditor limits', () => {
  it('edits a list of 4 tag operations', () => {
    const onChange = cy.stub().as('change');
    cy.mount(<TagEditor onChange={onChange} />);
    cy.get('input[name=new-tag]').type('orbit reef{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('hazel33{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('sable{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('umber{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '4 tags');
    cy.get('[data-testid=tag]').should('have.length', 4);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('@change').should('have.callCount', 4);
    cy.get('@change').its('lastCall.args.0').should('deep.equal', ["orbit-reef","hazel33","sable","umber"]);
  });
});
