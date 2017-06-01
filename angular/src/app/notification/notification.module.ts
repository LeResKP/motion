import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { NotificationComponent } from './notification.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [
    NotificationComponent,
  ],
  entryComponents: [
    NotificationComponent,
  ],
  providers: [
  ]
})
export class NotificationModule { }
