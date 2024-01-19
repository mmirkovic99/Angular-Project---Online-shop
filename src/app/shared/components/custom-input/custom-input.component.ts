import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormFields, FormType } from 'src/app/constants/form.constants';

@Component({
  selector: 'custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit, DoCheck {
  @Input() label!: string;
  @Input() type!: 'text' | 'password';
  @Input() control: FormControl = new FormControl();
  @Input() error?: boolean;

  @Input() passwordNoMatch?: boolean;

  @Input() formType!: FormType;

  errorMessage: string = '';

  ngDoCheck(): void {
    if (this.error) this.showError(this.label);
    else this.errorMessage = '';
  }

  ngOnInit(): void {}

  private showError(label: string) {
    switch (label) {
      case FormFields.NAME:
        this.setErrorRequiredField(label);
        break;
      case FormFields.SURNAME:
        this.setErrorRequiredField(label);
        break;
      case FormFields.USERNAME:
        this.handleUsernameError(this.control, FormFields.USERNAME);
        break;
      case FormFields.EMAIL:
        this.handleEmailError(this.control, FormFields.EMAIL);
        break;
      case FormFields.PASSWORD:
        this.handlePasswordError(this.control, FormFields.PASSWORD);
        break;
      case FormFields.OLD_PASSWORD:
        this.handleOldPassword(this.control, FormFields.OLD_PASSWORD);
        break;
      case FormFields.NEW_PASSWORD:
        this.handleNewPassword(this.control, FormFields.NEW_PASSWORD);
        break;
      case FormFields.CONFIRM_NEW_PASSWORD:
        this.handleConfirmNewPassword(FormFields.CONFIRM_NEW_PASSWORD);
        break;
      default:
        this.handleConfirmPassword(this.control, this.label);
    }
  }

  private handleUsernameError(control: FormControl, label: string): void {
    const setErrorBasedOnProfileForm = (
      control: FormControl,
      label: string
    ): void => {
      if (!control.errors?.usernameExists) {
        this.setErrorRequiredField(label);
      } else {
        this.setErrorUsernameTaken(label);
      }
    };

    const setErrorBasedOnLoginForm = (
      control: FormControl,
      label: string
    ): void => {
      if (control.errors?.required) {
        this.setErrorRequiredField(label);
      } else if (!control.errors?.usernameExists) {
        this.setErrorUsernameNotFound(label);
      }
    };

    const setErrorBasedOnRegistrationForm = (
      control: FormControl,
      label: string
    ): void => {
      if (control.errors?.required) {
        this.setErrorRequiredField(label);
      } else if (control.errors?.usernameExists) {
        this.setErrorUsernameTaken(label);
      }
    };

    if (this.formType === FormType.PROFILE) {
      setErrorBasedOnProfileForm(control, label);
    } else if (this.formType === FormType.LOGIN) {
      setErrorBasedOnLoginForm(control, label);
    } else if (this.formType === FormType.REGISTRATION) {
      setErrorBasedOnRegistrationForm(control, label);
    }
  }

  private handlePasswordError(control: FormControl, label: string): void {
    if (!control.dirty) this.setErrorRequiredField(label);
    else if (!control.valid)
      this.errorMessage = `${label} is invalid. ${label} must contain at least one uppercase letter and one special character, and it must be a minimum of 8 characters long.`;
  }

  private handleEmailError(control: FormControl, label: string): void {
    if (!control.dirty) this.setErrorRequiredField(label);
    else if (!control.valid) this.errorMessage = `${label} is invalid.`;
  }

  private handleConfirmPassword(control: FormControl, label: string) {
    console.log(this.passwordNoMatch);

    if (!control.dirty && control.touched) this.setErrorRequiredField(label);
    else if (this.passwordNoMatch)
      this.errorMessage = `Password and ${label} fields do not match.`;
  }

  private handleOldPassword(control: FormControl, label: string): void {
    if (!control.valid)
      this.errorMessage = `${label} is invalid. ${label} must match your current password.`;
  }

  private handleNewPassword(control: FormControl, label: string) {
    if (!control.valid)
      this.errorMessage = `${label} is invalid. ${label} must contain at least one uppercase letter and one special character, and it must be a minimum of 8 characters long.`;
  }

  private handleConfirmNewPassword(label: string) {
    this.errorMessage = `New Password and ${label} fields do not match.`;
  }

  private setErrorRequiredField(label: string): void {
    this.errorMessage = `${label} is required field.`;
  }

  private setErrorUsernameTaken(label: string): void {
    this.errorMessage = `${label} is already taken.`;
  }

  private setErrorUsernameNotFound(label: string): void {
    this.errorMessage = `${label} doesn't exists.`;
  }
}
