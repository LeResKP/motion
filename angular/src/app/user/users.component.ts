import { Component, OnInit } from '@angular/core';

import { MdDialog } from '@angular/material';

import { URLS } from '../urls';
import { User } from './user';
import { UserComponent } from './user.component';
import { UserService } from './user.service';


@Component({
  moduleId: module.id,
  template: `
    <a md-button [routerLink]="URLS.dashboard">Go to Dashboard</a>
    <md-nav-list>
      <md-list-item *ngFor="let user of users">
        <span md-line (click)="edit(user)">{{ user.email }}</span>
        <button md-icon-button (click)="edit(user)">
          <md-icon>edit</md-icon>
        </button>
        <button md-icon-button pymConfirm="Are you sure you want to delete the camera?" (confirm)="delete($event, user)">
          <md-icon>delete</md-icon>
        </button>
      </md-list-item>
    </md-nav-list>
    <a class="add" md-fab (click)="add()"><md-icon>add</md-icon></a>
  `,
  styles: [
    `a.add {
      position: fixed;
      bottom: 0px;
      right: 0px;
    }
    `
  ]
})
export class UsersComponent implements OnInit {
  URLS = URLS;

  public users: User[];

  constructor(public dialog: MdDialog, private userService: UserService) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.userService.getUsers().then((users) => this.users = users);
  }


  edit(user: User) {
    let dialogRef = this.dialog.open(UserComponent, {data: {id: user.id}});
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.fetch();
      }
    });
  }

  add() {
    let dialogRef = this.dialog.open(UserComponent, {data: {}});
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.fetch();
      }
    });
  }

  delete(ev: any, user: User) {
    this.userService.delete(user).then(
      () => this.fetch()
    );
  }

}
