import { Injectable } from '@angular/core';

import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import 'rxjs/add/operator/toPromise';
import { API_URLS, url_replacer } from './urls';

@Injectable()
export class AuthService {

  private headers = new Headers({'Content-Type': 'application/json'});

  isLoggedIn: boolean = false;

  constructor(private http: Http) {}

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(): void { // Promise<boolean> { // Observable<boolean> {
    this.http.get(API_URLS.auth.login).toPromise()
                    .then(() => this.isLoggedIn = true)
                    .catch((res: Response) => {
                      if (res.status === 403) {
                        console.log('RUN LOGIN')
                      }
                    });
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  sendToken(token: string): Promise<boolean> {
    return this.http.post(API_URLS.auth.login, JSON.stringify({token}), {headers: this.headers})
               .toPromise()
               .then((res: Response) => {
                console.log('sendToken', res);
                this.isLoggedIn = true;
                  return true;
               }).catch(() => {
                  return false;
               });
  }
}
