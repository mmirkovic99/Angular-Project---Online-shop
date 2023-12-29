import { createSelector } from '@ngrx/store';
import { AppStateInterface } from 'src/app/models/appState.interface';
import { CartStateInterface } from 'src/app/models/cartState.interface';
import { appStateSelect } from '../selectors/appStateSelectors';
import { ProductInterface } from 'src/app/models/product.interface';

export const cartSelector = createSelector(
  appStateSelect,
  (state: AppStateInterface) => state.cart
);

export const productsSelector = createSelector(
  cartSelector,
  (cart: CartStateInterface) => cart.products
);

export const productsLengthSelector = createSelector(
  productsSelector,
  (cartProducts: Array<ProductInterface>) => cartProducts.length
);

export const productsTotalPriceSelector = createSelector(
  productsSelector,
  (cartProducts: Array<ProductInterface>) =>
    cartProducts.reduce(
      (previouseValue: number, product) => previouseValue + product.price,
      0
    )
);
