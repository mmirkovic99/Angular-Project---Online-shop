import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserInterface } from 'src/app/models/user.interface';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  id!: number;
  registrationForm!: FormGroup;

  subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    private authService: AuthorizationService,
    private userService: UserService,
    private router: Router
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.setId();
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getControl(name: string): FormControl {
    return this.registrationForm.get(name) as FormControl;
  }

  registration() {
    const data = Object.assign({ id: this.id }, this.registrationForm.value);
    delete data.confirmPassword;
    this.subscriptions.push(
      this.authService.registration(data).subscribe(() => {
        this.router.navigate(['']);
      })
    );
  }

  private buildForm() {
    this.registrationForm = this.fb.group({
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

  private setId() {
    // TO DO: Implement this in a better way
    this.subscriptions.push(
      this.userService
        .getAllUsers()
        .subscribe((users: UserInterface[]) => (this.id = users.length + 1))
    );
  }

  private unsubscribe() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
