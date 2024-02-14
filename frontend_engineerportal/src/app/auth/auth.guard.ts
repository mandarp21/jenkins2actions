import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';

import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private cookiesService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  /**
   * @description Check admin authentication before navigating to any route
   * @return {boolean} - Admin autherized to access the
   */
  checkLogin(url: string): boolean {
    if (this.authService.getLoggedIn()) {
      return true;
    }

    // Store the attempted URL for redirecting
    // this.loginService.redirectUrl = url;

    // Navigate to the login page with extras
    this.authService.isLoggedIn();
    this.router.navigate(['/login']);
    return false;
  }
}
