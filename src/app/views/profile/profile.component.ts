import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { UserInterface } from 'src/app/models/user.interface';
import * as UserAction from '../../store/actions/UserActions';
import { userSelector } from 'src/app/store/selectors/userStateSelectors';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { updatePasswordValidator } from 'src/app/validations/update-password.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  user!: UserInterface;
  isChangePassword: boolean = false;

  userSubscription!: Subscription;
  newPasswordsMatch: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppStateInterface>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setUser();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  getControl(form: FormGroup, name: string): FormControl {
    return form.get(name) as FormControl;
  }

  updateData(): void {
    this.store.dispatch(
      UserAction.updateUser({
        id: this.user.id,
        name: this.getControl(this.profileForm, 'name').value,
        surname: this.getControl(this.profileForm, 'surname').value,
        email: this.getControl(this.profileForm, 'email').value,
        username: this.getControl(this.profileForm, 'username').value,
      })
    );
  }

  editPassword(): void {
    this.isChangePassword = !this.isChangePassword;
    if (!this.isChangePassword) return;
  }

  savePassword(): void {
    this.store.dispatch(
      UserAction.updateUserPassword({
        id: this.user.id,
        password: this.getControl(this.passwordForm, 'newPassword').value,
      })
    );
    // this.router.navigate(['auth/login']);
  }

  private setUser(): void {
    this.userSubscription = this.store
      .pipe(select(userSelector))
      .subscribe((user: UserInterface) => {
        this.user = user;
        this.setForms(this.user);
      });
  }

  private setForms(user: UserInterface): void {
    this.profileForm = this.formBuilder.group({
      name: [user.name, Validators.required],
      surname: [user.surname, Validators.required],
      email: [user.email, Validators.required],
      username: [user.username, Validators.required],
    });
    this.passwordForm = this.formBuilder.group(
      {
        oldPassword: [
          '',
          [Validators.required, Validators.pattern(user.password)],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).+$/
            ),
          ],
        ],
        confirmNewPassword: ['', Validators.required],
      },
      { validators: [updatePasswordValidator] }
    );
  }
}
