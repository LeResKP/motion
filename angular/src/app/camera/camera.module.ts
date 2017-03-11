import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';

import { MaterialModule } from '@angular/material';

import { CameraService } from './camera.service';

import { EditComponent } from './edit.component';

import { HttpInterceptorFactory } from '../http';




@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
  ],
  declarations: [
    EditComponent,
  ],
  entryComponents: [
    EditComponent,
  ],
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
