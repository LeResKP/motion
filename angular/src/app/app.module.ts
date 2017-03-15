import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

import { CameraModule } from './camera/camera.module';

import { AppComponent }  from './app.component';
import { DashboardComponent }  from './dashboard.component';
import { ConfirmModule }  from './confirm/confirm.module';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';


@NgModule({
  imports:      [
    BrowserModule,
    FlexLayoutModule,
    MaterialModule.forRoot(),

    CameraModule,
    ConfirmModule,
    AppRoutingModule,
  ],
  providers: [ AuthGuard, AuthService ],
  declarations: [ AppComponent, DashboardComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
