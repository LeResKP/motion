import { Component, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { MdDialog, MdDialogRef } from '@angular/material';


@Directive({ selector: '[pymConfirm]' })
export class ConfirmDirective {

    @Output() confirm: EventEmitter<any> = new EventEmitter();
    @Output() reject: EventEmitter<any> = new EventEmitter();

    @Input('pymConfirm') body: string;

    @HostListener('click', ['$event']) onClick(e: any) {
      let dialogRef = this.dialog.open(ConfirmComponent, {data: {body: this.body}});
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.confirm.emit(e);
        }
        else {
          this.reject.emit(e);
        }
      });
    }

    constructor(private dialog: MdDialog) {}
}



@Component({
  moduleId: module.id,
  template: `
    <div md-dialog-content>{{body}}</div>
    <br>
    <br>
    <div md-dialog-actions>
    <button md-button color="primary" (click)="dialogRef.close(false);">Reject</button>
    <span class="fill-remaining-space"></span>
    <button md-raised-button color="primary" (click)="dialogRef.close(true);">Confirm</button>
    </div>
  `,
})
export class ConfirmComponent implements OnInit {

  body: string;

  constructor(public dialogRef: MdDialogRef<ConfirmComponent>) {}

  ngOnInit() {
    this.body = this.dialogRef.config.data.body;
  }
}
