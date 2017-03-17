import { Component, OnDestroy, OnInit } from '@angular/core';

import { MdDialog } from '@angular/material';

import { Camera } from './camera/camera';
import { CameraService } from './camera/camera.service';
import { EditComponent } from './camera/edit.component';

import { Subscription } from 'rxjs/Rx';


@Component({
  moduleId: module.id,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy, OnInit {
  public cameras: Camera[];
  private cameraSub: Subscription;


  constructor(public dialog: MdDialog, private cameraService: CameraService) {}


  ngOnInit() {
    this.cameraSub = this.cameraService.cameraChanged.subscribe(() => this.fetch());
    this.fetch();
  }

  ngOnDestroy() {
    this.cameraSub.unsubscribe();
  }

  fetch() {
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

  editCamera(camera:Camera) {
    let dialogRef = this.dialog.open(EditComponent, {data: {id: camera.id}});
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.fetch();
      }
    });
  }

  deleteCamera(camera:Camera) {
    this.cameraService.delete(camera).then(
      () => this.fetch()
    );
  }

}
