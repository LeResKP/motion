import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { API_URLS } from './urls';
import { AuthService, User } from './auth.service';


const CLIENT_ID = '682542060334-jbvvv7b86p1hcsdno4pg1i2srnnbrntg.apps.googleusercontent.com';

declare var gapi: any;


@Injectable()
export class GoogleAuth2Service {

  private headers = new Headers({'Content-Type': 'application/json'});

  public auth2: any;
  public error: boolean;

  constructor(private http: Http, private router: Router, private authService: AuthService) {}

  setAuth2loaded() {
    const that = this;
    window['auth2loaded'] = function() {
      gapi.load('auth2', function() {
        return that.auth2loaded();
      });
    };
  }

  auth2loaded() {
    this.auth2 = gapi.auth2.init({
      client_id: CLIENT_ID,
    });
    const that = this;
    this.auth2.then(function() {
      that.signIn().then(() => {
        that.router.navigate([that.authService.redirectUrl || '/']);
      }).catch(() => {
        that.error = true;
      });
    });
  }

  getScriptElement() {
    this.setAuth2loaded();
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://apis.google.com/js/client:platform.js?onload=auth2loaded';
    return s;
  }

  signIn(): Promise<boolean> {
    return this.getToken().then((token: string) => {
      return this.sendToken(token);
    }).catch(() => {
      return false;
    });
  }

  getToken() {
    return new Promise((resolve, reject) => {
      // TODO: catch popup blocked to display the info to the user
      this.auth2.grantOfflineAccess().then((res: Response) => {
        resolve(res['code']);
      }, (res: Response) => {
        reject();
      });
    });
  }

  sendToken(token: string): Promise<boolean> {
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
