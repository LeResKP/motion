import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Camera } from './camera';
import { API_URLS, url_replacer } from '../urls';

@Injectable()
export class CameraService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private camerasUrl = '/api/cams';

  constructor(private http: Http) { }

  bool2int(b: boolean) {
    return b? 1: 0;
  }

  getCameras(): Promise<Camera[]> {
    return this.http.get(API_URLS.cams.info)
               .toPromise()
               .then(response => response? response.json().cams as Camera[]: []);
  }

  _enable(url: string, camera: Camera, value: boolean) {
    url = url_replacer(url, {cameraId: camera.id, value: this.bool2int(value)});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, {}, options)
               .toPromise()
               .then((res: Response) => res.json()['value'])
               // TODO: display message
               .catch(() => '');
  }

  enable(camera: Camera, value: boolean): Promise<boolean> {
    return this._enable(API_URLS.cams.enable, camera, value);
  }

  detection(camera: Camera, value: boolean): Promise<boolean> {
    return this._enable(API_URLS.cams.detection, camera, value);
  }

  upload(camera: Camera, value: boolean): Promise<boolean> {
    return this._enable(API_URLS.cams.upload, camera, value);
  }
}
