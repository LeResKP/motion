import { AfterViewInit, Component, ElementRef } from '@angular/core';

import { GoogleAuth2Service } from './google-auth2.service';


@Component({
  moduleId: module.id,
  template: `
    <div *ngIf="googleAuth2Service.error">An error occurred, you can't loggedin</div>
  `,
})
export class LoginComponent implements AfterViewInit {

  constructor(private elementRef: ElementRef, public googleAuth2Service: GoogleAuth2Service) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.appendChild(
      this.googleAuth2Service.getScriptElement());
  }
}
