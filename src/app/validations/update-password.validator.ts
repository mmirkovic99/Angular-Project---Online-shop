import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const updatePasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.newPassword === control.value.confirmNewPassword
    ? null
    : { passwordNoMatch: true };
};
