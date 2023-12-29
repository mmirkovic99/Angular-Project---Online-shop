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

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  registrationSubscriptions: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthorizationService,
    private router: Router,
    private store: Store<AppStateInterface>
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
    this.registrationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
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
    });
  }

  private unsubscribe(): void {
    this.registrationSubscriptions?.unsubscribe();
  }
}
