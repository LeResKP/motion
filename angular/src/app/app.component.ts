import { Component } from '@angular/core';

import { MdDialog } from '@angular/material';

import { CameraService } from './camera/camera.service';
import { EditComponent } from './camera/edit.component';


@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(public dialog: MdDialog, private cameraService: CameraService) {}

  addCamera() {
    let dialogRef = this.dialog.open(EditComponent, {data: {}});
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cameraService.cameraChanged.next();
      }
    });
  }

  refresh() {
    window.location.reload();
  }
}
