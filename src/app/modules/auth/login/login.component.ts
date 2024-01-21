import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as UserAction from '../../../store/actions/UserActions';
import { Subscription } from 'rxjs';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { UserInterface } from 'src/app/models/user.interface';
import { FormFields, FormType } from 'src/app/constants/form.constants';
import { UserService } from 'src/app/services/user.service';
import { accountCheckValidator } from 'src/app/validations/account-check.validator';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterContentChecked {
  formType: FormType = FormType.LOGIN;

  loginForm: FormGroup = this.fb.group({
    username: [
      '',
      [Validators.required],
      [accountCheckValidator(this.userService)],
    ],
    password: ['', Validators.required],
  });

  loginSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthorizationService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private store: Store<AppStateInterface>,
    private userService: UserService
  ) {}
  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  getControl(name: string): FormControl {
    return this.loginForm.get(name) as FormControl;
  }

  login() {
    this.loginSubscription = this.authService
      .login()
      .subscribe((data: UserInterface[]) => {
        const user = data.find(
          (user) =>
            user.username === this.loginForm.value.username &&
            user.password === this.loginForm.value.password
        );
        if (user) {
          this.router.navigate(['']);
          this.store.dispatch(UserAction.addUser({ user }));
        }
      });
  }

  displayError(fieldName: string): boolean {
    const control = this.getControl(fieldName);

    const isValid = control.valid;
    const isDirty = control.dirty;
    const isTouched = control.touched;

    if (fieldName === FormFields.USERNAME.toLowerCase()) {
      // Username error
      const usernameNotFound = control.errors?.usernameExists;
      return !isValid && (isDirty || isTouched) && !usernameNotFound;
    } else {
      // Passowrd error
      return !isValid && (isDirty || isTouched);
    }
  }

  navigateRegistration() {
    this.router.navigate(['auth/registration']);
  }
}
