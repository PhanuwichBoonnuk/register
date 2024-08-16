import * as dayjs from 'dayjs';
import { FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomValidators {
  static emailPattern = Validators.pattern(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  static strongPasswordPattern = Validators.pattern(
    /(?=.{8,})(?=.*?[^\w\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/
  );

  static confirmPassword() {
    return (control: FormControl) => {
      if (control.parent && control.parent.get('password')) {
        if (control.parent.get('password').value !== control.value) {
          return {
            invalidConfirmPassword: true,
          };
        }
      }
      return null;
    };
  }
}
