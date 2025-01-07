
describe('fetch and display meal products', () => {

  before(() => {

    const name = 'miguel@gmail.com';
    const password = '12345678';

    cy.login( name, password )

  });

  beforeEach(() =>  cy.visit('/meals/list') );

  it('displays at least one product', () => {

    // Verify url: /meals/list
    cy.url().should('include', '/meals/list')

    // Verify a row of products exists
    cy.get('[data-cy="product-tr"]').should('exist')

  })

  it('should filter table products based on search input', () => {

    const searchTerm: string = 'Kubbeh';

    cy.get('[data-cy="search-input"]').type(searchTerm)

    cy.contains(searchTerm).should('be.visible')

    cy.get('[data-cy="product-tr"]').its('length').should('eq', 1)

  });

  it('should exist an empty table with searching not found', () => {

    const searchTerm: string = 'productNotExist';

    cy.get('[data-cy="search-input"]').type(searchTerm)

    cy.get('table tbody tr').should('have.length', 0);

  });

  it('displays 10 products per page', () => {

    cy.get('[data-cy="product-tr"]').its('length').should('eq', 10)

  })


  it('displays the properties for each product', () => {

    cy.get('[data-cy="product-tr"]').each((meal) => {

      cy.wrap(meal).within(() => {
        // Check for meal name, description, price
        cy.get('[data-cy="product-name"]').should('exist');
        cy.get('[data-cy="product-description"]').should('exist');
        cy.get('[data-cy="product-price"]').should('exist');

      });

    })

  })

  after(() => {
     cy.get('[data-cy="Logout"]').click();
  });


})
