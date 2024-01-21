import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserAction from '../actions/UserActions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { UserInterface } from '../../models/user.interface';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.updateUser),
      mergeMap((action: any) =>
        this.userService
          .updateUserData(
            action.id,
            action.name,
            action.surname,
            action.username,
            action.email
          )
          .pipe(
            map((user: UserInterface) =>
              UserAction.updateUserSuccess({
                id: user.id,
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.username,
              })
            ),
            catchError((error) =>
              of(
                UserAction.updateUserFailure({
                  error: error.message,
                })
              )
            )
          )
      )
    )
  );

  updateUserPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.updateUserPassword),
      mergeMap((action: any) =>
        this.userService.updateUserPassword(action.id, action.password).pipe(
          map((user: UserInterface) =>
            UserAction.updateUserPasswordSuccess({
              id: user.id,
              password: user.password,
            })
          ),
          catchError((error) =>
            of(
              UserAction.updateUserPasswordFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  updateUserFavoritesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.updateUserFavoriteList),
      mergeMap((action: any) =>
        this.userService
          .updateUserFavoriteList(action.id, action.favorites)
          .pipe(
            map((user: UserInterface) =>
              UserAction.updateUserFavoriteListSuccess({
                id: user.id,
                favorites: user.favorites,
              })
            ),
            catchError((error) =>
              of(
                UserAction.updateUserFavoriteListFailure({
                  error: error.message,
                })
              )
            )
          )
      )
    )
  );

  updateOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.updateUserOrdes),
      mergeMap((action: any) =>
        this.userService.orderProducts(action.id, action.orders).pipe(
          map(
            (user: UserInterface) =>
              UserAction.updateUserOrdesSuccess({
                id: user.id,
                orders: user.orders,
              }),
            catchError((error) =>
              of(
                UserAction.updateUserOrdesFailure({
                  error: error.message,
                })
              )
            )
          )
        )
      )
    )
  );
}
