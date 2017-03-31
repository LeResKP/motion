import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Response } from '@angular/http';

import { MdDialogRef } from '@angular/material';

import { User } from './user';
import { UserService } from './user.service';


@Component({
  moduleId: module.id,
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  user: User;
  userForm: FormGroup;

  formErrors: any = {};

  private readonly validationMessages: {} = {
    'required': 'The field is required.',
  };

  constructor(private fb: FormBuilder, public dialogRef: MdDialogRef<UserComponent>, private userService: UserService) {
    this.createForm();
  }

  ngOnInit() {
    let id: number = this.dialogRef.config.data.id;
    if (id) {
      this.userService.getUser(id).then(
        (user: User) => {
          this.user = user;
          this.userForm.setValue({
            email: this.user.email,
            activated: this.user.activated,
            is_admin: this.user.is_admin,
          });
        }
      );
    }
  }

  public closeDialog(value?: boolean) {
    this.dialogRef.close(value);
  }

  createForm() {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      activated: [''],
      is_admin: [''],
    });
    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onSubmit() {
    const user: User = this.prepareSaveUser();
    if (this.user) {
      this.userService.update(user)
                        .then(() => this.closeDialog(true))
                        .catch((res: Response) => {
                          if (res.status === 400) {
                            const errors = res.json().errors;
                            Object.keys(errors).map((key) => {
                              const error = errors[key];
                              const tmp = {};
                              tmp[error] = true;
                              this.userForm.controls[key].setErrors(tmp);
                            });
                            this.onValueChanged();
                          }
                        });
    } else {
      this.userService.create(user)
                        .then(() => this.closeDialog(true))
                        .catch((res: Response) => {
                          if (res.status === 400) {
                            const errors = res.json().errors;
                            Object.keys(errors).map((key) => {
                              const error = errors[key];
                              const tmp = {};
                              tmp[error] = true;
                              this.userForm.controls[key].setErrors(tmp);
                            });
                            this.onValueChanged();
                          }
                        });
    }
  }

  prepareSaveUser(): User {
    const formModel = this.userForm.value;
    console.log('formModel', formModel);

    const saveUser: User = {
      id: this.user ? this.user.id : null,
      email: formModel.email as string,
      activated: formModel.activated as boolean,
      is_admin: formModel.is_admin as boolean,
    };

    console.log('saveUser', saveUser);
    return saveUser;
  }

  onValueChanged(data?: any) {
    if (!this.userForm) { return; }

    const form = this.userForm;
    for (const field in form.controls) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      console.log('field', field);
      const control = form.get(field);
      console.log('control', control);
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          let msg = this.validationMessages[key] || key;
          this.formErrors[field] += msg + ' ';
        }
      }
    }
  }
}
