import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CameraModule } from './camera/camera.module';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule, CameraModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
