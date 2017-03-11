import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Response } from '@angular/http';

import { MdDialogRef } from '@angular/material';

import { Camera } from './camera';
import { CameraService } from './camera.service';
import { PyMValidators } from '../validators';


@Component({
  moduleId: module.id,
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  camera: Camera;
  cameraForm: FormGroup;

  formErrors: {} = {};

  private readonly validationMessages: {} = {
    'required': 'The field is required.',
    'number': 'A number should be provided.',
  };

  constructor(private fb: FormBuilder, public dialogRef: MdDialogRef<EditComponent>, private cameraService: CameraService) {
    this.createForm();
  }

  ngOnInit() {
    let id: number = this.dialogRef.config.data.id;
    if (id) {
      this.cameraService.getCamera(id).then(
        (camera: Camera) => {
          this.camera = camera;
          this.cameraForm.setValue({
            name: this.camera.name,
            src: this.camera.src,
            host: this.camera.host,
            port: this.camera.port,
            public_url: this.camera.public_url,
          });
        }
      );
    }
  }

  public closeDialog(value?: boolean) {
    this.dialogRef.close(value);
  }

  createForm() {
    this.cameraForm = this.fb.group({
      name: [''],
      src: ['', Validators.required],
      host: ['', Validators.required],
      port: ['', [PyMValidators.number, Validators.required]],
      public_url: [''],
    });
    this.cameraForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onSubmit() {
    const camera: Camera = this.prepareSaveCamera();
    if (this.camera) {
      this.cameraService.update(camera)
                        .then(() => this.closeDialog(true))
                        .catch((res: Response) => {
                          if (res.status === 400) {
                            const errors = res.json().errors;
                            Object.keys(errors).map((key) => {
                              const error = errors[key];
                              const tmp = {};
                              tmp[error] = true;
                              this.cameraForm.controls[key].setErrors(tmp);
                            });
                            this.onValueChanged();
                          }
                        });
    } else {
      this.cameraService.create(camera)
                        .then(() => this.closeDialog(true))
                        .catch((res: Response) => {
                          if (res.status === 400) {
                            const errors = res.json().errors;
                            Object.keys(errors).map((key) => {
                              const error = errors[key];
                              const tmp = {};
                              tmp[error] = true;
                              this.cameraForm.controls[key].setErrors(tmp);
                            });
                            this.onValueChanged();
                          }
                        });
    }
  }

  prepareSaveCamera(): Camera {
    const formModel = this.cameraForm.value;

    const saveCamera: Camera = {
      id: this.camera? this.camera.id: null,
      name: formModel.name as string,
      src: formModel.src as string,
      host: formModel.host as string,
      port: formModel.port as number,
      public_url: formModel.public_url as string,
    };
    return saveCamera;
  }

  onValueChanged(data?: any) {
    if (!this.cameraForm) { return; }

    const form = this.cameraForm;
    for(const field in form.controls) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          this.formErrors[field] += this.validationMessages[key] + ' ';
        }
      }
    }
  }
}
