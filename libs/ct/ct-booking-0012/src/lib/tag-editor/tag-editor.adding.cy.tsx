import { TagEditor } from './TagEditor';

describe('TagEditor adding', () => {
  it('edits a list of 8 tag operations', () => {
    const onChange = cy.stub().as('change');
    cy.mount(<TagEditor onChange={onChange} />);
    cy.get('input[name=new-tag]').type('birch reef{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('ember36{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('lark{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '3 tags');
    cy.get('[data-testid=tag]').should('have.length', 3);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('glade70{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '4 tags');
    cy.get('[data-testid=tag]').should('have.length', 4);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('REEF{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '5 tags');
    cy.get('[data-testid=tag]').should('have.length', 5);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('button[aria-label="Remove birch-reef"]').click();
    cy.get('[data-testid=tag-count]').should('have.text', '4 tags');
    cy.get('[data-testid=tag]').should('have.length', 4);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('drift{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '5 tags');
    cy.get('[data-testid=tag]').should('have.length', 5);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('comet{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '6 tags');
    cy.get('[data-testid=tag]').should('have.length', 6);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('@change').should('have.callCount', 8);
    cy.get('@change').its('lastCall.args.0').should('deep.equal', ["ember36","lark","glade70","reef","drift","comet"]);
  });

  it('edits a list of 1 tag operations', () => {
    const onChange = cy.stub().as('change');
    cy.mount(<TagEditor onChange={onChange} />);
    cy.get('input[name=new-tag]').type('amber coral{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('@change').should('have.callCount', 1);
    cy.get('@change').its('lastCall.args.0').should('deep.equal', ["amber-coral"]);
  });
});
