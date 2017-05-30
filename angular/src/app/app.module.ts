import { Injector, NgModule }      from '@angular/core';
import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CameraModule } from './camera/camera.module';
import { UserModule } from './user/user.module';

import { AppComponent }  from './app.component';
import { DashboardComponent }  from './dashboard.component';
import { LoginComponent }  from './login.component';
import { ConfirmModule }  from './confirm/confirm.module';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { GoogleAuth2Service } from './google-auth2.service';
import { KeyService } from './key.service';

import { HttpInterceptorFactory } from './http';


@NgModule({
  imports:      [
    BrowserModule,
    FlexLayoutModule,
    MaterialModule.forRoot(),

    CameraModule,
    UserModule,
    ConfirmModule,
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    GoogleAuth2Service,
    KeyService,
    {
      provide: Http,
      useFactory: HttpInterceptorFactory,
      deps: [XHRBackend, RequestOptions, Injector]
    }
  ],
  declarations: [ AppComponent, DashboardComponent, LoginComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
