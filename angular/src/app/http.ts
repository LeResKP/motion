import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Http, ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, XHRBackend } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import { AuthService } from './auth.service';

import { API_URLS } from './urls';


// https://github.com/angular/angular/blob/master/modules/%40angular/http/src/http.ts
@Injectable()
export class HttpInterceptor extends Http {

  constructor(protected _backend: ConnectionBackend, protected _defaultOptions: RequestOptions, private injector: Injector) {
    super(_backend, _defaultOptions);
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).catch(
      (error: Response) => {
        if (error.status === 401) {
          const authService = this.injector.get(AuthService);
          const router = this.injector.get(Router);

          authService.redirectUrl = router.url;
          router.navigate(['/login']);
          if (url instanceof Request ) {
            url = url.url;
          }
          if (url === API_URLS.auth.login) {
            // We need to returns error on the login call since it's used in
            // the guard and we always need to return a value in the guard.
            // NOTE: We don't need check the method here since the POST should
            // never returns a 401
            return Observable.throw(error);
          }
          return Observable.never();
        }
        return Observable.throw(error);
      });
  }
}


export function HttpInterceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, injector: Injector) {
  return new HttpInterceptor(xhrBackend, requestOptions, injector);
}
