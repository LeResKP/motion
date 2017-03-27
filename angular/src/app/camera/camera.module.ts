import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { CameraService } from './camera.service';

import { EditComponent } from './edit.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  ]
})
export class CameraModule { }
