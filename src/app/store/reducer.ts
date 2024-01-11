import { createReducer, on } from '@ngrx/store';
import { CartStateInterface } from '../models/cartState.interface';
import * as UserActions from './actions/UserActions';
import * as CartActions from './actions/CartActions';
import { AppStateInterface } from '../models/appState.interface';
import { ProductInterface } from '../models/product.interface';

export const initialState: AppStateInterface = {
  user: {
    id: 0,
    name: '',
    surname: '',
    email: '',
    username: '',
    password: '',
    orders: [],
    favorites: [],
  },
  cart: {
    products: [],
  },
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(UserActions.addUser, (state: AppStateInterface, data: any) => {
    return { ...state, user: data.user };
  }),
  on(UserActions.updateUserSuccess, (state: AppStateInterface, data: any) => {
    return {
      ...state,
      user: {
        ...state.user,
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email,
      },
    };
  }),
  on(UserActions.updateUserFailure, (state: AppStateInterface, data: any) => {
    return { ...state, error: data.error };
  }),
  on(
    UserActions.updateUserFavoriteList,
    (state: AppStateInterface, data: any) => {
      return { ...state, user: { ...state.user, favorites: data.favorites } };
    }
  ),
  on(UserActions.updateUserOrdes, (state: AppStateInterface, data: any) => {
    return { ...state, user: { ...state.user, orders: data.orders } };
  }),
  on(CartActions.addToCart, (state: AppStateInterface, data: any) => {
    return {
      ...state,
      cart: {
        ...state.cart,
        products: [...state.cart.products, data.product],
      },
    };
  }),
  on(CartActions.removeFromCart, (state: AppStateInterface, data: any) => {
    const index = data.index;
    return {
      ...state,
      cart: {
        ...state.cart,
        products: state.cart.products.filter(
          (_: any, i: number) => i !== index
        ),
      },
    };
  }),
  on(CartActions.removeAllFromCart, (state: AppStateInterface) => {
    return {
      ...state,
      cart: {
        ...state.cart,
        products: [],
      },
    };
  })
);
