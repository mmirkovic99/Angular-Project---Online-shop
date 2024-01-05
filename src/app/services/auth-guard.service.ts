import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from './authorization.service';
import { Store, select } from '@ngrx/store';
import { AppStateInterface } from '../models/appState.interface';
import { userIdSelector } from '../store/selectors/userStateSelectors';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<AppStateInterface>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.store.pipe(
      select(userIdSelector),
      take(1),
      map((id: number) => {
        if (id === 0) {
          this.router.navigate(['auth/login']);
          return false;
        }
        return true;
      })
    );
  }
}
