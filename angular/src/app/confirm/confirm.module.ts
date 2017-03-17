import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { ConfirmComponent, ConfirmDirective }  from './confirm';


@NgModule({
  imports:      [
    CommonModule,
    MaterialModule,
  ],
  declarations: [ ConfirmDirective, ConfirmComponent ],
  exports: [
    ConfirmDirective,
  ],
  entryComponents: [
    ConfirmComponent,
  ],
})
export class ConfirmModule { }
