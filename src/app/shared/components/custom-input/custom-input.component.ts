import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormFields } from 'src/app/constants/form.constants';

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

  errorMessage: string = '';

  ngDoCheck(): void {
    if (this.error) this.showError(this.label);
    else this.errorMessage = '';
  }

  ngOnInit(): void {}

  private showError(label: string) {
    console.log(label);
    switch (label) {
      case FormFields.name:
      case FormFields.surname:
      case FormFields.username:
        this.errorMessage = `${this.label} is required field.`;
        break;
      case FormFields.email:
        this.handleEmailError(this.control, FormFields.email);
        break;
      case FormFields.password:
        this.handlePasswordError(this.control, FormFields.password);
        break;
      case FormFields.oldPassword:
        this.handleOldPassword(this.control, FormFields.oldPassword);
        break;
      case FormFields.newPassword:
        this.handleNewPassword(this.control, FormFields.newPassword);
        break;
      case FormFields.confirmNewPassword:
        this.handleConfirmNewPassword(
          this.control,
          FormFields.confirmNewPassword
        );
        break;
      default:
        this.handleConfirmPassword(this.control, this.label);
    }
  }

  private handlePasswordError(control: FormControl, label: string): void {
    if (!control.dirty) this.errorMessage = `${label} is required field.`;
    else if (!control.valid)
      this.errorMessage = `${label} is invalid. ${label} must contain at least one uppercase letter and one special character, and it must be a minimum of 8 characters long.`;
  }

  private handleEmailError(control: FormControl, label: string): void {
    if (!control.dirty) this.errorMessage = `${label} is required field.`;
    else if (!control.valid) this.errorMessage = `${label} is invalid.`;
  }

  private handleConfirmPassword(control: FormControl, label: string) {
    if (!control.dirty || control.touched)
      this.errorMessage = `${label} is required field.`;
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

  private handleConfirmNewPassword(control: FormControl, label: string) {
    this.errorMessage = `New Password and ${label} fields do not match.`;
  }
}
