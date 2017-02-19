import { NgModule }      from '@angular/core';
import { HttpModule }    from '@angular/http';

import { CameraService } from './camera.service';


@NgModule({
  imports: [ HttpModule ],
  providers: [ CameraService ],
})
export class CameraModule { }
