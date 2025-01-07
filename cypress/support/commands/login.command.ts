
import * as CryptoJS from 'crypto-js'

  declare global {
    namespace Cypress {
      interface Chainable {
        login(email: string, password: string): Chainable<void>
      }
    }
  }

  Cypress.Commands.add('login', (email: string, password: string) => {

    cy.visit('/')
    // Configura la URL de tu API y la clave secreta
    const apiUrl = 'http://localhost:3000/api/';
    // const secretKey = 'TU_CLAVE_SECRETA';

    // Realiza la petición de inicio de sesión
    cy.request({
      method: 'POST',
      url: `${apiUrl}auth/login`,
      body: {
        email: email,
        password: password
      }
    }).then((response) => {

      // Extrae el token y los metadatos del usuario de la respuesta
      const token = response.body.token;
      const name = response.body.user.name;
      const email = response.body.user.email;

      cy.log(token)
      // Encripta el token y los metadatos del usuario
      let encryptedToken = CryptoJS.AES.encrypt(token, 'token').toString();
      let encryptedName = CryptoJS.AES.encrypt(name, 'name').toString();
      let encryptedEmail = CryptoJS.AES.encrypt(email, 'email').toString();

      // Establece items en localStorage
      window.localStorage.setItem('token', encryptedToken);
      window.localStorage.setItem('name', encryptedName);
      window.localStorage.setItem('email', encryptedEmail);

      // Opcional: verifica que el inicio de sesión fue exitoso
      // Aquí puedes añadir aserciones para confirmar que el inicio de sesión funcionó como se esperaba
    });
  });
  // En tu archivo de comandos de Cypress (usualmente en cypress/support/commands.js)

/* Cypress.Commands.add('getDecryptedToken', () => {
    const secretKey = 'TU_CLAVE_SECRETA'; // Asegúrate de que esta sea la clave correcta

    return cy.getCookie('authToken').then((cookie) => {
        if (!cookie || !cookie.value) {
            throw new Error('No se encontró la cookie authToken');
        }

        const decryptedBytes = CryptoJS.AES.decrypt(cookie.value, secretKey);
        const token = decryptedBytes.toString(CryptoJS.enc.Utf8);

        return token; // Retorna el token desencriptado
    });
}); */

/* Cypress.Commands.add('getDecryptedUserData', () => {
  const secretKey = 'TU_CLAVE_SECRETA'; // Asegúrate de que esta sea la clave correcta

  return cy.getCookie('userMetadata').then((cookie) => {
      if (!cookie || !cookie.value) {
          throw new Error('No se encontró la cookie userMetadata');
      }

      const decryptedBytes = CryptoJS.AES.decrypt(cookie.value, secretKey);
      const user = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

      return user; // Retorna el token desencriptado
  });
}); */
