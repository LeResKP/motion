import { Injectable } from '@angular/core';

import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import 'rxjs/add/operator/toPromise';
import { API_URLS } from './urls';


declare var auth2: any;


interface User {
  email: string;
}


@Injectable()
export class AuthService {

  private headers = new Headers({'Content-Type': 'application/json'});

  loggedInUser: User = null;

  constructor(private http: Http) {}

  login(): Promise<boolean> {
    return this.http.get(API_URLS.auth.login).toPromise().then((res: Response) => {
      this.loggedInUser = res.json() as User;
      return true;
    })
    .catch((res: Response) => {
      if (res.status === 401) {
        return this.signIn();
      }
      return false;
    });
  }

  logout(): void {
    this.loggedInUser = null;
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
      auth2.grantOfflineAccess().then((res: Response) => {
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
                  this.loggedInUser = res.json() as User;
                  return true;
               }).catch(() => {
                  return false;
               });
  }

}
