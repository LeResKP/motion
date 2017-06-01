import { Component } from '@angular/core';

import { MdDialogRef } from '@angular/material';

import { WorkerService } from './worker.service';


@Component({
  moduleId: module.id,
  template: `
  <div [ngSwitch]="workerService.getState()">
    <ng-container *ngSwitchCase="workerService.state.BLOCKED">
      Push Messaging Blocked.
    </ng-container>
    <ng-container *ngSwitchCase="workerService.state.NOT_SUBSCRIBED">
     <button md-button color="primary" (click)="enable()">Enable Push Messaging</button>
    </ng-container>
    <ng-container *ngSwitchCase="workerService.state.SUBSCRIBED">
     <button md-button color="primary" (click)="disable()">Disable Push Messaging</button>
    </ng-container>
  </div>
  `,
})
export class NotificationComponent {

  constructor(public dialogRef: MdDialogRef<NotificationComponent>, public workerService: WorkerService) {}


  enable() {
    this.workerService.subscribeUser().then(() => {
      this.dialogRef.close();
    });
  }

  disable() {
    this.workerService.unsubscribeUser().then(() => {
      this.dialogRef.close();
    });
  }

}
