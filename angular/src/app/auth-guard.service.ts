import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
}                           from '@angular/router';
import { AuthService }      from './auth.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

declare var auth2: any;


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) { return true; }

    console.log('try to login the user');

    // TODO: catch popup blocked
    // TODO: if auth2 not defined we should display a message to the user
    // it comes when there is a connection issue
    if (typeof auth2 === 'undefined') {
      console.log('auth2 is not initialized');
      return false;
    }
    return auth2.grantOfflineAccess().then((res: Response) => {
      console.log('access', res);
      return this.authService.sendToken(res['code']);
    }, (res: Response) => {
      console.log('no access', res);
      return false;
    });

    // // Store the attempted URL for redirecting
    // this.authService.redirectUrl = url;

    // // Create a dummy session id
    // let sessionId = 123456789;

    // // Set our navigation extras object
    // // that contains our global query params and fragment
    // let navigationExtras: NavigationExtras = {
    //   queryParams: { 'session_id': sessionId },
    //   fragment: 'anchor'
    // };

    // // Navigate to the login page with extras
    // this.router.navigate(['/login'], navigationExtras);
  }
}
