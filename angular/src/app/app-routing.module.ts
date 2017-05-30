import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { LoginComponent } from './login.component';
import { UsersComponent } from './user/users.component';
import { AuthGuard } from './auth-guard.service';


const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    // Be sure gapi is loaded
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [AuthGuard],
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
