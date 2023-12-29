import { createAction, props } from '@ngrx/store';
import { ProductInterface } from 'src/app/models/product.interface';

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ product: ProductInterface }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ index: Number }>()
);

export const removeAllFromCart = createAction(
  '[Cart] Remove All Products From Cart'
);
