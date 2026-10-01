import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isValidUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    try {
      const url = new URL(control.value);
      // Must be http or https
      if (!url.protocol.startsWith('http')) {
        return { invalidUrl: true };
      }
      return null;
    } catch (e) {
      return { invalidUrl: true };
    }
  };
}
