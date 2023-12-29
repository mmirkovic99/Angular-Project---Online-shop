import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { userIdSelector } from 'src/app/store/selectors/userStateSelectors';

@Component({
  selector: 'profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss'],
})
export class ProfileButtonComponent implements OnInit {
  private direction!: string;

  constructor(
    private store: Store<AppStateInterface>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.pipe(select(userIdSelector)).subscribe((id: number) => {
      if (id === 0) this.direction = 'auth/login';
      else this.direction = 'profile';
    });
  }

  navigate() {
    this.router.navigate([this.direction]);
  }
}
