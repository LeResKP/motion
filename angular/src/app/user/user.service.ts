import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { MdDialog } from '@angular/material';

import 'rxjs/add/operator/toPromise';
import { Subject} from 'rxjs/Rx';

import { User } from './user';
import { API_URLS, url_replacer } from '../urls';


@Injectable()
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  getUsers(): Promise<User[]> {
    return this.http.get(API_URLS.user.info)
               .toPromise()
               .then(response => response? response.json().users as User[]: []);
  }

  getUser(id:number): Promise<User> {
    const url: string = url_replacer(API_URLS.user.id, {userId: id});
    return this.http.get(url)
               .toPromise()
               .then(response=>response?response.json().user as User: null);
  }

  update(user: User): Promise<User> {
    const url: string = url_replacer(API_URLS.user.id, {userId: user.id});
    return this.http.put(url, JSON.stringify(user), {headers: this.headers})
               .toPromise()
               .then(() => user);
  }

  delete(user: User): Promise<boolean> {
    const url: string = url_replacer(API_URLS.user.id, {userId: user.id});
    return this.http.delete(url, {headers: this.headers})
               .toPromise()
               .then(() => true);
  }

  create(user: User): Promise<User> {
    return this.http.post(API_URLS.user.info, JSON.stringify(user), {headers: this.headers})
               .toPromise()
               .then(() => user);
  }
}
