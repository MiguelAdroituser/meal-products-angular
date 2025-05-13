import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environments } from '../../../environments/environments';
// import { environments } from '../../../environments/environments.prod';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login-reponse.interface';
import * as CryptoJS from 'crypto-js'

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseURL;
  private user?: User;

  constructor(
    private http: HttpClient
  ) {}

  login( email: string, password: string ): Observable<boolean> {

    const url = `${ this.baseUrl }/api/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => {

          this.user = user;
          localStorage.setItem('token', this.encrypt(token, 'token') )
          localStorage.setItem('name', this.encrypt(user.name, 'name'))
          localStorage.setItem('email', this.encrypt(user.email, 'email'))
          return true;

        }),
        catchError( err => throwError(() => {

          return err.error.message
        } ))
      )

  }

  checkAuthentication(): Observable<boolean> {

    if ( !localStorage.getItem('token') ) return of(false);

    return of(true);

  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

  encrypt( text: string, name: string ) {
    return CryptoJS.AES.encrypt(text, name)
      .toString()
  }

  decrypt(text: string, name: string) {

    try {

      return CryptoJS.AES.decrypt(text, name)
        .toString(CryptoJS.enc.Utf8)
    } catch (error) {
      return '';
    }

  }

}




/* PARA DEPLOY GIT HUB ACTIONS REQUERÍ ESTE CÓDIGO DONDE SE CAMBIA EL LOGIN POR TEST CRM */
/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js'; // Importa la librería CryptoJS
// import { environments } from '../../../environments/environments.prod';
import { environments } from '../../../environments/environments';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environments.baseURL;
  private secretKey = 'TU_CLAVE_SECRETA'

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, this.secretKey).toString();
  }

  checkAuthentication(): Observable<boolean> {

    if ( !localStorage.getItem('token') ) return of(false);

    return of(true);

  }

  async login(email: string, password: string): Promise<void> {
    const requestBody = { email, password };

    try {
      //SE HACE LA PETICION

      const response: any = await this.http.post(`${this.apiUrl}auth/login`, requestBody).toPromise();
      //OBTENEMOS EL TOKEN

      const token = response.id;

      const tokenCrm = response.tokenCrm
      //ENCRYPTAMOS EL TOKEN PARA GUARDARLO EN LA COOKIE
      const encryptedToken = this.encryptToken(token);
      const encryptedTokenCrm = this.encryptToken(tokenCrm)

      // Guardar el resto de los datos en otra cookie (puedes ajustar las propiedades según tus necesidades)
      const userMetadata = {
        ttl: response.ttl,
        created: response.created,
        userId: response.userId,
        booksUserId: response.booksUserId,
        role: response.role
      };

      console.log({ userMetadata });

      const currentDate = new Date();
      const futureDate = new Date(currentDate.getTime() + Number(userMetadata.ttl)*1000);

      //ENCRYPTAMOS LA METADATA DEL USUARIO
      const encryptedUserMetadata = this.encryptUserMetadata(userMetadata);
      this.cookieService.set('userMetadata', encryptedUserMetadata, { path: '/', expires: futureDate });
      // Guardar el token en la cookie existente
      this.cookieService.set('authToken', encryptedToken, { path: '/', expires: futureDate });
      this.cookieService.set('authTokenCrm', encryptedTokenCrm, { path: '/', expires: futureDate });

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  encryptUserMetadata(metadata: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(metadata), this.secretKey).toString();
    return encryptedData;
  }
  decryptUserMetadata(encryptedData: string): any {
    if(encryptedData === ''){
      encryptedData = this.cookieService.get('userMetadata');
    }
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
  getDecryptedToken(): string | null {
    const encryptedToken = this.cookieService.get('authToken');
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
      //console.log('encryptedToken',encryptedToken)
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }

  getDecryptedTokenCrm(): string | null {
    const encryptedToken = this.cookieService.get('authTokenCrm');
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
      //console.log('encryptedToken',encryptedToken)
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }

  private handleError(error: any): Observable<never> {
    // Realiza el manejo de errores aquí, como registrar o mostrar el error
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
  isLoggedIn(): boolean {
    const decryptedToken = this.getDecryptedToken();
    return decryptedToken !== null && decryptedToken !== undefined && decryptedToken !== '';
  }
  async logout(): Promise<void> {
    // Elimina las cookies relacionadas con la autenticación
    this.cookieService.delete('authToken', '/');
    this.cookieService.delete('userMetadata', '/');
    this.cookieService.delete('authTokenCrm', '/');

    this.cookieService.delete('branch', '/');

    // Verifica que las cookies han sido eliminadas
    const authToken = this.cookieService.get('authToken');
    const userMetadata = this.cookieService.get('userMetadata');
    const authTokenCrm = this.cookieService.get('authTokenCrm');
    const branch = this.cookieService.get('branch');

    if (authToken || userMetadata || authTokenCrm || branch) {
        return Promise.reject(new Error('Failed to delete cookies'));
    }

    // Puedes realizar cualquier otra limpieza necesaria, como redirigir al usuario, etc.
    return Promise.resolve(); // Se completa inmediatamente, ya que las operaciones anteriores son sincrónicas
  }

  getDecryptedUserMetadata(): any | null {
    const encryptedUserMetadata = this.cookieService.get('userMetadata');
    if (encryptedUserMetadata) {
      const decryptedData = this.decryptUserMetadata(encryptedUserMetadata);
      return decryptedData;
    }
    return null;
  }
} */


