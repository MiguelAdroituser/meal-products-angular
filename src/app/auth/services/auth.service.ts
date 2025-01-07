import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
