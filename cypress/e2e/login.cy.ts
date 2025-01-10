
/* describe('Login', () => {

  beforeEach(() => {
    cy.visit('/')
  });

  it('Credentials no valid', () => {

    cy.visit('/')
    cy.get('[data-cy="email"]').type('usernotexist@gmail.com')
    cy.get('[data-cy="password"]').type('10101010')
    cy.get('[data-cy="submit"]').click()

    //sweet alert message
    cy.contains('Credentials are not valid').should('be.visible')

    // it keeps url auth/login yet due to credentials are wrong
    cy.url().should('include', '/auth/login')


  })

  it('Logging in correctly', () => {

    cy.visit('/')

    //If I do not have token: Redirect to /auth/login
    cy.url().should('include', '/auth/login')

    // Type email into email input
    cy.get('[data-cy="email"]').type('miguel@gmail.com')

    // Verify email has been written
    cy.get('[data-cy="email"]').should('have.value', 'miguel@gmail.com')

    // Type password into password input
    cy.get('[data-cy="password"]').type('12345678')

    // Verify password has been written
    cy.get('[data-cy="password"]').should('have.value', '12345678')

    cy.get('[data-cy="submit"]').click()

    //include /meals/list
    cy.url().should('include', '/meals/list')

    //token exists
    cy.window().then(window => {
      const token = window.localStorage.getItem('token');
      expect(token).to.not.be.null;
    })

    //Verify that user email appears in navbar
    cy.get('[data-cy="userEmail"]').should('contain', 'miguel@gmail.com')


  })

  after(() => {
    cy.get('[data-cy="Logout"]').click();
  });


}) */

describe('Login Page', () => {
  before(() => {
    // cy.logout();
  });
  beforeEach(() => {
    /* cy.visit('/login');
    cy.viewport('iphone-x') // Asegúrate de que esta URL sea correcta */
    cy.visit('/')
  });

  it('should display email input in login form', () => {
    cy.get('[data-cy="email"]').should($el => {
      expect($el).to.be.visible;
    });
  });

  it('should display input password in login form', () => {
    cy.get('[data-cy="password"]').should($el => {
      expect($el).to.be.visible;
    })

  });

  it('should display button submit in login form', () => {
    cy.get('[data-cy="submit"]').should($el => {
      expect($el).to.be.visible;
    })
  });

  it('Credentials no valid', () => {

    cy.visit('/')
    cy.get('[data-cy="email"]').type('usernotexist@gmail.com')
    cy.get('[data-cy="password"]').type('10101010')
    cy.get('[data-cy="submit"]').click()

    //sweet alert message
    // cy.contains('Credentials are not valid').should('be.visible')

    // it keeps url auth/login yet due to credentials are wrong
    cy.url().should('include', '/auth/login')


  })

  it('should log in successfully with valid credentials', () => {
    cy.get('[data-cy="email"]').type('zarely@adroitoverseas.com');
    cy.get('[data-cy="password"]').type('lalala');
    // cy.get('button[type="submit"].bg-redLogin').click({ force: true });
    cy.get('[data-cy="submit"]').click()
 
    
    /* cy.get('img[src="../../../../assets/png/agswift-books-2024.svg"]').should($el=>{
      expect($el).to.be.visible;
    }); */
    
  });

  /* 
  */
 

});

