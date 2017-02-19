import { Component, OnInit } from '@angular/core';

import { Camera } from './camera/camera';
import { CameraService } from './camera/camera.service';


@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  cameras: Camera[];


  constructor(private cameraService: CameraService) {}


  ngOnInit() {
    this.cameraService.getCameras().then(
      (cameras: Camera[]) => this.cameras = cameras);
  }

}
