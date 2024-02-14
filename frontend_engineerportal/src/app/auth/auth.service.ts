import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, catchError, finalize } from 'rxjs/operators';

import { ServiceAPIs } from '../core/services/service-apis.service';
import { UtilService } from '../services/util.service';
import { User } from '../model/user.interface';

/**
 * @description service for admin authentication
 * @param {BehaviorSubject<boolean>} loggedIn - Behavioural subject keep initial login status and emits latest loggin status
 * @param {Observable<boolean>} loggedIn$ - BehaviourSubject public observable
 */
@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private serviceAPIs: ServiceAPIs, private utilService: UtilService) {
    this.isLoggedIn();
  }

  /**
   * @description to emit login status
   * @return void
   */
  isLoggedIn(): void {
    this.loggedIn.next(this.getLoggedIn());
  }

  /**
   * @description to authenticate admmin user based on token
   * @param {boolean} isLoggedIn - to keep login status
   * @return boolean - gets logged-in status
   */
  getLoggedIn(): boolean {
    let isLoggedIn: boolean = false;
    if (this.utilService.getAuthToken()) {
      isLoggedIn = true;
    }
    return isLoggedIn;
  }

  /**
   * @description This is an endpoint to authenticate token
   * @argument {Any} payload - contains the request object
   * @return {Observable<any>} - observable response
   */
  validateAuthentication(payload: any, extend: boolean = false): Observable<any> {
    const requestURL = this.serviceAPIs.getApiUrl('ADMIN_VALIDATE_AUTH') + "/?extend=" + extend;
    return this.http.post(requestURL, payload).pipe(
      map((response: any) => {
        this.setAdminCookies(response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  /**
   * @description To set admin authentication cookies
   * @param {Any} response - contains the response object
   */
  setAdminCookies(response): void {
    if (response.cookies && response.expires) {
      let date = new Date(response.expires);
      for (const cookie in response.cookies) {
        if (response.cookies.hasOwnProperty(cookie)) {
          document.cookie = cookie + "=" +
          response.cookies[cookie] + "; expires=" +
          date.toString() + "; path=/";
        }
      }
    }
  }

  /**
   * @description This is an endpoint to authenticate admin credentials in Admin collection
   * @argument {User} payload - contains the request object
   * @return {Observable<any>} - observable response
   */
  authenticateAdmin(payload: User): Observable<any> {
    const requestURL = this.serviceAPIs.getApiUrl('ADMIN_LOGIN');
    return this.http.post(requestURL, payload).pipe(
      map((response: any) => {
        this.setAdminCookies(response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  /**
   * @description This is an endpoint to register admin in Admin collection
   * @argument {User} payload - contains the request object
   * @return {Observable<any>} - observable response
   */
  registerAdmin(payload: User): Observable<any> {
    const requestURL = this.serviceAPIs.getApiUrl('ADMIN_REGISTER');
    return this.http.post(requestURL, payload).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  /**
   * @description http request to logout admin and update the token respectively
   * @param {any} payload - request payload
   * @return {Observable<any>} - observable response
   */
  logoutAdmin(payload: any): Observable<any> {
    const requestURL = this.serviceAPIs.getApiUrl('ADMIN_LOGOUT');
    return this.http.post(requestURL, payload).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
