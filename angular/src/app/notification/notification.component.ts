import { Component, OnInit } from '@angular/core';

import { WorkerService } from './worker.service';


@Component({
  moduleId: module.id,
  template: `
  <div [ngSwitch]="workerService.isBlocked()">
    <ng-container *ngSwitchCase="true">Push Messaging Blocked.</ng-container>
    <ng-container *ngSwitchCase="false">
     <button md-button color="primary" (click)="workerService.subscribeUser()" *ngIf="!workerService.isSubscribed">Enable Push Messaging</button>
     <button md-button color="primary" (click)="workerService.unsubscribeUser()" *ngIf="workerService.isSubscribed">Disable Push Messaging</button>
    </ng-container>
  </div>
  `,
})
export class NotificationComponent {

  constructor(public workerService: WorkerService) {}

}
