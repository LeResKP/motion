import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
} from '@angular/router';
import { AuthService } from './auth.service';
import { URLS } from './urls';
import { GoogleAuth2Service } from './google-auth2.service';
import { KeyService } from './key.service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router,
              private keyService: KeyService, private googleAuth2Service: GoogleAuth2Service) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): Promise<boolean> {
    if (this.authService.loggedInUser) { return Promise.resolve(true); }

    return this.keyService.getKeys().then((keys: any) => {
      return this.googleAuth2Service.initAuth2(keys.google_oauth2_client_id).then((logged: boolean) => {
        if (logged) {
          return Promise.resolve(true);
        } else {
          if (url !== URLS.login) {
            this.router.navigate([URLS.login]);
            return Promise.resolve(false);
          } else {
            return Promise.resolve(true);
          }
        }
      });
    }).catch(() => {
      return Promise.resolve(false);
    });
  }
}
