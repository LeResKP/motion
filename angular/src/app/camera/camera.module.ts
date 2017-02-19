import { NgModule } from '@angular/core';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';

import { CameraService } from './camera.service';

import { HttpInterceptorFactory } from '../http';




@NgModule({
  imports: [ HttpModule ],
  providers: [
    CameraService,
    {
      provide: Http,
      useFactory: HttpInterceptorFactory,
      deps: [XHRBackend, RequestOptions]
    }
  ]
})
export class CameraModule { }
