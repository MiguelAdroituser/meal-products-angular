describe('Delete meal products', () => {

  before(() => {

    const name = 'miguel@gmail.com';
    const password = '12345678';

    cy.login( name, password )
  });

  beforeEach(() =>  cy.visit('/meals/list') );

  it('should display confirmation modal when clicking delete button', () => {

    cy.get('[data-cy="product-delete-button"]').first().click();

    cy.contains('Are you sure?').should('be.visible');
    cy.contains("You won't be able to revert this!").should('be.visible');

  });

  it('should user to confirm product deletion', () => {

    cy.get('[data-cy="product-delete-button"]').first().click();

    cy.contains('Yes, delete it!').click();

    cy.contains('Product deleted successfully').should('be.visible')

  });

  it('should user to cancel product deletion', () => {

    cy.get('[data-cy="product-delete-button"]').first().click();

    cy.contains('Cancel').click();

  });

  after(() => {
     cy.get('[data-cy="Logout"]').click();
  });

})
