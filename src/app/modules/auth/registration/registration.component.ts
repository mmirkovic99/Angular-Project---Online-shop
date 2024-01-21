import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { AuthorizationService } from 'src/app/services/authorization.service';
import * as UserAction from '../../../store/actions/UserActions';
import { confirmPasswordValidator } from 'src/app/validations/confirm-password.validator';
import { usernameAvailabilityValidator } from 'src/app/validations/username-availability.validator';
import { UserService } from 'src/app/services/user.service';
import { FormFields, FormType } from 'src/app/constants/form.constants';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  registrationSubscriptions: Subscription | undefined;

  formType: FormType = FormType.REGISTRATION;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthorizationService,
    private router: Router,
    private store: Store<AppStateInterface>,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getControl(name: string): FormControl {
    return this.registrationForm.get(name) as FormControl;
  }

  registration(): void {
    const newUser = Object.assign(
      { favorites: [], orders: [] },
      this.registrationForm.value
    );
    delete newUser.confirmPassword;
    this.registrationSubscriptions = this.authService
      .registration(newUser)
      .subscribe(() => {
        this.store.dispatch(UserAction.addUser({ user: newUser }));
        this.router.navigate(['']);
      });
  }

  private buildForm(): void {
    this.registrationForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [Validators.required],
          [usernameAvailabilityValidator(this.userService)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).+$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [confirmPasswordValidator] }
    );
  }

  displayError(fieldName: string): boolean {
    const control = this.getControl(fieldName);

    fieldName =
      fieldName === 'confirmPassword' ? FormFields.CONFIRM_PASSWORD : fieldName;

    const isValid = control.valid;
    const isDirty = control.dirty;
    const isTouched = control.touched;

    switch (fieldName) {
      case FormFields.NAME.toLocaleLowerCase():
      case FormFields.SURNAME.toLocaleLowerCase():
      case FormFields.EMAIL.toLocaleLowerCase():
      case FormFields.PASSWORD.toLocaleLowerCase():
        return !isValid && (isDirty || isTouched);
      case FormFields.USERNAME.toLocaleLowerCase(): {
        const usernameFound = control.errors?.usernameExists;
        return (
          usernameFound || ((isDirty || isTouched) && control.value === '')
        );
      }
      case FormFields.CONFIRM_PASSWORD: {
        return (
          (!isValid || this.registrationForm.errors?.passwordNoMatch) &&
          (isDirty || isTouched)
        );
      }
      default:
        return false;
    }
  }

  private unsubscribe(): void {
    this.registrationSubscriptions?.unsubscribe();
  }
}
