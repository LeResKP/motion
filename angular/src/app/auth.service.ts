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
  private _adminViewEnabled: boolean = null;

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

  adminViewEnabled() {
    if (!this.loggedInUser.is_admin) {
      return false;
    }
    if (this._adminViewEnabled !== null) {
      return this._adminViewEnabled;
    }

    const value = localStorage.getItem('admin_view_enabled');
    if (value === null) {
      this._adminViewEnabled = false;
      localStorage.setItem('admin_view_enabled', 'false');
    } else if (value === 'false') {
      this._adminViewEnabled = false;
    } else {
      this._adminViewEnabled = true;
    }
    return this._adminViewEnabled;
  }

  toggleAdminView() {
    if (!this.loggedInUser.is_admin) {
      return false;
    }
    // Make sure it's initialized.
    // TODO: nicer way
    this.adminViewEnabled();

    this._adminViewEnabled = !this._adminViewEnabled;
    localStorage.setItem('admin_view_enabled', this._adminViewEnabled.toString());
  }
}
