import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Camera } from './camera';
import { API_URLS } from '../urls';

@Injectable()
export class CameraService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private camerasUrl = '/api/cams';

  constructor(private http: Http) { }

  getCameras(): Promise<Camera[]> {
    return this.http.get(API_URLS.cams)
               .toPromise()
               .then(response => response? response.json().cams as Camera[]: []);
  }
}
