import { NgModule } from '@angular/core';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';

import { CameraService } from './camera.service';

import { HttpInterceptor } from '../http';


@NgModule({
  imports: [ HttpModule ],
  providers: [
    CameraService,
    {
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions) => new HttpInterceptor(
        xhrBackend, requestOptions,),
        deps: [XHRBackend, RequestOptions]
    }
  ]
})
export class CameraModule { }
