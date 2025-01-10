describe('Edit meal products', () => {

  /* before(() => {

    const name = 'miguel@gmail.com';
    const password = '12345678';

    cy.login( name, password )

  });

  beforeEach(() => {

    cy.visit('/meals/list')
    //select first meal and open edit modal
    cy.get('[data-cy="product-edit-button"]').first().click();

  });

  it('should display the edit modal when opened', () => {

    cy.get('[data-cy="modal-form"]').should('be.visible')
    cy.get('[data-cy="modal-form"]').contains('Name').should('be.visible')
    cy.get('[data-cy="modal-form"]').contains('Description').should('be.visible')
    cy.get('[data-cy="modal-form"]').contains('Price').should('be.visible')

  });


  it('should change the name product', () => {
    let word = 'Updated'

    // Adding the word updated to the name product
    cy.get('[data-cy="name-input-form"]').type(word)

    cy.get('[data-cy="submit-product-form"]').click()

    cy.contains('Product has been updated').should('be.visible')

    cy.get('[data-cy="modal-form"]').should('not.exist')

    //open again modal
    cy.get('[data-cy="product-edit-button"]').first().click();

    //test that name has been updated
    cy.get('[data-cy="name-input-form"]').invoke('val').then((value) => {
      expect(value).to.include(word)
    })

  });

  it('should change the description product', () => {
    let word = 'Updated'

    cy.get('[data-cy="description-input-form"]').type(word)

    cy.get('[data-cy="submit-product-form"]').click()

    cy.contains('Product has been updated').should('be.visible')

    cy.get('[data-cy="modal-form"]').should('not.exist')

    cy.get('[data-cy="product-edit-button"]').first().click();

    cy.get('[data-cy="description-input-form"]').invoke('val').then((value) => {
      expect(value).to.include(word)
    })

  });

  it('should change the price product', () => {
    let numValue = '777'

    cy.get('[data-cy="price-input-form"]').type(numValue);

    cy.get('[data-cy="submit-product-form"]').click()

    cy.contains('Product has been updated').should('be.visible')

    cy.get('[data-cy="modal-form"]').should('not.exist')

    cy.get('[data-cy="product-edit-button"]').first().click();

    cy.get('[data-cy="price-input-form"]').invoke('val').then((value) => {
      expect(value).to.include(numValue);
    })

    //close modal
    cy.get('[data-cy="cancel-product-form"]').click()

  });

  after(() => {
    cy.get('[data-cy="Logout"]').click();
  }); */

})
