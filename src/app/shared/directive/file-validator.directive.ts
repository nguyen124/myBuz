import { Directive } from '@angular/core';
import { NG_VALIDATORS, UntypedFormControl } from '@angular/forms';

@Directive({
    selector: '[appFileValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: FileValidatorDirective,
            multi: true
        }
    ],
    standalone: false
})
export class FileValidatorDirective {

  constructor() { }
  static validate(c: UntypedFormControl): { [key: string]: any } {
    return c.value == null || c.value.length == 0 ? { "required": true } : null;
  }
  validate(c: UntypedFormControl): { [key: string]: any } {
    return FileValidatorDirective.validate;
  }
}
