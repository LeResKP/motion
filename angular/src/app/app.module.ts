import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from '@angular/material';

import { CameraModule } from './camera/camera.module';

import { AppComponent }  from './app.component';


@NgModule({
  imports:      [ BrowserModule, CameraModule, MaterialModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
