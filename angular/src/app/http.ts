import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, XHRBackend } from '@angular/http';
import {Observable} from 'rxjs/Rx';


// https://github.com/angular/angular/blob/master/modules/%40angular/http/src/http.ts
@Injectable()
export class HttpInterceptor extends Http {

  constructor(protected _backend: ConnectionBackend, protected _defaultOptions: RequestOptions) {
    super(_backend, _defaultOptions);
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).catch(
      (error: Response) => {
        if (error.status === 403) {
          location.href = '/login';
          return Observable.empty();
        }
        return Observable.throw(error);
      });
  }
}


export function HttpInterceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions) {
  return new HttpInterceptor(xhrBackend, requestOptions)
}
