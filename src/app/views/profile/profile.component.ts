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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  user!: UserInterface;

  userSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppStateInterface>
  ) {}

  ngOnInit(): void {
    this.setUser();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  getControl(name: string): FormControl {
    return this.profileForm.get(name) as FormControl;
  }

  updateData(): void {
    this.store.dispatch(
      UserAction.updateUser({
        id: this.user.id,
        name: this.getControl('name').value,
        surname: this.getControl('surname').value,
        email: this.getControl('email').value,
        username: this.getControl('username').value,
      })
    );
  }

  private setUser(): void {
    this.userSubscription = this.store
      .pipe(select(userSelector))
      .subscribe((user: UserInterface) => {
        this.user = user;
        this.setForm(this.user);
      });
  }

  private setForm(user: UserInterface): void {
    this.profileForm = this.formBuilder.group({
      name: [user.name, Validators.required],
      surname: [user.surname, Validators.required],
      email: [user.email, Validators.required],
      username: [user.username, Validators.required],
    });
  }
}
