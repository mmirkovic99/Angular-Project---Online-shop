import { createAction, props } from '@ngrx/store';
import { OrderInterface } from 'src/app/models/order.interface';
import { ProductInterface } from 'src/app/models/product.interface';
import { UserInterface } from 'src/app/models/user.interface';

// ADD USER

export const addUser = createAction(
  '[User] Add User',
  props<{ user: UserInterface }>()
);

// UPDATE USER

export const updateUser = createAction(
  '[User] Update User',
  props<{
    id: number;
    name: string;
    surname: string;
    username: string;
    email: string;
  }>()
);

export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{
    id: number;
    name: string;
    surname: string;
    username: string;
    email: string;
  }>()
);

export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: string }>()
);

// UPDATE USER FAVORITES LIST

export const updateUserFavoriteList = createAction(
  '[User] Update User Favorite List',
  props<{ id: number; favorites: Array<ProductInterface> }>()
);

export const updateUserFavoriteListSuccess = createAction(
  '[User] Update User Favorite List Success',
  props<{ id: number; favorites: Array<ProductInterface> }>()
);

export const updateUserFavoriteListFailure = createAction(
  '[User] Update User Favorite List Failure',
  props<{ error: string }>()
);

// UPDATE USER ORDERS

export const updateUserOrdes = createAction(
  '[User] Update User Orders',
  props<{ id: number; orders: Array<OrderInterface> }>()
);

export const updateUserOrdesSuccess = createAction(
  '[User] Update User Orders Success',
  props<{ id: number; orders: Array<OrderInterface> }>()
);

export const updateUserOrdesFailure = createAction(
  '[User] Update User Orders Failure',
  props<{ error: string }>()
);
