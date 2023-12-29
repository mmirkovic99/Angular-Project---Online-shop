import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { userFavoritesLengthSelector } from 'src/app/store/selectors/userStateSelectors';

@Component({
  selector: 'favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss'],
})
export class FavoriteButtonComponent implements OnInit {
  favoritesLength!: number;

  constructor(private store: Store<AppStateInterface>, private router: Router) {
    this.store
      .pipe(select(userFavoritesLengthSelector))
      .subscribe((data) => (this.favoritesLength = data));
  }

  ngOnInit(): void {}

  navigateFavorites(): void {
    this.router.navigate(['favorites']);
  }
}
