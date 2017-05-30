import { AfterViewInit, Component } from '@angular/core';

import { GoogleAuth2Service } from './google-auth2.service';


/* We use custom button because of https://github.com/google/google-api-javascript-client/issues/281

See doc here: https://developers.google.com/identity/sign-in/web/build-button#building_a_button_with_a_custom_graphic
*/

@Component({
  moduleId: module.id,
  template: `
    <div id="my-signin2" class="customGPlusSignIn">
      <span class="icon"></span>
      <span class="buttonText">Sign in with google</span>
    </div>
    <div *ngIf="googleAuth2Service.error">An error occurred, you can't loggedin</div>
  `,
  styles: [
  `#my-signin2 {
      display: inline-block;
      background: white;
      color: #444;
      width: 190px;
      border-radius: 5px;
      border: thin solid #888;
      box-shadow: 1px 1px 1px grey;
      white-space: nowrap;
    }
    #my-signin2:hover {
      cursor: pointer;
    }
    span.label {
      font-family: serif;
      font-weight: normal;
    }
    span.icon {
      background: url('https://developers.google.com/identity/sign-in/g-normal.png') transparent 5px 50% no-repeat;
      display: inline-block;
      vertical-align: middle;
      width: 42px;
      height: 42px;
    }
    span.buttonText {
      display: inline-block;
      vertical-align: middle;
      padding-left: 0px;
      padding-right: 20px;
      font-size: 14px;
      font-weight: bold;
      font-family: 'Roboto', sans-serif;
    }`
  ]
})
export class LoginComponent implements AfterViewInit {

  constructor(private googleAuth2Service: GoogleAuth2Service) {}

  ngAfterViewInit() {
    this.googleAuth2Service.initSignInButton('my-signin2');
  }
}
