import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as UserAction from '../../store/actions/UserActions';

import { AppStateInterface } from 'src/app/models/appState.interface';
import { ProductInterface } from 'src/app/models/product.interface';
import {
  userFavoritesSelector,
  userIdSelector,
} from 'src/app/store/selectors/userStateSelectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit, OnDestroy {
  userId!: number;
  favorites!: Array<ProductInterface>;

  subscriptions: Subscription[] = [];

  constructor(private store: Store<AppStateInterface>, private router: Router) {
    this.setUserId();
    this.setFavoritesSelector();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  navigateProduct(id: number) {
    this.router.navigate([`product/${id}`]);
  }

  removeFromFavorites(id: number) {
    this.store.dispatch(
      UserAction.updateUserFavoriteList({
        id: this.userId,
        favorites: this.favorites.filter(
          (product: ProductInterface) => product.id !== id
        ),
      })
    );
  }

  private setUserId() {
    this.subscriptions.push(
      this.store.pipe(select(userIdSelector)).subscribe((id: number) => {
        this.userId = id;
      })
    );
  }

  private setFavoritesSelector() {
    this.subscriptions.push(
      this.store
        .pipe(select(userFavoritesSelector))
        .subscribe(
          (favorites: ProductInterface[]) => (this.favorites = favorites)
        )
    );
  }

  private unsubscribe() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
