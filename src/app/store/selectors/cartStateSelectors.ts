import { createSelector } from '@ngrx/store';
import { AppStateInterface } from 'src/app/models/appState.interface';
import {
  CartStateInterface,
  ProductInCartInterface,
} from 'src/app/models/cartState.interface';
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
  (cartProducts: Array<ProductInCartInterface>) => cartProducts.length
);

export const productsTotalPriceSelector = createSelector(
  productsSelector,
  (cartProducts: Array<ProductInCartInterface>) =>
    cartProducts.reduce(
      (previouseValue: number, productInCart) =>
        previouseValue + productInCart.product.price * productInCart.quantity,
      0
    )
);
