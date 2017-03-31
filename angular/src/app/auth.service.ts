import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import 'rxjs/add/operator/toPromise';
import { API_URLS } from './urls';



export interface User {
  email: string;
  is_admin: boolean;
}


@Injectable()
export class AuthService {

  public loggedInUser: User = null;
  public redirectUrl: string;

  constructor(private http: Http) {}

  login(): Promise<boolean> {
    return this.http.get(API_URLS.auth.login).toPromise().then((res: Response) => {
      this.loggedInUser = res.json() as User;
      return true;
    })
    .catch((res: Response) => {
      return false;
    });
  }

  logout(): void {
    this.loggedInUser = null;
  }
}
