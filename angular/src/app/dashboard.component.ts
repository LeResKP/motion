import { Component, OnInit } from '@angular/core';

import { MdDialog, MdDialogRef } from '@angular/material';

import { Camera } from './camera/camera';
import { CameraService } from './camera/camera.service';
import { EditComponent } from './camera/edit.component';


@Component({
  moduleId: module.id,
  templateUrl: './app.component.html',
})
export class DashboardComponent implements OnInit {
  cameras: Camera[];


  constructor(public dialog: MdDialog, private cameraService: CameraService) {}


  ngOnInit() {
    this.fetch();
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

  addCamera() {
    let dialogRef = this.dialog.open(EditComponent, {data: {}});
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.fetch();
      }
    });
  }

  refresh() {
    window.location.reload();
  }

}
