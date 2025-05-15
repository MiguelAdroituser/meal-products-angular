import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Product } from '../interfaces/product.interface';
// import { environments } from '../../../environments/environments';
import { environments } from '../../../environments/environments';
import { AuthHeaders } from '../interfaces/auth-headers.interface';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({providedIn: 'root'})
export class ProductsService {

  private baseUrl: string = environments.baseURL;

  constructor(
    private http: HttpClient,
    private authSerice: AuthService,
    // private webSocketService: WebSocketService,
  ) { }

  getProducts( limit: number, offset: number ):Observable<Product[]> {

    let params = new HttpParams();
    params = params.append('limit', limit.toString());
    params = params.append('offset', offset.toString());

    return this.http.get<Product[]>(`${ this.baseUrl }/api/products`, { params })

  }

  getTotalProducts():Observable<number> {

    return this.http.get<number>(`${ this.baseUrl }/api/products/total`);

  }

  getProductById( id: string ): Observable<Product|undefined> {
    return this.http.get<Product>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      )
  }

  createProduct( product: Product ): Observable<boolean> {

    const { token, headers } = this.getHeaders();

    if ( !token ) return of(false);

    return this.http.post<Product>(`${ this.baseUrl }/api/products`, product, {headers})
      .pipe(
        map(() => true ),
        catchError(err => throwError(() => err.error.message ))
      )

  }

  updateProduct( product: Product ): Observable<boolean> {

    if ( !product.id ) throw Error(`Product id is required`);

    const { token, headers } = this.getHeaders();

    if ( !token ) return of(false);

    return this.http.patch<Product>(`${ this.baseUrl }/api/products/${ product.id }`, product, {headers})
      .pipe(
        map(() => true ),
        catchError( err => throwError(() => err.error.message ))
      )

  }

  deleteProductById( id: number ): Observable<boolean> {

    const { token, headers } = this.getHeaders();

    if ( !token ) return of(false);

    return this.http.delete(`${ this.baseUrl }/api/products/${ id }`, {headers})
      .pipe(
        map(() => true ),
        catchError( err =>  throwError(() => err.error.message ))
      );

  }

  getHeaders(): AuthHeaders {
    const token =  this.authSerice.decrypt( localStorage.getItem('token') || '', 'token' );
    // const token =  '';

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);

    return {
      token,
      headers
    }
  }

}
