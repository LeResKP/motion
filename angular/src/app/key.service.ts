import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/toPromise';

import { API_URLS } from './urls';


@Injectable()
export class KeyService {

  public keys: any = null;

  constructor(private http: Http) {}

  getKeys(): Promise<boolean> {
    if (this.keys) {
      return Promise.resolve(this.keys);
    }

    const keys = localStorage.getItem('keys');
    if (keys) {
      this.keys = JSON.parse(keys);
      return Promise.resolve(this.keys);
    }

    return this.http.get(API_URLS.keys.info).toPromise().then((res: Response) => {
      this.keys = res.json() as {};
      localStorage.setItem('keys', JSON.stringify(this.keys));
      return this.keys;
    })
    .catch((res: Response) => {
      Promise.reject(res);
    });
  }
}
