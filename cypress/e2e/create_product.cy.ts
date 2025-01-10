
describe('create new meal products', () => {

  /* before(() => {
    const name = 'miguel@gmail.com';
    const password = '12345678';

    cy.login( name, password )
  });

  beforeEach(() => {
    cy.visit('/meals/list')
    //open modal
    cy.get('[data-cy="create-product"]').click();

  })

  it('should display the modal when opened', () => {

    cy.get('[data-cy="modal-form"]').should('be.visible')
    cy.get('[data-cy="modal-form"]').contains('Name').should('be.visible')
    cy.get('[data-cy="modal-form"]').contains('Description').should('be.visible')
    cy.get('[data-cy="modal-form"]').contains('Price').should('be.visible')

  })

  it('should user to create a new meal', () => {

    cy.get('[data-cy="name-input-form"]').type('Test Meal Product');
    cy.get('[data-cy="name-input-form"]').should('have.value', 'Test Meal Product')

    cy.get('[data-cy="description-input-form"]').type('this is the description of meal');
    cy.get('[data-cy="description-input-form"]').should('have.value', 'this is the description of meal')

    cy.get('[data-cy="price-input-form"]').type('210');
    cy.get('[data-cy="price-input-form"]').should('have.value', '210')

    cy.get('[data-cy="submit-product-form"]').click()

    cy.contains('Product has been saved').should('be.visible')

    // Must appear in the first row
    cy.contains('Test Meal Product').should('exist')

  })

  it('should throw an error with empty name', () => {

    cy.get('[data-cy="description-input-form"]').type('this is the description of meal');
    cy.get('[data-cy="description-input-form"]').should('have.value', 'this is the description of meal')

    cy.get('[data-cy="price-input-form"]').type('210');
    cy.get('[data-cy="price-input-form"]').should('have.value', '210')

    cy.get('[data-cy="submit-product-form"]').click()

    cy.contains('Please fill out the form correctly').should('be.visible')

    cy.get('[data-cy="modal-form"]').should('be.visible')

  })

  it('should throw an error with empty description', () => {

    cy.get('[data-cy="name-input-form"]').type('Test Meal Product');
    cy.get('[data-cy="name-input-form"]').should('have.value', 'Test Meal Product')

    cy.get('[data-cy="price-input-form"]').type('210');
    cy.get('[data-cy="price-input-form"]').should('have.value', '210')

    cy.get('[data-cy="submit-product-form"]').click()

    cy.contains('Please fill out the form correctly').should('be.visible')

    cy.get('[data-cy="modal-form"]').should('be.visible')

  })

  it('should throw an error with empty price', () => {

    cy.get('[data-cy="name-input-form"]').type('Test Meal Product');
    cy.get('[data-cy="name-input-form"]').should('have.value', 'Test Meal Product')

    cy.get('[data-cy="description-input-form"]').type('this is the description of meal');
    cy.get('[data-cy="description-input-form"]').should('have.value', 'this is the description of meal')

    cy.get('[data-cy="submit-product-form"]').click()

    cy.contains('Please fill out the form correctly').should('be.visible')

    cy.get('[data-cy="modal-form"]').should('be.visible')

  })

  it('should throw an error when name is repeated', () => {

    cy.get('[data-cy="name-input-form"]').type('Test Meal Product');
    cy.get('[data-cy="name-input-form"]').should('have.value', 'Test Meal Product')

    cy.get('[data-cy="description-input-form"]').type('this is the description of meal');
    cy.get('[data-cy="description-input-form"]').should('have.value', 'this is the description of meal')

    cy.get('[data-cy="price-input-form"]').type('210');
    cy.get('[data-cy="price-input-form"]').should('have.value', '210')

    cy.get('[data-cy="submit-product-form"]').click()

    cy.contains('Product name already exists').should('be.visible')

    cy.get('[data-cy="modal-form"]').should('be.visible')

    //close modal form
    cy.get('[data-cy="cancel-product-form"]').click()

  })

  after(() => {
    cy.get('[data-cy="Logout"]').click();
  }); */


})

