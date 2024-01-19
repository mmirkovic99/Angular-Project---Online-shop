import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { UserInterface } from '../models/user.interface';

export function accountCheckValidator(
  userService: UserService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const username = control.value;
    return userService.checkIfUsernameExists(username).pipe(
      map((userWithUsername: UserInterface) => {
        return !userWithUsername ? { usernameExists: false } : null;
      }),
      catchError(() => of(null))
    );
  };
}
