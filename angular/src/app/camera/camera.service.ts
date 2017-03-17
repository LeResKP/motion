import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Subject} from 'rxjs/Rx';

import { Camera } from './camera';
import { API_URLS, url_replacer } from '../urls';

@Injectable()
export class CameraService {

  public cameraChanged: Subject<number>;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
    this.cameraChanged = new Subject<number>();
  }

  bool2int(b: boolean) {
    return b? 1: 0;
  }

  getCameras(): Promise<Camera[]> {
    return this.http.get(API_URLS.cams.info)
               .toPromise()
               .then(response => response? response.json().cams as Camera[]: []);
  }

  getCamera(id:number): Promise<Camera> {
    const url: string = url_replacer(API_URLS.cams.id, {cameraId: id});
    return this.http.get(url)
               .toPromise()
               .then(response=>response?response.json().camera as Camera: null);
  }

  update(camera: Camera): Promise<Camera> {
    const url: string = url_replacer(API_URLS.cams.id, {cameraId: camera.id});
    return this.http.put(url, JSON.stringify(camera), {headers: this.headers})
               .toPromise()
               .then(() => camera);
  }

  delete(camera: Camera): Promise<boolean> {
    const url: string = url_replacer(API_URLS.cams.id, {cameraId: camera.id});
    return this.http.delete(url, {headers: this.headers})
               .toPromise()
               .then(() => true);
  }

  create(camera: Camera): Promise<Camera> {
    return this.http.post(API_URLS.cams.info, JSON.stringify(camera), {headers: this.headers})
               .toPromise()
               .then(() => camera);
  }


  _enable(url: string, camera: Camera, value: boolean) {
    url = url_replacer(url, {cameraId: camera.id, value: this.bool2int(value)});
    return this.http.post(url, {}, {headers: this.headers})
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
