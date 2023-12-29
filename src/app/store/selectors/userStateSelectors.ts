import { createSelector } from '@ngrx/store';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { UserInterface } from 'src/app/models/user.interface';
import { appStateSelect } from '../selectors/appStateSelectors';
import { ProductInterface } from 'src/app/models/product.interface';

export const userSelector = createSelector(
  appStateSelect,
  (state: AppStateInterface) => state.user
);

export const userIdSelector = createSelector(
  userSelector,
  (user: UserInterface) => user.id
);

export const userOrdersSelector = createSelector(
  userSelector,
  (user: UserInterface) => user.orders
);

export const userFavoritesSelector = createSelector(
  userSelector,
  (user: UserInterface) => user.favorites
);

export const userFavoritesLengthSelector = createSelector(
  userFavoritesSelector,
  (favorites: Array<ProductInterface>) => favorites.length
);
