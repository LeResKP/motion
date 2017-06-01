import { Component, OnInit } from '@angular/core';

import { MdDialog } from '@angular/material';

import { AuthService } from './auth.service';
import { CameraService } from './camera/camera.service';
import { EditComponent } from './camera/edit.component';
import { NotificationComponent } from './notification/notification.component';
import { URLS } from './urls';
import { WorkerService } from './notification/worker.service';
import { GoogleAuth2Service } from './google-auth2.service';


@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  URLS = URLS;

  constructor(public dialog: MdDialog, private cameraService: CameraService,
    public authService: AuthService, private workerService: WorkerService,
    private googleAuth2Service: GoogleAuth2Service) {}

  ngOnInit() {
    this.workerService.register();
  }

  addCamera() {
    let dialogRef = this.dialog.open(EditComponent, {data: {}});
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cameraService.cameraChanged.next();
      }
    });
  }

  notificationModal() {
    this.dialog.open(NotificationComponent);
  }

  refresh() {
    window.location.reload();
  }

  signOut() {
    this.googleAuth2Service.signOut();
  }
}
