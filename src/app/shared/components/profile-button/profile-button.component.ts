import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { userIdSelector } from 'src/app/store/selectors/userStateSelectors';
import * as UserAction from '../../../store/actions/UserActions';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss'],
})
export class ProfileButtonComponent implements OnInit, OnDestroy {
  isLogin!: boolean;
  private subscription!: Subscription;
  @ViewChild('checkbox') userButtonCheckbox!: ElementRef;

  constructor(
    private store: Store<AppStateInterface>,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(select(userIdSelector))
      .subscribe((id: number) => {
        this.isLogin = id === 0;
      });
  }

  navigateToLogin() {
    this.userButtonCheckbox.nativeElement.checked = false;
    this.router.navigate(['auth/login']);
  }

  navigateToSignup() {
    this.router.navigate(['auth/registration']);
  }

  navigateToProfile() {
    this.router.navigate(['profile']);
  }

  logout() {
    this.store.dispatch(UserAction.userLogout());
    this.navigateToLogin();
  }
}
