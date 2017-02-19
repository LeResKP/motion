import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Camera } from './camera';
import { HttpInterceptor } from '../http';

@Injectable()
export class CameraService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private camerasUrl = '/api/cams';

  constructor(private http: Http) { }

  getCameras(): Promise<Camera[]> {
    return this.http.get(this.camerasUrl)
               .toPromise()
               .then(response => response.json().cams as Camera[])
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
