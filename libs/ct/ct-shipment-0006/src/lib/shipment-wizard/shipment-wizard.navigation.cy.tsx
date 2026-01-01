import { ShipmentWizard } from './ShipmentWizard';

describe('ShipmentWizard navigation', () => {
  it('creates a shipment in three steps with 2 tags', () => {
    const onComplete = cy.stub().as('complete');
    cy.mount(<ShipmentWizard onComplete={onComplete} />);
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 1 of 3: Details');
    cy.get('input[name=wizard-name]').clear().type('Lena Desmet');
    cy.get('select[name=wizard-category]').select('Delivered');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=wizard-step]').should('have.text', 'Step 2 of 3: Tags');
    cy.get('input[name=new-tag]').type('TUNDRA{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '1 tag');
    cy.get('[data-testid=tag]').should('have.length', 1);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.get('input[name=new-tag]').type('pine25{enter}');
    cy.get('[data-testid=tag-count]').should('have.text', '2 tags');
    cy.get('[data-testid=tag]').should('have.length', 2);
    cy.get('[data-testid=tag-message]').should('not.exist');
    cy.contains('button', 'Next').click();
    cy.get('[data-testid=review-name]').should('have.text', 'Lena Desmet');
    cy.get('[data-testid=review-category]').should('have.text', 'Delivered');
    cy.get('[data-testid=review-tags]').should('have.text', 'tundra, pine25');
    cy.contains('button', 'Create shipment').click();
    cy.get('@complete').should('have.been.calledOnceWith', {"name":"Lena Desmet","category":"Delivered","tags":["tundra","pine25"]});
    cy.contains('[role=status]', 'Created Lena Desmet').should('be.visible');
  });
});
