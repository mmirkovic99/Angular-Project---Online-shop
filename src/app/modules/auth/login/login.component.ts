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

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterContentChecked {
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  loginSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthorizationService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private store: Store<AppStateInterface>
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
    // TO DO: Implement this in a better way
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

  navigateRegistration() {
    this.router.navigate(['auth/registration']);
  }
}
