import { createAction, props } from '@ngrx/store';
import { ProductInCartInterface } from 'src/app/models/cartState.interface';
import { ProductInterface } from 'src/app/models/product.interface';

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ product: ProductInCartInterface }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ index: Number }>()
);

export const removeAllFromCart = createAction(
  '[Cart] Remove All Products From Cart'
);
