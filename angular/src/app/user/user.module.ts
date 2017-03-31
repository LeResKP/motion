import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@angular/material';

import { ConfirmModule }  from '../confirm/confirm.module';

import { UserComponent } from './user.component';
import { UsersComponent } from './users.component';
import { UserService } from './user.service';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    ConfirmModule,
  ],
  declarations: [
    UserComponent,
    UsersComponent,
  ],
  entryComponents: [
    UserComponent,
  ],
  providers: [
    UserService,
  ]
})
export class UserModule { }
