import { ValidatorFn, AbstractControl} from '@angular/forms';


export class PyMValidators {

  static number(control: AbstractControl): {[key: string]: any} {
    if (control.value === null || control.value.length === 0) {
      return null;
    }
    const value = parseInt(control.value, 10);
    if (isNaN(value) || value.toString() !== control.value) {
      return {number: true};
    }
    return null;
  };
}
