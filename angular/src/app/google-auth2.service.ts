import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { API_URLS, URLS } from './urls';
import { AuthService, User } from './auth.service';
import { KeyService } from './key.service';


declare var gapi: any;


@Injectable()
export class GoogleAuth2Service {

  private headers = new Headers({'Content-Type': 'application/json'});

  public error: boolean;

  constructor(private http: Http, private router: Router, private authService: AuthService, private keyService: KeyService) {}


  initAuth2(clientId: string) {
    const that = this;
    return new Promise((resolve, reject) => {
      gapi.load('auth2', function() {
        gapi.auth2.init({
          client_id: clientId,
        }).then((googleAuth: any) => {
          if (googleAuth.isSignedIn.get()) {
            const idToken = googleAuth.currentUser.get().getAuthResponse().id_token;
            that.sendToken(idToken).then(() => {
              resolve(true);
            }).catch(() => {
              resolve(false);
            });
          } else {
            resolve(false);
          }
        });
      }, function() {
        resolve(false);
      });
    });
  }

  initSignInButton(elementId: string) {
    const that = this;
    this.keyService.getKeys().then((keys: any) => {
      gapi.auth2.init({
        client_id: keys.google_oauth2_client_id,
      }).then((googleAuth: any) => {
        if (googleAuth.isSignedIn.get()) {
          // The user is already logged, we don't need to display the button
          that.onSuccess(googleAuth.currentUser.get());
        } else {
          googleAuth.attachClickHandler(elementId, {},
            function(googleUser: any) { that.onSuccess(googleUser); },
            that.onFailure
          );
        }
      });
    });
  }

  onSuccess(googleUser: any) {
    const id_token = googleUser.getAuthResponse().id_token;
    this.sendToken(id_token).then((logged: boolean) => {
      if (logged) {
        this.router.navigate([this.authService.redirectUrl || '/']);
      } else {
        this.error = true;
      }
    });
  }

  onFailure(e: any) {
    console.log('FAILURE', e);
  }

  signOut(): void {
    // logout the user on the client and server side
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      return this.http.post(API_URLS.auth.logout, '', {headers: this.headers})
               .toPromise()
               .then((res: Response) => {
                  this.authService.loggedInUser = null;
                  this.router.navigate([URLS.login]);
                  return true;
               }).catch(() => {
                 // TODO: retry?
                  return false;
               });
    });
  }

  sendToken(token: string): Promise<boolean> {
    // Log the user on the server side
    return this.http.post(API_URLS.auth.login, JSON.stringify({token}), {headers: this.headers})
               .toPromise()
               .then((res: Response) => {
                  this.authService.loggedInUser = res.json() as User;
                  return true;
               }).catch(() => {
                  return false;
               });
  }

}
