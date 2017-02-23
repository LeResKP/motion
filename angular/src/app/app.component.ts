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

  enabledChange(ev: any, camera:Camera) {
    this.cameraService.enable(camera, ev.checked).then(
      (value: boolean) => camera.enabled=value);
  }

  detectionChange(ev: any, camera:Camera) {
    this.cameraService.detection(camera, ev.checked).then(
      (value: boolean) => camera.detection_enabled=value);
  }

  uploadChange(ev: any, camera:Camera) {
    this.cameraService.upload(camera, ev.checked).then(
      (value: boolean) => camera.upload_enabled=value);
  }

}
